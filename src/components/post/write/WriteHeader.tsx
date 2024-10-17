import React from 'react';
import {Platform, Pressable, View} from 'react-native';
import CustomText from '../../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import CloseSvg from '../../../assets/images/close-black.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface WriterHeaderProps {
  handleWritePost: () => void;
  isWritePending: boolean;
  isEditPending: boolean;
}

const WriteHeader = (props: WriterHeaderProps) => {
  const {handleWritePost, isWritePending, isEditPending} = props;
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Platform.OS === 'android' ? 45 + insets.top : 45,
        paddingRight: 17,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        paddingTop: Platform.OS === 'android' ? insets.top : undefined,
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
        disabled={isWritePending || isEditPending}
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
