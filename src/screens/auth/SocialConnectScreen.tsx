import React, {useContext} from 'react';
import Close from '../../hooks/Close';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';
import {useMutation} from '@tanstack/react-query';
import {connectKakao} from '../../apis/user';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthContext} from '../../navigations/AuthSwitch';

const SocialConnectScreen = ({navigation, route}) => {
  Close(navigation);
  const {accessToken, user} = route.params;

  const insets = useSafeAreaInsets();
  const signIn = useContext(AuthContext)?.signIn;

  const mutation = useMutation({mutationFn: connectKakao});

  const handleConnectSocial = async () => {
    const data = await mutation.mutateAsync({accessToken, userId: user.id});

    if (data.message === '연결되었습니다.') {
      const {accessToken: sessionToken, refreshToken} = data.result;

      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '회원가입되었습니다.',
      });

      signIn?.(sessionToken, refreshToken);
      return;
    }
  };

  const formatDate = (date: string) => {
    date = date.substring(0, 10);
    const [year, month, day] = date.split('-');

    return `${year}년 ${month}월 ${day}일 가입`;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 20}}>
        <CustomText fontWeight="500" style={styles.signInTitle}>
          이미 아이디가 있어요
        </CustomText>
        <CustomText style={styles.infoText}>
          해당 휴대폰 번호로 가입된 아이디가 있어요
        </CustomText>
        <CustomText style={styles.infoText}>
          아이디와 SNS계정을 연결해드릴게요
        </CustomText>
        <View
          style={{
            marginTop: 50,
            borderWidth: 1,
            borderColor: '#e3e3e3',
            borderRadius: 5,
            padding: 15,
          }}>
          <CustomText fontWeight="500" style={{fontSize: 18}}>
            {user.nickname}
          </CustomText>
          <CustomText style={{fontSize: 16}}>{user.phone}</CustomText>
          <CustomText fontWeight="500" style={{color: '#838383'}}>
            {formatDate(user.createdAt)}
          </CustomText>
        </View>
      </View>
      <View style={{padding: 15}}>
        <CustomButton
          type="normal"
          text="연결하기"
          onPress={handleConnectSocial}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signInTitle: {
    fontSize: 22,
    color: '#000000',
    marginBottom: 5,
  },
  infoText: {
    color: '#838383',
    fontSize: 16,
    marginTop: 1,
  },
});

export default SocialConnectScreen;
