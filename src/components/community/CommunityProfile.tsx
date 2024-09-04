import React from 'react';
import {StyleSheet, View} from 'react-native';
import {formatComma} from '../../utils/format';
import LinearGradient from 'react-native-linear-gradient';
import StarOrangeSvg from '../../../assets/images/star-orange.svg';
import FastImage from 'react-native-fast-image';
import TeamList from './TeamList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomText from '../common/CustomText';

interface CommunityProfileProps {
  playerData: any;
}

const CommunityProfile = (props: CommunityProfileProps) => {
  const {playerData} = props;

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.profileContainer}>
      <View style={[styles.infoContainer, {top: insets.top + 65}]}>
        <TeamList playerData={playerData} />
        <View style={{paddingLeft: 15}}>
          <CustomText fontWeight="500" style={styles.englishName}>
            {playerData.result.englishName}
          </CustomText>
          <CustomText fontWeight="600" style={styles.koreanName}>
            {playerData.result.koreanName}
          </CustomText>
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
          uri: playerData.result.backgroundImage,
          priority: FastImage.priority.high,
        }}
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
    height: 375,
  },
  infoContainer: {position: 'absolute', zIndex: 2, width: '100%'},
  englishName: {color: 'white', fontSize: 17, marginLeft: 2},
  koreanName: {color: 'white', fontSize: 41, lineHeight: 53},
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
