import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import CloseSvg from '../../../../assets/images/close-black.svg';

interface WriterHeaderProps {
  handleWritePost: () => void;
}

const WriteHeader = (props: WriterHeaderProps) => {
  const {handleWritePost} = props;

  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        paddingRight: 17,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
      }}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <CloseSvg width={30} height={30} />
      </Pressable>
      <Pressable
        onPress={() => {
          handleWritePost();
        }}
        style={{
          backgroundColor: 'black',
          paddingVertical: 6,
          paddingHorizontal: 14,
          borderRadius: 20,
        }}>
        <CustomText fontWeight="600" style={{fontSize: 14, color: 'white'}}>
          등록
        </CustomText>
      </Pressable>
    </View>
  );
};

export default WriteHeader;
