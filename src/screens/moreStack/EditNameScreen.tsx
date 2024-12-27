import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {NAME_REGEX} from '../../constants/regex';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {showTopToast} from '../../utils/toast';
import {useUpdateUserName} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import StackHeader from 'components/common/StackHeader';
import {useUpdateFanName} from 'apis/fan/useFans';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';

type EditNicknameScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'EditName'
>;

const EditNameScreen = ({
  navigation,
  route,
}: {
  navigation: EditNicknameScreenNavigationProp;
  route: any;
}) => {
  useDarkStatusBar();
  const {fanId} = route.params;

  const [name, setName] = useState(route.params.name);
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameInvalidMessage, setNameInvalidMessage] = useState('');

  const {mutateAsync: updateFanName} = useUpdateFanName();
  const {mutateAsync: updateUserName} = useUpdateUserName();

  const handlePlayerUserNickname = async () => {
    try {
      fanId
        ? await updateFanName({fanId: fanId, name: name})
        : await updateUserName({name: name});
      showTopToast({message: '변경 완료'});
      navigation.pop();
    } catch (error: any) {
      if (error.code === 2004) {
        setIsNameValid(false);
        setNameInvalidMessage('적절하지 않은 이름입니다');
      }
      if (error.code === 2007) {
        setIsNameValid(false);
        setNameInvalidMessage('이미 사용중인 이름입니다.');
      }
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
          maxLength={10}
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
