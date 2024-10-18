import React, {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../assets/images/arrow-left.svg';
import {NAME_REGEX} from '../../constants/regex';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {useUpdatePlayerUserNickname} from '../../apis/player/usePlayers';
import {showBottomToast} from '../../utils/toast';
import {useUpdateUserName} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import StackHeader from 'components/common/StackHeader';

type EditNicknameScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'EditName'
>;

type EditNicknameScreenRouteProp = RouteProp<
  CommunityStackParamList,
  'EditName'
>;

const EditNameScreen = ({
  navigation,
  route,
}: {
  navigation: EditNicknameScreenNavigationProp;
  route: EditNicknameScreenRouteProp;
}) => {
  const {playerUserId} = route.params;
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(route.params.name);
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameInvalidMessage, setNameInvalidMessage] = useState('');

  const {mutateAsync: updatePlayerUserNickname} = useUpdatePlayerUserNickname();
  const {mutateAsync: updateUserName} = useUpdateUserName();

  const handlePlayerUserNickname = async () => {
    const data = playerUserId
      ? await updatePlayerUserNickname({fanId: playerUserId, name: name})
      : await updateUserName({name: name});
    if (data.message === '부적절한 단어가 포함되어 있습니다.') {
      setIsNameValid(false);
      setNameInvalidMessage('부적절한 이름입니다.');
    }
    if (data.message === '중복된 이름') {
      setIsNameValid(false);
      setNameInvalidMessage('이미 사용중인 이름입니다.');
    }
    if (data.message === '이름변경 완료') {
      showBottomToast(insets.bottom + 20, data.message);
      navigation.pop();
    }
  };

  useEffect(() => {
    setIsNameValid(NAME_REGEX.test(name) ? true : false);
  }, [name]);

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="닉네임 변경" type="back" />
      <View className="flex-1 p-4">
        <CustomText fontWeight="500" className="text-[17px] mb-4">
          새로운 닉네임을 입력해주세요
        </CustomText>
        <CustomTextInput
          label="닉네임"
          value={name}
          onChangeText={setName}
          maxLength={20}
          curLength={name.length}
          length
          isValid={isNameValid}
          inValidMessage={nameInvalidMessage}
        />
      </View>
      <View className="p-4">
        <CustomButton
          type="normal"
          text="변경 완료"
          disabled={!isNameValid || name === route.params.name}
          onPress={handlePlayerUserNickname}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditNameScreen;
