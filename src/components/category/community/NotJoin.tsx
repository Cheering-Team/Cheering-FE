import React from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import Avatar from '../../Avatar';
import CustomText from '../../CustomText';
import StarWhiteSvg from '../../../../assets/images/star-white.svg';

interface NotJoinProps {
  playerData: any;
  setIsModalOpen: any;
  translateY: any;
}

const NotJoin = (props: NotJoinProps) => {
  const {playerData, setIsModalOpen, translateY} = props;

  const openModal = () => {
    setIsModalOpen(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[
        styles.container,
        {height: Dimensions.get('window').height * 0.3 + 20},
      ]}>
      <View style={styles.imageContainer}>
        <Avatar
          uri={playerData.result.image}
          size={85}
          style={styles.playerImage}
        />
        <View style={styles.starImage}>
          <StarWhiteSvg width={45} height={45} />
        </View>
      </View>

      <View style={styles.imageContainer}>
        <CustomText fontWeight="500" style={styles.title}>
          {`${playerData.result.koreanName} `}
        </CustomText>
        <CustomText fontWeight="500" style={styles.title}>
          커뮤니티
        </CustomText>
      </View>

      <CustomText style={styles.info}>
        프로필을 설정한 후, 바로 이용해보세요
      </CustomText>

      <CustomText
        onPress={openModal}
        fontWeight="600"
        style={styles.joinButton}>
        프로필 등록
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  playerImage: {left: 8, zIndex: 1},
  starImage: {
    right: 8,
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: '#fba94b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: 19, color: '#000000', marginTop: 15},
  info: {fontSize: 14, color: '#4a4a4a', marginTop: 5},
  joinButton: {fontSize: 15, color: '#fba94b', marginTop: 10},
});

export default NotJoin;
