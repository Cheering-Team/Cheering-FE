import React from 'react';
import {Tabs, useCurrentTabScrollY} from 'react-native-collapsible-tab-view';
import Post, {PostType} from '../components/Post';
import {getCommunitiesMain, getCommunitiesToPosts} from '../apis/community';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import CustomText from '../components/CustomText';
import {Pressable} from 'react-native';
import BackSvg from '../../assets/images/chevron_left_white.svg';
import {CommunityMain} from '../components/CommunityHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeSvg from '../../assets/images/home_white.svg';
import Avatar from '../components/Avatar';
import {getPostsLike} from '../apis/post';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import {WindowHeight} from '../constants/dimension';

interface ToPostScreenProps {
  communityId: number;
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Community'>;
}

const ToPostScreen = (props: ToPostScreenProps) => {
  const {communityId, navigation} = props;
  const [data, setData] = React.useState<PostType[]>([]);

  const statusBarHeight = useSafeAreaInsets().top;

  const scrollY = useCurrentTabScrollY();

  const headerColor = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, WindowHeight * 0.3, WindowHeight * 0.4],
        ['transparent', 'transparent', '#242424'],
      ),
    };
  });

  const headerTextColor = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        scrollY.value,
        [0, WindowHeight * 0.3, WindowHeight * 0.4],
        ['transparent', 'transparent', 'white'],
      ),
    };
  });

  const [communityData, setCommunityData] = React.useState<CommunityMain>({
    fanCount: 0,
    backgroundImage: undefined,
    englishName: '',
    koreanName: '',
    teamName: '',
  });

  React.useEffect(() => {
    const getCommunityMain = async () => {
      const response = await getCommunitiesMain({
        id: communityId,
      });

      if (response.message === 'get community success') {
        setCommunityData(response.data);
      }
    };

    getCommunityMain();
  }, [communityId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Animated.View
          style={[
            {
              height: 52 + statusBarHeight,
              paddingTop: statusBarHeight + 5,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
            },
            headerColor,
          ]}>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: '#0000003e',
              borderRadius: 22,
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <BackSvg width={19} height={19} />
          </Pressable>

          <CustomText
            style={[
              {
                flex: 1,
                color: 'white',
                fontSize: 26,
                marginLeft: 17,
              },
              headerTextColor,
            ]}
            fontWeight="500">
            {communityData.englishName.toUpperCase()}
          </CustomText>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: '#0000003e',
              borderRadius: 24,
            }}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <HomeSvg width={22} height={22} />
          </Pressable>
          <Avatar
            size={40}
            style={{borderColor: '#58a04b', borderWidth: 1.5, marginLeft: 15}}
          />
        </Animated.View>
      ),
    });
  });

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getPosts = async () => {
        try {
          const response = await getCommunitiesToPosts({id: communityId});

          if (isActive) {
            setData(response.data || []);
          }
        } catch (error) {
          //
        }
      };

      getPosts();

      return () => {
        isActive = false;
      };
    }, [communityId]),
  );

  const postLike = async (
    postId: number,
    index: number,
    communityId: number,
  ) => {
    const response = await getPostsLike({
      communityId: communityId,
      postId: postId,
    });

    if (response.message === 'like success') {
      const newData = [...data];
      newData[index] = {
        ...newData[index],
        likeStatus: 'TRUE',
        likeCount: newData[index].likeCount + 1,
      };

      setData(newData);

      return;
    }
    if (response.message === 'like cancel success') {
      const newData = [...data];
      newData[index] = {
        ...newData[index],
        likeStatus: 'FALSE',
        likeCount: newData[index].likeCount - 1,
      };

      setData(newData);

      return;
    }
  };

  return (
    <Tabs.FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 70}}
      data={[...data]}
      renderItem={({item, index}) => (
        <Pressable
          onPress={() =>
            navigation.navigate('Post', {
              communityId,
              postId: item.id,
              type: 'To',
            })
          }>
          <Post
            item={item}
            postLike={postLike}
            index={index}
            communityId={communityId}
          />
        </Pressable>
      )}
    />
  );
};

export default ToPostScreen;
