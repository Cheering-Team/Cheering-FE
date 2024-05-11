import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import Post, {PostType} from '../components/Post';
import {getCommunitiesFromPosts} from '../apis/community';

import {useFocusEffect} from '@react-navigation/native';

import {Pressable} from 'react-native';
import {getPostsLike} from '../apis/post';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';

interface ToPostScreenProps {
  communityId: number;
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Community'>;
}

const FromPostScreen = (props: ToPostScreenProps) => {
  const {communityId, navigation} = props;
  const [data, setData] = React.useState<PostType[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getPosts = async () => {
        try {
          const response = await getCommunitiesFromPosts({id: communityId});

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
      data={[...data]}
      renderItem={({item, index}) => (
        <Pressable
          onPress={() =>
            navigation.navigate('Post', {
              communityId,
              postId: item.id,
              type: 'From',
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

export default FromPostScreen;
