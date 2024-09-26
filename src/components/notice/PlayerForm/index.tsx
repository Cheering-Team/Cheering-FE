import CustomButton from 'components/common/CustomButton';
import CustomText from 'components/common/CustomText';
import CustomTextInput from 'components/common/CustomTextInput';
import React, {useState} from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import PlusSvg from '../../../../assets/images/plus.svg';

const PlayerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    sportName: '',
    leagueName: '',
    teamName: '',
    image: {uri: '', name: '', type: ''},
  });

  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        forceJpg: true,
      });

      const imageObj = {
        uri: image.path,
        name: image.filename,
        type: image.mime,
      };

      handleChange('image', imageObj);
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View className="mt-10 border p-5 border-gray-200 rounded bg-white shadow-2xl">
      <CustomText fontWeight="500" className="text-black text-xl mb-5">
        신청 양식
      </CustomText>
      <CustomTextInput
        label="선수이름"
        value={formData.name}
        onChangeText={value => handleChange('name', value)}
      />
      <CustomTextInput
        label="종목명"
        value={formData.sportName}
        onChangeText={value => handleChange('sportName', value)}
      />
      <CustomTextInput
        label="소속리그"
        value={formData.leagueName}
        onChangeText={value => handleChange('leagueName', value)}
      />
      <CustomTextInput
        label="소속팀"
        value={formData.teamName}
        onChangeText={value => handleChange('teamName', value)}
      />
      <Pressable
        className="w-full h-[130] border rounded-[3px] border-[#d0d0d0] mb-5"
        onPress={handleImageUpload}>
        <ImageBackground
          className="w-full h-full items-center justify-center"
          resizeMode="cover"
          source={{
            uri:
              formData.image.uri ||
              'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/white-background.png',
          }}>
          <PlusSvg width={18} height={18} />
          <CustomText className="text-[#858585] mt-2">배경 사진</CustomText>
        </ImageBackground>
      </Pressable>
      <CustomButton text="신청하기" type="normal" />
    </View>
  );
};

export default PlayerForm;
