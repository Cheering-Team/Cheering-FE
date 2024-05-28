import React, {useLayoutEffect} from 'react';
import PlayerList from '../../components/PlayerList';
import {Image, SafeAreaView, View} from 'react-native';
import Back from '../../hooks/Back';
import CustomText from '../../components/CustomText';

const PlayerListScreen = ({navigation}) => {
  Back(navigation);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '야구 / KBO',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          backgroundColor: 'white',
          width: '100%',
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          borderTopWidth: 1,
          borderTopColor: '#efefef',
        }}>
        <Image
          source={{
            uri: 'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/lotte.png',
          }}
          style={{height: 75, width: 75}}
        />
        <View
          style={{
            flex: 1,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {/* <CustomText
            style={{
              fontSize: 13,
              color: '#252525',
              paddingBottom: 0,
              marginLeft: 1,
            }}>
            야구 / KBO
          </CustomText> */}
          <View>
            <CustomText
              fontWeight="600"
              style={{fontSize: 20, paddingBottom: 0, color: '#2b2b2b'}}>
              롯데 자이언츠
            </CustomText>
            <CustomText
              fontWeight="600"
              style={{fontSize: 12, color: '#fd5853'}}>
              12,321+
            </CustomText>
          </View>

          <CustomText fontWeight="600" style={{fontSize: 15, color: '#4d4d4d'}}>
            {'이동하기  >'}
          </CustomText>
        </View>
      </View>
      <PlayerList />
    </SafeAreaView>
  );
};

export default PlayerListScreen;
