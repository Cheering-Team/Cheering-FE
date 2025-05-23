import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StarOrangeSvg from 'assets/images/star-white.svg';
import FastImage from 'react-native-fast-image';
import TeamList from './TeamList';
import CustomText from '../../common/CustomText';
import {Community} from 'apis/community/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CommunityProfileProps {
  community: Community;
}

const CommunityProfile = (props: CommunityProfileProps) => {
  const {community} = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.profileContainer, {height: 110 + insets.top}]}
      pointerEvents="box-none">
      <View
        style={[
          styles.infoContainer,
          {
            bottom: 5,
            flexDirection: 'row',
            paddingLeft: 13,
            alignItems: 'flex-end',
          },
        ]}
        pointerEvents="box-none">
        <View className="flex-1" pointerEvents="none">
          <View className="flex-row items-center mb-[2] ml-[3]">
            <StarOrangeSvg width={10} height={10} className="mb-[2]" />
            <CustomText
              className="text-white ml-1 text-[13px]"
              fontWeight="500">
              {`${community.fanCount}`}
            </CustomText>
          </View>

          {community.type === 'TEAM' && (
            <CustomText
              className="text-white text-[14px]"
              fontWeight="500">{`${community.sportName} / ${community.leagueName}`}</CustomText>
          )}

          <View>
            {community.englishName && (
              <CustomText
                fontWeight="500"
                className="text-white text-[13px] leading-[15px] ml-[1]">
                {community.englishName}
              </CustomText>
            )}

            <View className="flex-row">
              <CustomText
                type="titleCenter"
                className="text-2xl text-white leading-[25px]">
                {community.koreanName}
              </CustomText>
            </View>
          </View>
        </View>
        {community.type === 'PLAYER' && <TeamList playerId={community.id} />}
      </View>

      <View pointerEvents="none">
        {community.backgroundImage ? (
          <FastImage
            source={{
              uri: community.backgroundImage,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
        ) : (
          <FastImage
            source={{
              uri: community.image,
              priority: FastImage.priority.high,
            }}
            resizeMode={community.type === 'TEAM' ? 'contain' : 'cover'}
            style={styles.backgroundImage}
          />
        )}
      </View>

      <LinearGradient
        start={{x: 1, y: 1}}
        end={{x: 0, y: 0}}
        colors={[
          'rgba(0, 0, 0, 0)',
          `${community.color}15`,
          `${community.color}30`,
        ]}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', community.color]}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: '100%',
  },
  infoContainer: {position: 'absolute', zIndex: 2, width: '100%'},
  englishName: {color: 'white', fontSize: 17, marginLeft: 2},
  koreanName: {color: 'white', fontSize: 41, lineHeight: 53},
  koreanNameLong: {color: 'white', fontSize: 35, lineHeight: 53},
  fanCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  fanCount: {color: '#F99E35', marginLeft: 4, fontSize: 16},
  backgroundImage: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
});

export default CommunityProfile;
