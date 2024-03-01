import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import CustomText from '../components/CustomText';
import {Pressable, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import PersonSvg from '../../assets/images/person_black.svg';

interface ChatListScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Community'>;
}

const ChatListScreen = (props: ChatListScreenProps) => {
  const {navigation} = props;

  return (
    <Tabs.ScrollView>
      <Pressable
        style={{
          padding: 17,
          flexDirection: 'row',
          borderBottomColor: '#eaeaea',
          borderBottomWidth: 1,
        }}>
        <View style={{flex: 1}}>
          <CustomText fontWeight="500" style={{fontSize: 15}}>
            이강인 잡담방
          </CustomText>
          <CustomText style={{fontSize: 13}}>
            이강인에 대해서 잡담할 사람만 들어오세요~
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
          <PersonSvg width={15} height={15} />
          <CustomText style={{marginLeft: 4}}>5</CustomText>
        </View>
      </Pressable>
      <Pressable
        style={{
          padding: 15,
          flexDirection: 'row',
          borderBottomColor: '#eaeaea',
          borderBottomWidth: 1,
        }}>
        <View style={{flex: 1}}>
          <CustomText fontWeight="500" style={{fontSize: 15}}>
            일상방
          </CustomText>
          <CustomText style={{fontSize: 13}}>그냥 떠들고 놀사람</CustomText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
          <PersonSvg width={15} height={15} />
          <CustomText style={{marginLeft: 4}}>12</CustomText>
        </View>
      </Pressable>
    </Tabs.ScrollView>
  );
};

export default ChatListScreen;
