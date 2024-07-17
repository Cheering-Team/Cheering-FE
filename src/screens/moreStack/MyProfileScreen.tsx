import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../../assets/images/arrow-left.svg';
import {useQuery} from '@tanstack/react-query';
import {getUserInfo} from '../../apis/user';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import CustomText from '../../components/common/CustomText';

const MyProfileScreen = ({navigation}) => {
  const {data, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: getUserInfo,
  });

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="600" style={{fontSize: 20}}>
          내 정보 수정
        </CustomText>
        <View style={{width: 32, height: 32}} />
      </View>
      <View style={{padding: 20}}>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: '#e5e5e5',
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 10,
          }}
          onPress={() =>
            navigation.navigate('EditNickname', {
              nickname: data.result.nickname,
            })
          }>
          <CustomText fontWeight="600" style={{fontSize: 18}}>
            닉네임
          </CustomText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              fontWeight="500"
              style={{
                color: '#a0a0a0',
                fontSize: 17,
                marginRight: 3,
              }}>
              {data.result.nickname}
            </CustomText>
            <ChevronRightSvg width={13} height={13} />
          </View>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <Pressable onPress={() => navigation.replace('SignOut')}>
            <CustomText style={{color: '#969696', fontSize: 15}}>
              로그아웃
            </CustomText>
          </Pressable>
          <CustomText
            style={{marginHorizontal: 9, color: '#969696', fontSize: 14}}>
            |
          </CustomText>
          <Pressable onPress={() => navigation.navigate('DeleteUser')}>
            <CustomText style={{color: '#969696', fontSize: 15}}>
              회원탈퇴
            </CustomText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
