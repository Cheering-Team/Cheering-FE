import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'react-native';
import CustomText from '../../../../../../components/common/CustomText';
import CheckBox from '../../../../../../components/common/CheckBox';
import CustomButton from '../../../../../../components/common/CustomButton';
import LoadingOverlay from 'components/common/LoadingOverlay';
import CCHeader from 'components/common/CCHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {
  useGetCommunityById,
  useLeaveCommunity,
} from 'apis/community/useCommunities';

const LeaveCommunityScreen = () => {
  useDarkStatusBar();
  const {communityId} =
    useRoute<RouteProp<CommunityStackParamList, 'LeaveCommunity'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [isAgree, setIsAgree] = useState(false);

  const {data: community} = useGetCommunityById(communityId);
  const {mutate, isPending} = useLeaveCommunity();

  const handleDeleteUser = () => {
    mutate(communityId);
  };

  return (
    <View style={{flex: 1}}>
      <CCHeader
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
        title="커뮤니티 탈퇴"
      />
      <Animated.ScrollView
        className="flex-1"
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 55,
          paddingBottom: 10,
        }}>
        <View className="flex-1 p-[15]">
          <CustomText fontWeight="500" style={{fontSize: 18, marginBottom: 10}}>
            커뮤니티 탈퇴 유의사항
          </CustomText>
          <CustomText style={{fontSize: 16}}>
            - 모든 커뮤니티에서의 활동들이 삭제됩니다.
          </CustomText>
        </View>
      </Animated.ScrollView>
      <View style={{paddingHorizontal: 15, marginBottom: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CheckBox
            isCheck={isAgree}
            onPress={() => setIsAgree(prev => !prev)}
          />
          <CustomText style={{fontSize: 17}}>
            위 유의사항을 모두 확인하였습니다.
          </CustomText>
        </View>
      </View>
      <View className="px-2 mt-2" style={{paddingBottom: insets.bottom + 8}}>
        <CustomButton
          text="커뮤니티 탈퇴"
          isLoading={isPending}
          disabled={!isAgree}
          onPress={handleDeleteUser}
        />
      </View>

      {isPending && <LoadingOverlay type="OVERLAY" />}
    </View>
  );
};

export default LeaveCommunityScreen;
