import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {
  useChangeCommuniyOrder,
  useGetMyCommunities,
} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import DraggableFlatList, {
  DraggableFlatListProps,
  RenderItemParams,
  ScaleDecorator,
} from '@bwjohns4/react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';
import ListSvg from 'assets/images/order-change-white.svg';
import LinearGradient from 'react-native-linear-gradient';
import {HomeStackParamList} from '../../HomeStackNavigator';
import CCHeader from 'components/common/CCHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';

const AnimatedDraggableFlatList =
  Animated.createAnimatedComponent<DraggableFlatListProps<Community>>(
    DraggableFlatList,
  );

const EditMyCommunityScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [data, setData] = useState<Community[]>([]);

  const {data: communities} = useGetMyCommunities(true);
  const {mutateAsync: changeCommunityOrder, isPending} =
    useChangeCommuniyOrder();

  const handleChangeCommunityOrder = async () => {
    const communityOrder = data.map((community, index) => ({
      communityId: community.id,
      communityOrder: index + 1,
    }));

    await changeCommunityOrder(communityOrder);
  };

  useEffect(() => {
    if (communities) {
      setData(communities);
    }
  }, [communities]);

  const renderItem = ({item, drag, isActive}: RenderItemParams<Community>) => {
    return (
      <ScaleDecorator>
        <Pressable onLongPress={drag} disabled={isActive}>
          <View className="flex-row items-center mx-[4] my-[2]">
            <FastImage
              source={{uri: item.backgroundImage || item.image}}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 50,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.65)', 'rgba(0, 0, 0, 0.65)']}
              style={[StyleSheet.absoluteFillObject, {borderRadius: 5}]}
            />
            <View className="absolute flex-row w-full items-center">
              <View className="pl-[14] pr-4">
                <ListSvg width={23} height={23} />
              </View>
              <CustomText
                className="text-[16px] text-white flex-1"
                fontWeight="500">
                {item.koreanName}
              </CustomText>
              <Pressable
                className="p-4"
                onPress={() => {
                  navigation.navigate('CommunityStack', {
                    screen: 'LeaveCommunity',
                    params: {communityId: item.id},
                  });
                }}>
                <CustomText
                  className="text-[#ff4949] text-[15px]"
                  fontWeight="500">
                  탈퇴
                </CustomText>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <View className="flex-1">
      <CCHeader
        scrollY={scrollY}
        title="내 커뮤니티 관리"
        secondType="COMPELETE"
        onFirstPress={() => {
          navigation.goBack();
        }}
        onSecondPress={
          isPending
            ? () => {
                return;
              }
            : handleChangeCommunityOrder
        }
      />
      {communities && (
        <AnimatedDraggableFlatList
          data={data}
          onScroll={scrollHandler}
          onDragEnd={({data: newData}) => setData(newData)}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: insets.top + 52,
            paddingBottom: 100,
          }}
        />
      )}
    </View>
  );
};

export default EditMyCommunityScreen;
