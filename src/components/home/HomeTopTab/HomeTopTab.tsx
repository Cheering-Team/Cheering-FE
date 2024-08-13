import React, {Dispatch, SetStateAction} from 'react';
import {Animated, FlatList, Pressable, View} from 'react-native';
import Avatar from '../../common/Avatar';
import CustomText from '../../common/CustomText';
import ChevronRightSvg from '../../../../assets/images/chevron-right-gray.svg';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeStackParamList} from '../../../navigations/HomeStackNavigator';
import {GetPlayersResponse} from '../../../types/player';
import {Api} from '../../../types/api';

interface HomeTopTabProps {
  type?: 'normal' | 'absolute';
  scrollY?: Animated.Value;
  playerData: Api<GetPlayersResponse[]>;
  hotTab: number;
  setHotTab: Dispatch<SetStateAction<number>>;
}

const HomeTopTab = (props: HomeTopTabProps) => {
  const {
    type = 'normal',
    scrollY = new Animated.Value(0),
    playerData,
    hotTab,
    setHotTab,
  } = props;

  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  let translateYInteract;

  if (type === 'absolute') {
    const diffClamp = Animated.diffClamp(scrollY, 0, 150);

    translateYInteract = diffClamp.interpolate({
      inputRange: [0, 150],
      outputRange: [0, -100],
    });
  }

  return (
    <Animated.View
      style={[
        type === 'absolute' && {
          top: insets.top + 52,
          zIndex: 5,
          position: 'absolute',
          width: '100%',
          transform: translateYInteract
            ? [{translateY: translateYInteract}]
            : [],
        },
      ]}>
      <FlatList
        style={{
          flexGrow: 0,
          paddingHorizontal: 8,
          backgroundColor: 'white',
        }}
        data={[{id: 0, koreanName: '전체', image: null}, ...playerData?.result]}
        horizontal={true}
        renderItem={({item}) => (
          <Pressable
            onPress={() => setHotTab(item.id)}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                margin: 12,
                marginBottom: 0,
                paddingBottom: 12,
              },
            ]}>
            {item.image && (
              <Avatar
                uri={item.image}
                size={23}
                style={{borderWidth: 1, borderColor: '#e2e2e2'}}
              />
            )}

            <CustomText
              fontWeight="500"
              style={{
                marginLeft: item.id ? 7 : 0,
                fontSize: 17,
                color: item.id === hotTab ? '#58a04b' : 'black',
              }}>
              {item.koreanName}
            </CustomText>
            {item.id === hotTab && (
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: '#58a04b',
                  height: 3,
                }}
              />
            )}
          </Pressable>
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 7,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderColor: '#e7e7e7',
        }}>
        {playerData?.result.length > 0 && (
          <CustomText
            fontWeight="500"
            style={{color: '#686868', fontSize: 15, paddingBottom: 2}}>
            🔥 실시간 인기 게시글
          </CustomText>
        )}

        {hotTab !== 0 && (
          <Pressable
            onPress={() => {
              navigation.navigate('CommunityStack', {
                screen: 'Community',
                params: {playerId: hotTab},
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#eeeeee',
              borderRadius: 15,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}>
            <CustomText
              fontWeight="500"
              style={{
                color: '#686868',
                fontSize: 14,
                paddingBottom: 2,
                marginRight: 3,
              }}>
              커뮤니티 바로가기
            </CustomText>
            <ChevronRightSvg width={10} height={10} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export default HomeTopTab;
