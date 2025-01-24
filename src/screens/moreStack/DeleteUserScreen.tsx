import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import {AuthContext} from '../../navigations/authSwitch/AuthSwitch';
import CustomText from '../../components/common/CustomText';
import CustomButton from '../../components/common/CustomButton';
import CheckBox from '../../components/common/CheckBox';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDeleteUser} from 'apis/user/useUsers';
import {showTopToast} from 'utils/toast';
import {MoreStackParamList} from 'navigations/authSwitch/mainTab/moreStack/MoreStackNavigator';
import CCHeader from 'components/common/CCHeader';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const DeleteUserScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<MoreStackParamList>>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const signOut = useContext(AuthContext)?.signOut;
  const [isAgree, setIsAgree] = useState(false);

  const {mutateAsync: deleteUser, isPending} = useDeleteUser();

  const handleDeleteUser = async () => {
    await deleteUser();
    signOut?.();
    showTopToast({message: '탈퇴 완료'});
  };

  return (
    <View className="flex-1">
      <CCHeader
        title="회원 탈퇴"
        scrollY={scrollY}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 45,
        }}>
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
      </Animated.ScrollView>

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
    </View>
  );
};

export default DeleteUserScreen;
