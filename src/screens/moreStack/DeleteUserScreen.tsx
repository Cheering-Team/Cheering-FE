import React, {useContext, useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../assets/images/arrow-left.svg';
import {AuthContext} from '../../navigations/authSwitch/AuthSwitch';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';
import CheckBox from '../../components/common/CheckBox';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDeleteUser} from 'apis/user/useUsers';
import {showTopToast} from 'utils/toast';
import {MoreStackParamList} from 'navigations/authSwitch/mainTab/moreStack/MoreStackNavigator';

type DeleteUserNavigationProp = NativeStackNavigationProp<
  MoreStackParamList,
  'DeleteUser'
>;

const DeleteUserScreen = ({
  navigation,
}: {
  navigation: DeleteUserNavigationProp;
}) => {
  const signOut = useContext(AuthContext)?.signOut;
  const [isAgree, setIsAgree] = useState(false);

  const {mutateAsync: deleteUser, isPending} = useDeleteUser();

  const handleDeleteUser = async () => {
    await deleteUser();
    signOut?.();
    showTopToast({message: '탈퇴 완료'});
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between items-center p-[10]">
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="600" className="text-xl">
          회원탈퇴
        </CustomText>
        <View className="w-8 h-8" />
      </View>
      <View className="p-[15] flex-1">
        <CustomText fontWeight="500" className="text-xl mb-[10]">
          회원탈퇴 유의사항
        </CustomText>
        <CustomText className="mb-[5] text-lg" numberOfLines={999}>
          - 회원탈퇴 시, 가입된 모든 커뮤니티에서 자동으로 탈퇴됩니다.
        </CustomText>
        <CustomText className="text-lg" numberOfLines={999}>
          - 모든 커뮤니티에서의 활동들이 삭제됩니다.
        </CustomText>
      </View>
      <View className="p-[15]">
        <View className="flex-row items-center mb-5">
          <CheckBox
            isCheck={isAgree}
            onPress={() => setIsAgree(prev => !prev)}
          />
          <CustomText className="text-base">
            위 유의사항을 모두 확인하였습니다.
          </CustomText>
        </View>
        <CustomButton
          text="계정 삭제하기"
          disabled={!isAgree || isPending}
          onPress={handleDeleteUser}
        />
      </View>
    </SafeAreaView>
  );
};

export default DeleteUserScreen;
