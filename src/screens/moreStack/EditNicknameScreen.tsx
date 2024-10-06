import React, {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../../assets/images/arrow-left.svg';
import {NICKNAME_REGEX} from '../../constants/regex';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {useUpdatePlayerUserNickname} from '../../apis/player/usePlayers';
import {showBottomToast} from '../../utils/toast';
import {useUpdateUserNickname} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';

type EditNicknameScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'EditNickname'
>;

type EditNicknameScreenRouteProp = RouteProp<
  CommunityStackParamList,
  'EditNickname'
>;

const EditNicknameScreen = ({
  navigation,
  route,
}: {
  navigation: EditNicknameScreenNavigationProp;
  route: EditNicknameScreenRouteProp;
}) => {
  const {playerUserId} = route.params;
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState(route.params.nickname);
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [nicknameInvalidMessage, setNicknameInvalidMessage] = useState('');

  const {mutateAsync: updatePlayerUserNickname} = useUpdatePlayerUserNickname();
  const {mutateAsync: updateUserNickname} = useUpdateUserNickname();

  const handlePlayerUserNickname = async () => {
    const data = playerUserId
      ? await updatePlayerUserNickname({playerUserId, nickname})
      : await updateUserNickname({nickname});
    if (data.message === '부적절한 단어가 포함되어 있습니다.') {
      setIsNicknameValid(false);
      setNicknameInvalidMessage(data.message);
    }
    if (data.message === '이미 존재하는 닉네임입니다.') {
      setIsNicknameValid(false);
      setNicknameInvalidMessage(data.message);
    }
    if (data.message === '닉네임을 변경하였습니다.') {
      showBottomToast(insets.bottom + 20, data.message);
      navigation.pop();
    }
  };

  useEffect(() => {
    setIsNicknameValid(NICKNAME_REGEX.test(nickname) ? true : false);
  }, [nickname]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between items-center p-[10]">
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="600" className="text-xl">
          닉네임 변경
        </CustomText>
        <View className="w-8 h-8" />
      </View>
      <View className="flex-1 p-4">
        <CustomText fontWeight="500" className="text-[17px] mb-4">
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
      <View className="p-4">
        <CustomButton
          type="normal"
          text="변경 완료"
          disabled={!isNicknameValid || nickname === route.params.nickname}
          onPress={handlePlayerUserNickname}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditNicknameScreen;
