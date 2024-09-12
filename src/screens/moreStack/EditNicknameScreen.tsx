import React, {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../../assets/images/arrow-left.svg';
import {NICKNAME_REGEX} from '../../constants/regex';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {useUpdatePlayerUserNickname} from '../../apis/player/usePlayers';
import {showBottomToast} from '../../utils/\btoast';

const EditNicknameScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState(route.params.nickname);
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [nicknameInvalidMessage, setNicknameInvalidMessage] = useState('');

  const {mutateAsync} = useUpdatePlayerUserNickname();
  // const playerUserMutation = useMutation({
  //   mutationFn: updatePlayerUserNickname,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ['playerusers', playerUserId],
  //     });
  //   },
  // });

  const handlePlayerUserNickname = async () => {
    const data = await mutateAsync({playerUserId, nickname});
    if (data.message === '이미 존재하는 닉네임입니다.') {
      setIsNicknameValid(false);
      setNicknameInvalidMessage('이미 존재하는 닉네임입니다.');
    } else {
      showBottomToast(insets.bottom + 20, '닉네임을 변경하였습니다.');
      navigation.pop();
    }
  };

  const handleUserNickname = async () => {
    // const data = playerUserId
    //   ? await playerUserMutation.mutateAsync({playerUserId, nickname})
    //   : await userMutation.mutateAsync({nickname});
    // if (data.message === '닉네임을 변경하였습니다.') {
    //   Toast.show({
    //     type: 'default',
    //     position: 'top',
    //     visibilityTime: 3000,
    //     topOffset: insets.top + 20,
    //     text1: '닉네임을 변경하였습니다.',
    //   });
    //   navigation.pop();
    // }
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
          inValidMessage={nicknameInvalidMessage}
        />
      </View>
      <View style={{padding: 15}}>
        <CustomButton
          type="normal"
          text="변경 완료"
          disabled={!isNicknameValid || nickname === route.params.nickname}
          onPress={playerUserId ? handlePlayerUserNickname : handleUserNickname}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditNicknameScreen;
