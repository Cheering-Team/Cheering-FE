import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../CustomText';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {WINDOW_HEIGHT} from '../../../constants/dimension';

const CommunityEmpty = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.3 + 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CustomText fontWeight="600" style={{fontSize: 23, marginBottom: 5}}>
        아직 가입한 커뮤니티가 없어요
      </CustomText>
      <CustomText style={{color: '#5b5b5b'}}>
        좋아하는 선수를 찾아보세요
      </CustomText>
      <Pressable
        style={{marginTop: 10}}
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'CategoryStack'}],
            }),
          )
        }>
        <CustomText fontWeight="500" style={{color: '#58a04b', fontSize: 15}}>
          선수 찾기
        </CustomText>
      </Pressable>
    </View>
  );
};

export default CommunityEmpty;
