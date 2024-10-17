import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import StarWhiteSvg from '../../assets/images/star-white.svg';
import CustomText from '../common/CustomText';
import Avatar from '../common/Avatar';

interface NotJoinProps {
  playerData: any;
  setIsModalOpen: any;
}

const NotJoin = (props: NotJoinProps) => {
  const {playerData, setIsModalOpen} = props;

  const openModal = () => {
    setIsModalOpen();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Avatar uri={playerData.image} size={85} style={styles.playerImage} />
        <View style={styles.starImage}>
          <StarWhiteSvg width={45} height={45} />
        </View>
      </View>

      <View style={styles.imageContainer}>
        <CustomText fontWeight="500" style={styles.title}>
          {`${playerData.koreanName} `}
        </CustomText>
        <CustomText fontWeight="500" style={styles.title}>
          커뮤니티
        </CustomText>
      </View>

      <CustomText style={styles.info}>
        프로필을 설정한 후, 바로 이용할 수 있어요
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
    paddingTop: 30,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  playerImage: {left: 8, zIndex: 1, backgroundColor: 'white'},
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
