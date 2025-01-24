import React from 'react';
import {FlatList, Pressable, View} from 'react-native';
import {ScrollView} from 'react-native';
import LogoSvg from 'assets/images/logo-text.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyStarCarousel from 'components/home/MyStarCarousel';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import AlertSvg from 'assets/images/alert-black.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import {useGetMyHotPosts} from 'apis/post/usePosts';
import FeedPost from 'components/community/FeedPost';
import RandomCommunityCard from '../components/RandomCommunityCard';

const HomeScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: communities} = useGetMyCommunities(true);
  const {data: posts} = useGetMyHotPosts();

  if (!communities) {
    return null;
  }

  return (
    <View
      className="flex-1"
      style={{
        marginTop: insets.top,
      }}>
      <View className="h-[45] justify-between items-center flex-row">
        <View className="w-[50] h-[50]" />
        <LogoSvg width={200} height={50} />
        <Pressable
          className="w-[50] h-[50] justify-center items-center"
          onPress={() => {
            navigation.navigate('Notification');
          }}>
          <AlertSvg width={22} height={22} />
        </Pressable>
      </View>
      {communities.length !== 0 ? (
        <FlatList
          data={posts?.pages.flatMap(page => page.posts)}
          contentContainerStyle={{paddingBottom: insets.bottom + 60}}
          renderItem={({item}) => <FeedPost feed={item} type="community" />}
          ListHeaderComponent={
            <>
              <View className="flex-row-reverse justify-between items-center px-6 mt-[4] mb-[5]">
                <Pressable
                  className="border-b border-b-gray-600"
                  onPress={() => navigation.navigate('EditMyCommunity')}>
                  <CustomText className="text-gray-600 text-[13.5px]">
                    수정하기
                  </CustomText>
                </Pressable>
              </View>
              <MyStarCarousel communities={communities} />
              <CustomText
                className="text-lg mt-7 mb-2 ml-[14]"
                fontWeight="500">
                인기 게시글
              </CustomText>
            </>
          }
        />
      ) : (
        <RandomCommunityCard />
      )}
    </View>
  );
};

export default HomeScreen;
