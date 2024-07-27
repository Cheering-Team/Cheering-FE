import React, {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../../assets/images/arrow-left.svg';
import {NICKNAME_REGEX} from '../../constants/regex';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateUserNickname} from '../../apis/user';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {updatePlayerUserNickname} from '../../apis/player';

const EditNicknameScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(route.params.nickname);
  const [isNicknameValid, setIsNicknameValid] = useState(true);

  const userMutation = useMutation({
    mutationFn: updateUserNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
    },
  });

  const playerUserMutation = useMutation({
    mutationFn: updatePlayerUserNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playerusers', playerUserId],
      });
    },
  });

  const updateNickname = async () => {
    const data = playerUserId
      ? await playerUserMutation.mutateAsync({playerUserId, nickname})
      : await userMutation.mutateAsync({nickname});

    if (data.message === '닉네임을 변경하였습니다.') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        bottomOffset: insets.top + 20,
        text1: '닉네임을 변경하였습니다.',
      });
      navigation.pop();
    }
  };

  useEffect(() => {
    setIsNicknameValid(NICKNAME_REGEX.test(nickname) ? true : false);
  }, [nickname]);

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
          닉네임 변경
        </CustomText>
        <View style={{width: 32, height: 32}} />
      </View>
      <View style={{flex: 1, padding: 15}}>
        <CustomText fontWeight="500" style={{fontSize: 17, marginBottom: 15}}>
          새로운 닉네임을 입력해주세요
        </CustomText>
        <CustomTextInput
          label="닉네임"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
          curLength={nickname.length}
          length
          isValid={isNicknameValid}
          inValidMessage="2자~20자, 한글과 영어만 사용 가능합니다."
        />
      </View>
      <View style={{padding: 15}}>
        <CustomButton
          type="normal"
          text="변경 완료"
          disabled={!isNicknameValid || nickname === route.params.nickname}
          onPress={() => updateNickname()}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditNicknameScreen;
