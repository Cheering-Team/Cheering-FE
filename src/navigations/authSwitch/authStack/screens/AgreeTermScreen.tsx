import CheckBox from 'components/common/CheckBox';
import CustomText from 'components/common/CustomText';
import React, {useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import ChevronRightSvg from 'assets/images/chevron-right-gray.svg';
import Close from 'hooks/Close';
import CustomButton from 'components/common/CustomButton';

const AgreeTermScreen = ({navigation, route}) => {
  Close(navigation);
  const {phone, accessToken, type} = route.params;

  const [isAgree, setIsAgree] = useState({privacy: false, age: false});

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 ">
        <View className="mt-[5] p-5">
          <CustomText fontWeight="500" className="text-2xl ml-1">
            스타디움 이용을 위해
          </CustomText>
          <CustomText fontWeight="500" className="text-2xl ml-1 mb-3">
            이용약관에 동의해주세요.
          </CustomText>
        </View>
        <View className="p-3 flex-1">
          <Pressable
            className="bg-gray-100 p-3 rounded-lg flex-row items-center"
            onPress={() => {
              Object.values(isAgree).every(value => value === true)
                ? setIsAgree({privacy: false, age: false})
                : setIsAgree({privacy: true, age: true});
            }}>
            <CheckBox
              isCheck={Object.values(isAgree).every(value => value === true)}
              onPress={() => {
                Object.values(isAgree).every(value => value === true)
                  ? setIsAgree({privacy: false, age: false})
                  : setIsAgree({privacy: true, age: true});
              }}
            />
            <CustomText fontWeight="500" className="text-[19px]">
              모두 동의합니다.
            </CustomText>
          </Pressable>
          <Pressable
            className="p-3 flex-row items-center"
            onPress={() => {
              setIsAgree(prev => ({...prev, privacy: !prev.privacy}));
            }}>
            <CheckBox
              isCheck={isAgree.privacy}
              onPress={() => {
                setIsAgree(prev => ({...prev, privacy: !prev.privacy}));
              }}
            />
            <CustomText className="text-base flex-1">
              {'(필수) 개인정보 처리방침'}
            </CustomText>
            <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
              <ChevronRightSvg />
            </Pressable>
          </Pressable>
          <Pressable
            className="p-3 flex-row items-center"
            onPress={() => {
              setIsAgree(prev => ({...prev, age: !prev.age}));
            }}>
            <CheckBox
              isCheck={isAgree.age}
              onPress={() => {
                setIsAgree(prev => ({...prev, age: !prev.age}));
              }}
            />
            <CustomText className="text-base">
              {'(필수) 만 14세 이상입니다.'}
            </CustomText>
          </Pressable>
        </View>
        <View className="p-[15]">
          <CustomButton
            type="normal"
            text="시작하기"
            disabled={Object.values(isAgree).some(value => value === false)}
            onPress={() =>
              type
                ? navigation.replace('PhoneVerify', {accessToken, type})
                : navigation.replace('SetNickname', {phone})
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AgreeTermScreen;
