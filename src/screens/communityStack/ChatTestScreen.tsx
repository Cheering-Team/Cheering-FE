import {useNavigation} from '@react-navigation/native';
import * as RootNavigation from '../../navigations/RootNavigation';
import * as StompJs from '@stomp/stompjs';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {reIssueToken} from '../../apis';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatTestScreen = () => {
  const navigation = useNavigation();

  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState('');

  const [isRefresh, setIsRefresh] = useState(false);

  const client = useRef<StompJs.Client | null>(null);

  const connect = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');

    if (accessToken) {
      client.current = new StompJs.Client({
        brokerURL: 'ws://172.30.1.57:8080/ws',
        onConnect: () => {
          subscribe();
        },
        onStompError: async frame => {
          if (frame.body === '토큰이 만료되었습니다.') {
            client.current?.deactivate();

            const data = await reIssueToken();

            const {accessToken: newToken, refreshToken} = data.result;

            await EncryptedStorage.setItem('accessToken', newToken);
            await EncryptedStorage.setItem('refreshToken', refreshToken);

            setIsRefresh(true);
          }
        },
        connectHeaders: {
          Authorization: accessToken,
        },
      });
      client.current.activate();
    }
  };

  const publish = chat => {
    if (!client.current?.connected) {
      return;
    }

    client.current?.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        roomId: 1,
        message: text,
      }),
    });

    setText('');
  };

  const subscribe = () => {
    client.current?.subscribe('/sub/chat' + 1, body => {
      const json_body = JSON.parse(body.body);
      setMessages(prev => [...prev, json_body.message]);
    });
  };

  const disconnect = () => {
    client.current?.deactivate();
  };

  const sendMessage = e => {
    publish(text);
  };

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  useEffect(() => {
    if (isRefresh) {
      connect();
    }
  }, [isRefresh]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Pressable
        style={{backgroundColor: 'blue', padding: 20}}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        data={messages}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={{backgroundColor: 'gray'}}
        value={text}
        onChangeText={setText}
      />
      <Button title="Send" onPress={sendMessage} />
    </SafeAreaView>
  );
};

export default ChatTestScreen;
