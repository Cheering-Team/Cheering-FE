import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import {useRoute} from '@react-navigation/native';
import {getCommunitiesMain} from '../apis/community';
import {WindowHeight} from '../constants/dimension';

export interface CommunityMain {
  fanCount: number;
  backgroundImage: string | undefined;
  englishName: string;
  koreanName: string;
  teamName: string;
}

const CommunityHeader = () => {
  const route = useRoute();

  const [communityData, setCommunityData] = React.useState<CommunityMain>({
    fanCount: 0,
    backgroundImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMN3Drroa4Vfutn4ARik9LACvb57TO5ADHC5n5sBeTBg&s',
    englishName: '',
    koreanName: '',
    teamName: '',
  });

  React.useEffect(() => {
    const getCommunityMain = async () => {
      const response = await getCommunitiesMain({
        id: route.params?.communityId,
      });

      if (response.message === 'get community success') {
        setCommunityData(response.data);
      }
    };

    getCommunityMain();
  }, [route.params?.communityId]);

  return (
    <>
      <ImageBackground
        style={styles.CommunityHeader}
        source={{uri: communityData.backgroundImage}}
        resizeMode="cover"
        defaultSource={require('../../assets/images/white_background.jpeg')}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.3)', '#242424']}
          style={styles.CommunityHeaderBlur}
        />
        <View style={styles.CommunityTitle}>
          <View style={styles.CommunityInfo}>
            {/* <Image
                      source={require('../../assets/images/psg.png')}
                      style={styles.TeamLogo}
                      resizeMode="contain"
                    />
    
                    <Image
                      source={require('../../assets/images/Kr.png')}
                      style={styles.TeamLogo}
                      resizeMode="contain"
                    /> */}
          </View>
          <CustomText fontWeight="700" style={styles.CommunityName}>
            {communityData.englishName.toUpperCase()}
          </CustomText>
        </View>
      </ImageBackground>
    </>
  );
};

export default CommunityHeader;

const styles = StyleSheet.create({
  // 헤더
  CommunityHeader: {
    flex: 1,
    alignItems: 'center',
    height: WindowHeight * 0.55,
  },
  CommunityHeaderBlur: {
    width: '100%',
    height: WindowHeight * 0.55,
  },
  CommunityTitle: {
    position: 'absolute',
    bottom: -2,
    flex: 1,
    alignItems: 'center',
  },
  CommunityName: {
    fontSize: 40,
    letterSpacing: 2,
    color: 'white',
  },
  CommunityInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    bottom: -10,
  },
  TeamLogo: {
    width: 35,
    height: 35,
  },
});
