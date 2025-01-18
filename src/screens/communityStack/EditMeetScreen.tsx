import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetCommunityById} from 'apis/community/useCommunities';
import {useEditMeet, useGetMeetById} from 'apis/meet/useMeets';
import BasicTextInput from 'components/common/BasicTextInput';
import CCHeader from 'components/common/CCHeader';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showTopToast} from 'utils/toast';

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

const EditMeetScreen = () => {
  useDarkStatusBar();
  const {communityId, meetId} =
    useRoute<RouteProp<CommunityStackParamList, 'EditMeet'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const {data: community} = useGetCommunityById(communityId);
  const {data: meet} = useGetMeetById(meetId);
  const {mutateAsync: editMeet} = useEditMeet();

  useEffect(() => {
    if (meet) {
      setTitle(meet.title);
      setDescription(meet.description);
    }
  }, [meet]);

  const handleEditMeet = async () => {
    try {
      await editMeet({meetId, title, description});
      navigation.replace('Meet', {meetId, communityId});
      showTopToast({type: 'success', message: '모임 수정 완료'});
    } catch (error: any) {
      //
    }
  };

  return (
    <View className="flex-1">
      <CCHeader
        title="모임 수정하기"
        secondType="COMPELETE"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
        onSecondPress={handleEditMeet}
      />
      <AnimatedKeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: insets.top + 50,
          paddingBottom: 40,
        }}
        onScroll={scrollHandler}>
        <BasicTextInput
          label="제목"
          placeholder="모집글의 제목을 입력해주세요"
          value={title}
          onChangeText={setTitle}
        />
        <BasicTextInput
          label="설명"
          multiline={true}
          height={100}
          placeholder="어떤 사람과 가고 싶은지 구체적으로 설명해 주세요"
          value={description}
          onChangeText={setDescription}
        />
      </AnimatedKeyboardAwareScrollView>
    </View>
  );
};

export default EditMeetScreen;
