import {useNavigation} from '@react-navigation/native';
import CustomText from 'components/common/CustomText';
import React, {useState} from 'react';
import {
  ImageBackground,
  Keyboard,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseSvg from '../../assets/images/close-black.svg';
import CameraSvg from '../../assets/images/camera-01.svg';
import CustomTextInput from 'components/common/CustomTextInput';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import {useCreateChatRoom} from 'apis/chat/useChats';
import {NAME_REGEX} from 'constants/regex';
import {showBottomToast, showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CreateChatRoomScreen = ({navigation, route}) => {
  const {playerId} = route.params;

  const insets = useSafeAreaInsets();

  const {mutateAsync: createChatRoom, isPending} = useCreateChatRoom();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: {
      uri: '',
      name: '',
      type: '',
    },
    max: 0,
  });
  const [isValid, setIsValid] = useState(true);

  const handleChange = (key, value) => {
    if (key === 'name') {
      setIsValid(true);
    }
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const imageUpload = async () => {
    try {
      Keyboard.dismiss();
      const image = await ImagePicker.openPicker({
        cropperCircleOverlay: true,
        cropping: true,
        cropperChooseText: '확인',
        cropperCancelText: '취소',
        cropperToolbarTitle: '사진 선택',
      });

      handleChange('image', {
        uri: image.path,
        name: image.filename || '',
        type: image.mime,
      });
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  const handleCreateChatRoom = async () => {
    if (!NAME_REGEX.test(formData.name)) {
      setIsValid(false);
      return;
    }
    if (formData.max === 0) {
      showTopToast(insets.top + 20, '최대 인원수를 선택해주세요.');
      return;
    }

    const data = await createChatRoom({communityId: playerId, ...formData});

    if (data.message === '부적절한 단어가 포함되어 있습니다.') {
      showBottomToast(insets.bottom + 20, data.message);
      return;
    }

    if (data.message === '채팅방 생성 완료') {
      showBottomToast(insets.bottom + 20, data.message);
      navigation.replace('ChatRoom', {chatRoomId: data.result.id});
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between items-center h-[45] pr-4 pl-[10] border-b border-b-[#e1e1e1]">
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <CloseSvg width={30} height={30} />
        </Pressable>
        <Pressable
          onPress={handleCreateChatRoom}
          disabled={isPending}
          className="bg-black py-[6] px-[14] rounded-[20px]">
          <CustomText fontWeight="600" className="text-sm text-white">
            생성
          </CustomText>
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 25,
          paddingHorizontal: 15,
        }}>
        <Pressable onPress={imageUpload} className="rounded-full">
          <ImageBackground
            source={{
              uri:
                formData.image?.uri ||
                'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/gray_background.png',
            }}
            className="w-28 h-28 items-center justify-center"
            imageStyle={{borderRadius: 100}}>
            <CameraSvg width={27} height={27} />
          </ImageBackground>
        </Pressable>
        <CustomTextInput
          label="채팅방 이름"
          className="mt-10"
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
          isValid={isValid}
          inValidMessage="2자~20자, 한글과 영어만 사용 가능합니다."
        />
        <CustomTextInput
          label="설명"
          multiline
          height={75}
          value={formData.description}
          onChangeText={text => handleChange('description', text)}
        />
        <Picker
          selectedValue={formData.max}
          onValueChange={itemValue => handleChange('max', itemValue)}
          style={{width: '100%'}}>
          <Picker.Item label="최대 인원수" value={0} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="10" value={10} />
          <Picker.Item label="30" value={30} />
          <Picker.Item label="50" value={50} />
          <Picker.Item label="100" value={100} />
        </Picker>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateChatRoomScreen;
