import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {NAME_REGEX} from '../../constants/regex';
import CustomText from '../../components/common/CustomText';
import CustomTextInput from '../../components/common/CustomTextInput';
import CustomButton from '../../components/common/CustomButton';
import {showTopToast} from '../../utils/toast';
import {useUpdateUserName} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import StackHeader from 'components/common/StackHeader';
import {useUpdateFanName} from 'apis/fan/useFans';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import CCHeader from 'components/common/CCHeader';

const EditNameScreen = () => {
  useDarkStatusBar();
  const {
    name: fanName,
    fanId,
    type,
  } = useRoute<RouteProp<CommunityStackParamList, 'EditName'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [name, setName] = useState(fanName);
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameInvalidMessage, setNameInvalidMessage] = useState('');

  const {mutateAsync: updateFanName} = useUpdateFanName();
  const {mutateAsync: updateUserName} = useUpdateUserName();

  const handlePlayerUserNickname = async () => {
    try {
      fanId
        ? await updateFanName({fanId: fanId, type, name: name})
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <CCHeader
        title={'닉네임 수정'}
        scrollY={scrollY}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingHorizontal: 15,
        }}>
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
      </ScrollView>
      <View className="p-[15]">
        <CustomButton
          text="변경 완료"
          disabled={!isNameValid || name === fanName}
          onPress={handlePlayerUserNickname}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditNameScreen;
