import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import PlusGreenSvg from '../../assets/images/plus-green.svg';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import {axiosInstance} from '../apis';

import {GetUsersCommunities, getMyCommunitiesPosts} from '../apis/community';
import {useFocusEffect} from '@react-navigation/native';
import {Player} from '../components/PlayerCard';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import BellSvg from '../../assets/images/bell.svg';
import PersonSvg from '../../assets/images/person.svg';
import Post, {PostType} from '../components/Post';
import {getPostsLike} from '../apis/post';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

const HomeScreen = ({navigation}: {navigation: HomeScreenNavigationProp}) => {
  const [myCommunity, setMyCommunity] = React.useState<Player[]>([]);
  const [myPost, setMyPost] = React.useState<PostType[]>([]);

  const setData = async () => {
    try {
      const response = await axiosInstance.get(`/set-data`);
      return response.data;
    } catch (error) {
      //
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getCommunities = async () => {
        try {
          const communityData = await GetUsersCommunities();
          const postData = await getMyCommunitiesPosts();

          if (isActive) {
            setMyCommunity(communityData || []);
            setMyPost(postData.data || []);
          }
        } catch (error) {
          //
        }
      };

      getCommunities();

      return () => {
        isActive = false;
      };
    }, []),
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
      const newData = [...myPost];
      newData[index] = {
        ...newData[index],
        likeStatus: 'TRUE',
        likeCount: newData[index].likeCount + 1,
      };

      setMyPost(newData);

      return;
    }
    if (response.message === 'like cancel success') {
      const newData = [...myPost];
      newData[index] = {
        ...newData[index],
        likeStatus: 'FALSE',
        likeCount: newData[index].likeCount - 1,
      };

      setMyPost(newData);

      return;
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 5}}
        ListHeaderComponentStyle={{
          paddingHorizontal: 15,
          borderBottomWidth: 2,
          borderColor: '#f3f3f3',
          paddingBottom: 15,
          marginBottom: 5,
        }}
        ListHeaderComponent={
          <>
            {/* header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <CustomText
                fontWeight="700"
                style={{
                  fontSize: 30,
                  flex: 1,
                  marginBottom: 5,
                }}>
                Cheering
              </CustomText>
              <View
                style={{
                  backgroundColor: '#58a04b',
                  padding: 10,
                  borderRadius: 30,
                  marginRight: 15,
                }}>
                <BellSvg width={20} height={20} />
              </View>
              <Pressable
                onPress={() => {
                  navigation.navigate('Setting');
                }}
                style={{
                  backgroundColor: '#58a04b',
                  padding: 9,
                  borderRadius: 30,
                }}>
                <PersonSvg width={22} height={22} />
              </Pressable>
            </View>
            {/* <Pressable
        style={styles.SearchSection}
        onPress={() => navigation.navigate('Search')}>
        <View style={styles.SearchBar}>
          <Text style={styles.SearchText}>선수 또는 소속팀 검색</Text>
          <SearchSvg width={23} />
        </View>
      </Pressable> */}
            {/* <FlatList horizontal={true} data={[]} renderItem={({item}) => <></>} /> */}

            {/* <View style={{flex: 0, flexDirection: 'row'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '75%',
              height: 200,
              borderRadius: 20,
              shadowColor: '#7a7a7a',
              shadowOffset: {
                width: 10,
                height: 10,
              },
              shadowOpacity: 0.15,
              shadowRadius: 15,

              elevation: 20,
            }}></View>
          <View
            style={{
              backgroundColor: 'white',
              width: '15%',
              height: 200,
              borderRadius: 20,
              marginLeft: 20,
              shadowColor: '#7a7a7a',
              shadowOffset: {
                width: 5,
                height: 10,
              },
              shadowOpacity: 0.15,
              shadowRadius: 15,

              elevation: 20,
            }}></View>
          <View
            style={{
              backgroundColor: 'white',
              width: '15%',
              height: 200,
              borderRadius: 20,
              marginHorizontal: 20,
              shadowColor: '#7a7a7a',
              shadowOffset: {
                width: 10,
                height: 10,
              },
              shadowOpacity: 0.1,
              shadowRadius: 15,

              elevation: 20,
            }}></View>
        </View> */}

            <View>
              <View style={styles.MyPlayerHeader}>
                <CustomText fontWeight="500" style={styles.MyPlayerTitle}>
                  나의 선수들
                </CustomText>
                {/* <Pressable onPress={() => navigation.navigate('Search')}>
              <PlusSvg width={25} />
            </Pressable> */}
              </View>

              <View style={styles.MyPlayerList}>
                <Pressable
                  onPress={() => navigation.navigate('Search')}
                  style={styles.Player}>
                  <View style={styles.PlayerAddBtn}>
                    <PlusGreenSvg width={35} height={35} />
                  </View>
                  <CustomText fontWeight="500" style={styles.PlayerName}>
                    추가
                  </CustomText>
                </Pressable>
                {myCommunity.map(community => (
                  <Pressable
                    key={community.id}
                    onPress={() =>
                      navigation.navigate('Community', {
                        communityId: community.id,
                      })
                    }
                    style={styles.Player}>
                    <Image
                      source={{uri: community.image}}
                      style={styles.PlayerImage}
                      resizeMode="cover"
                    />
                    <CustomText fontWeight="500" style={styles.PlayerName}>
                      {community.name}
                    </CustomText>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        }
        ListFooterComponentStyle={{paddingHorizontal: 15, marginTop: 100}}
        ListFooterComponent={
          <>
            <CustomButton onPress={setData} text="setData" />
          </>
        }
        data={myPost}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() =>
              navigation.navigate('Post', {
                communityId: item.communityId,
                postId: item.id,
                type: 'From',
              })
            }>
            <Post
              item={item}
              index={index}
              postLike={postLike}
              communityId={item.communityId}
            />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    paddingHorizontal: 15,
  },
  ADCarousel: {
    height: '35%',
    backgroundColor: 'black',
  },
  ADCarouselText: {
    color: 'white',
  },
  SearchSection: {padding: 11},
  SearchBar: {
    flex: 0,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 15,
    paddingRight: 10,
  },
  SearchText: {
    flex: 1,
    color: 'gray',
    fontSize: 15,
  },
  MyPlayerHeader: {
    flexDirection: 'row',
    flex: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  MyPlayerTitle: {
    fontSize: 19,
    color: '#000000',
  },
  MyPlayerList: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  Player: {
    width: '25%',
    flex: 0,
    padding: 5,
    alignItems: 'center',
  },
  PlayerAddBtn: {
    backgroundColor: '#ebf1e9',
    width: 67,
    height: 67,
    borderRadius: 100,
    marginBottom: 5,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PlayerImage: {
    backgroundColor: '#e5e5e5',
    width: 67,
    height: 67,
    borderRadius: 100,
    marginBottom: 5,
  },
  PlayerName: {
    color: '#3a3a3a',
  },
});

export default HomeScreen;
