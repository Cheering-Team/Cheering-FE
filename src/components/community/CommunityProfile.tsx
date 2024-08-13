import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
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
    <View
      style={[
        styles.profileContainer,
        {
          height: Dimensions.get('window').height / 2.25,
        },
      ]}>
      <View style={styles.infoContainer}>
        <CustomText
          fontWeight="500"
          style={[styles.englishName, {marginTop: insets.top}]}>
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

      <FastImage
        source={{
          uri: playerData.result.backgroundImage,
          priority: FastImage.priority.high,
        }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.15)', '#000000']}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />
      <TeamList playerData={playerData} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: '100%',
  },
  infoContainer: {position: 'absolute', top: 56, left: 15, zIndex: 2},
  englishName: {color: 'white', fontSize: 17, marginLeft: 2},
  koreanName: {color: 'white', fontSize: 40, lineHeight: 50},
  fanCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  fanCount: {color: '#F99E35', marginLeft: 4, fontSize: 16, paddingBottom: 2},
  backgroundImage: {height: '100%', width: '100%'},
});

export default CommunityProfile;
