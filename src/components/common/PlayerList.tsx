import {Dimensions, FlatList, Image, Pressable, View} from 'react-native';
import CustomText from './CustomText';
import React from 'react';
import StarOrangeSvg from '../../assets/images/star-orange.svg';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Avatar from './Avatar';
import {CategoryStackParamList} from '../../navigations/CategoryStackNavigator';
import {formatComma} from '../../utils/format';
import {Community} from 'apis/community/types';
import OfficialSvg from '../../assets/images/official.svg';
import CommunitySkeleton from 'components/skeleton/CommunitySkeleton';

interface PlayerListProps {
  type: 'Team' | 'Search';
  teamName?: string;
  communities?: Community[];
  paddingTop?: boolean;
}

const PlayerList = ({
  type,
  teamName,
  communities,
  paddingTop = false,
}: PlayerListProps) => {
  const navigation = useNavigation<NavigationProp<CategoryStackParamList>>();

  return (
    <FlatList
      numColumns={3}
      contentContainerStyle={[
        paddingTop && {paddingTop: 80},
        {paddingBottom: 50},
      ]}
      data={communities || []}
      renderItem={({item}) => (
        <Pressable
          style={{
            paddingBottom: 10,
            width: Dimensions.get('window').width / 3,
            backgroundColor: 'white',
          }}
          onPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'Community',
              params: {communityId: item.id},
            });
          }}>
          <Image
            source={{uri: item.image}}
            resizeMode={item.sportName ? 'contain' : 'cover'}
            style={{
              height: 150,
              width: Dimensions.get('window').width / 3,
              backgroundColor: 'white',
            }}
          />
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}>
            <View>
              {item.sportName ? (
                <CustomText
                  style={{fontSize: 12, color: '#3f3f3f', paddingBottom: 0}}>
                  {`${item.sportName}/${item.leagueName}`}
                </CustomText>
              ) : (
                <CustomText
                  style={{fontSize: 12, color: '#3f3f3f', paddingBottom: 0}}>
                  {teamName || (item.teams && item.teams[0].name)}
                </CustomText>
              )}
              <View className="flex-row">
                <CustomText fontWeight="500" style={{fontSize: 16}}>
                  {item.koreanName}
                </CustomText>
                {item.manager && (
                  <OfficialSvg
                    width={12}
                    height={12}
                    style={{marginTop: 5, marginLeft: 1}}
                  />
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <StarOrangeSvg width={11} height={11} />
              <CustomText
                fontWeight="600"
                style={{
                  fontSize: 12,
                  color: '#F99E35',
                  paddingBottom: 2,
                  marginLeft: 3,
                }}>
                {formatComma(item.fanCount)}
              </CustomText>
            </View>
          </View>
          {item.user && (
            <Pressable
              onPress={() => {
                if (item.user !== null) {
                  navigation.navigate('CommunityStack', {
                    screen: 'Profile',
                    params: {fanId: item.user.id},
                  });
                }
              }}>
              <Avatar
                uri={item.user.image}
                size={30}
                style={{
                  position: 'absolute',
                  bottom: 15,
                  right: 5,
                  borderWidth: 1,
                  borderColor: '#d1d1d1',
                }}
              />
            </Pressable>
          )}
        </Pressable>
      )}
      ListEmptyComponent={
        !communities ? (
          <CommunitySkeleton />
        ) : type === 'Team' ? (
          <View
            style={{
              height: Dimensions.get('window').height * 0.3 + 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CustomText
              fontWeight="600"
              className="text-base mb-[5] text-gray-800">
              등록된 선수가 없어요
            </CustomText>
          </View>
        ) : (
          <></>
        )
      }
    />
  );
};

export default PlayerList;
