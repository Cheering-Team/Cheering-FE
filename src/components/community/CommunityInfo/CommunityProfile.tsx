import React from 'react';
import {StyleSheet, View} from 'react-native';
import {formatComma} from '../../../utils/format';
import LinearGradient from 'react-native-linear-gradient';
import StarOrangeSvg from '../../../assets/images/star-orange.svg';
import FastImage from 'react-native-fast-image';
import TeamList from './TeamList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../../common/CustomText';
import {WINDOW_HEIGHT} from '../../../constants/dimension';
import {ApiResponse} from 'apis/types';
import {Community} from 'apis/player/types';
import OfficialSvg from '../../../assets/images/official.svg';

interface CommunityProfileProps {
  playerData: ApiResponse<Community>;
}

const CommunityProfile = (props: CommunityProfileProps) => {
  const {playerData} = props;

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.profileContainer, {height: WINDOW_HEIGHT / 2}]}>
      <View style={[styles.infoContainer, {top: insets.top + 55}]}>
        {playerData.result.sportName ? (
          <CustomText className="ml-5 text-white text-[13px]">{`${playerData.result.sportName} / ${playerData.result.leagueName}`}</CustomText>
        ) : (
          <TeamList playerData={playerData} />
        )}

        <View style={{paddingLeft: 15}}>
          {playerData.result.englishName && (
            <CustomText fontWeight="500" style={styles.englishName}>
              {playerData.result.englishName}
            </CustomText>
          )}

          <View className="flex-row">
            <CustomText
              fontWeight="600"
              style={
                playerData.result.koreanName.length > 10
                  ? styles.koreanNameLong
                  : styles.koreanName
              }>
              {playerData.result.koreanName}
            </CustomText>
            {playerData.result.manager && (
              <OfficialSvg
                width={18}
                height={18}
                style={{marginTop: 6, marginLeft: 3}}
              />
            )}
          </View>

          <View style={styles.fanCountContainer}>
            <StarOrangeSvg width={14} height={14} />
            <CustomText style={styles.fanCount}>
              {formatComma(playerData.result.fanCount)}
            </CustomText>
          </View>
        </View>
      </View>

      <FastImage
        source={{
          uri: playerData.result.backgroundImage || playerData.result.image,
          priority: FastImage.priority.high,
        }}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <LinearGradient
        start={{x: 1, y: 1}}
        end={{x: 0, y: 0}}
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.45)', '#000000']}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.05)', '#000000']}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: '100%',
    backgroundColor: 'black',
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
  },
});

export default CommunityProfile;
