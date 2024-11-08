// import React, {useState} from 'react';
// import {Tabs} from 'react-native-collapsible-tab-view';
// import FeedFilter from '../FeedFilter';
// import {useFeedList} from './useFeedList';
// import {ListRenderItem, Pressable, RefreshControl} from 'react-native';
// import FeedPost from '../FeedPost';
// import ListEmpty from '../../common/ListEmpty/ListEmpty';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import PlusSvg from '../../../assets/images/plus-gray.svg';
// import {useNavigation} from '@react-navigation/native';
// import {Post} from 'apis/post/types';
// import {Player} from 'apis/player/types';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
// import FeedSkeleton from 'components/skeleton/FeedSkeleton';

// interface Props {
//   community: Player;
// }

// const FeedList = (props: Props) => {
//   const {community} = props;

//   const insets = useSafeAreaInsets();
//   const navigation =
//     useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const {
//     selectedFilter,
//     setSelectedFilter,
//     posts,
//     isLoading,
//     refetch,
//     isFetchingNextPage,
//     loadPosts,
//   } = useFeedList(community);

//   const renderFeed: ListRenderItem<Post> = ({item}) => (
//     <FeedPost feed={item} type="community" />
//   );

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     refetch();

//     setTimeout(() => {
//       setIsRefreshing(false);
//     }, 1000);
//   };

//   if (community.curFan == null) {
//     return null;
//   }

//   return (
//     <>
//       <Tabs.FlatList
//         data={isLoading ? [] : posts?.pages.flatMap(page => page.posts)}
//         renderItem={renderFeed}
//         ListHeaderComponent={
//           community.curFan ? (
//             <FeedFilter
//               selectedFilter={selectedFilter}
//               setSelectedFilter={setSelectedFilter}
//             />
//           ) : null
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{paddingBottom: 70}}
//         onEndReached={community.curFan && loadPosts}
//         onEndReachedThreshold={community.curFan && 1}
//         ListFooterComponent={
//           isFetchingNextPage && community.curFan ? (
//             <FeedSkeleton type="Community" />
//           ) : null
//         }
//         ListEmptyComponent={
//           isLoading ? (
//             <FeedSkeleton type="Community" />
//           ) : (
//             <ListEmpty type="feed" />
//           )
//         }
//         refreshControl={
//           community.curFan ? (
//             <RefreshControl
//               refreshing={isRefreshing}
//               onRefresh={handleRefresh}
//             />
//           ) : undefined
//         }
//       />
//       {community.curFan && (
//         <Pressable
//           style={{
//             alignItems: 'center',
//             position: 'absolute',
//             bottom: insets.bottom + 67,
//             right: 17,
//             width: 42,
//             height: 42,
//             justifyContent: 'center',
//             backgroundColor: '#ffffff',
//             borderRadius: 100,
//             shadowColor: '#000',
//             shadowOffset: {
//               width: 1,
//               height: 1,
//             },
//             shadowOpacity: 0.2,
//             shadowRadius: 2,
//             elevation: 3,
//           }}
//           onPress={() => {
//             navigation.navigate('PostWrite', {communityId: community.id});
//           }}>
//           <PlusSvg width={20} height={20} />
//         </Pressable>
//       )}
//     </>
//   );
// };

// export default FeedList;

import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';
import React, {
  forwardRef,
  MutableRefObject,
  RefObject,
  useCallback,
  useRef,
} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {useFeedList} from './useFeedList';
import {Community} from 'apis/community/types';
import FeedPost from '../FeedPost';
import {Post} from 'apis/post/types';
import FeedFilter from '../FeedFilter';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

const sampleData = new Array(20).fill(0);

interface FeedListProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<any> | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
}

const FeedList = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  listArrRef,
  tabRoute,
  onMomentumScrollEnd,
  onScrollEndDrag,
  community,
}: FeedListProps) => {
  const {
    selectedFilter,
    setSelectedFilter,
    posts,
    isLoading,
    refetch,
    isFetchingNextPage,
    loadPosts,
  } = useFeedList(community);

  const renderItem: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="community" />
  );

  const scrollHandler = useAnimatedScrollHandler(event => {
    if (isTabFocused) {
      scrollY.value = event.contentOffset.y;
    }
  });

  return (
    <View style={{flex: 1}}>
      <Animated.FlatList
        ref={ref => {
          const foundIndex = listArrRef.current.findIndex(
            e => e.key === tabRoute.key,
          );

          if (foundIndex === -1) {
            listArrRef.current.push({
              key: tabRoute.key,
              value: ref,
            });
          } else {
            listArrRef.current[foundIndex] = {
              key: tabRoute.key,
              value: ref,
            };
          }
        }}
        scrollEnabled={!!community.curFan}
        data={posts?.pages.flatMap(page => page.posts) || []}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 45,
        }}
        ListHeaderComponent={
          <FeedFilter
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        }
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        bounces={false}
      />
    </View>
  );
};

export default FeedList;
