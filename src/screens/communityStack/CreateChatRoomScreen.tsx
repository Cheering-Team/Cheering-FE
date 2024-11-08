import CustomText from 'components/common/CustomText';
import React, {useState} from 'react';
import {ImageBackground, Pressable, SafeAreaView, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CloseSvg from '../../assets/images/close-black.svg';
import CameraSvg from '../../assets/images/camera-01.svg';
import CustomTextInput from 'components/common/CustomTextInput';
import {Picker} from '@react-native-picker/picker';
import {useCreateChatRoom} from 'apis/chat/useChats';
import {NAME_REGEX} from 'constants/regex';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {openPicker} from '@baronha/react-native-multiple-image-picker';
import {Image} from 'react-native-compressor';
import LoadingOverlay from 'components/common/LoadingOverlay';

const CreateChatRoomScreen = ({navigation, route}) => {
  const {communityId} = route.params;

  const insets = useSafeAreaInsets();

  const {mutateAsync: createChatRoom, isPending} =
    useCreateChatRoom(communityId);

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
  const [imageLoding, setImageLoding] = useState(false);

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
      setImageLoding(true);
      const response = await openPicker({
        usedCameraButton: true,
        mediaType: 'image',
        singleSelectedMode: true,
        isCrop: true,
        isCropCircle: true,
        doneTitle: '추가',
        cancelTitle: '취소',
        emptyMessage: '사진이 하나도 없네요',
        tapHereToChange: '앨범',
        selectedColor: '#0988ff',
      });

      handleChange('image', {
        uri: response.crop.path,
        name: response.fileName || '',
        type: response.mime,
      });
    } catch (e) {
      //
    } finally {
      setImageLoding(false);
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

    let result = '';
    if (formData.image.uri) {
      result = await Image.compress(formData.image.uri, {
        compressionMethod: 'manual',
        maxWidth: 1600,
        quality: 0.7,
      });
    }

    setFormData(prev => ({
      ...prev,
      image: {uri: result, name: prev.image.name, type: prev.image.type},
    }));

    try {
      const data = await createChatRoom({
        communityId: communityId,
        ...formData,
      });
      showTopToast(insets.top + 20, '생성 완료');
      navigation.replace('ChatRoom', {chatRoomId: data.id});
    } catch (error: any) {
      if (error.code === 2004) {
        showTopToast(insets.top + 20, '부적절한 단어가 포함되어있어요');
        return;
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LoadingOverlay isLoading={imageLoding} type="LOADING" />
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
