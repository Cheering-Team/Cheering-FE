import React, {Dispatch, SetStateAction} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../../../App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {GetPlayersInfoResponse} from '../../../../types/player';
import {Api} from '../../../../types/api';
import JoinProfile from './JoinProfile/JoinProfile';
import JoinTerm from './JoinTerm/JoinTerm';
import {useJoinModal} from './useJoinModal';

export interface ImageType {
  uri: string;
  name: string;
  type: string;
}

interface JoinModalProps {
  playerData: Api<GetPlayersInfoResponse>;
  isModalOpen: boolean;
  setRefreshKey: Dispatch<SetStateAction<number>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const JoinModal = (props: JoinModalProps) => {
  const {playerData, isModalOpen, setRefreshKey, setIsModalOpen} = props;

  const insets = useSafeAreaInsets();

  const {
    joinState,
    setJoinState,
    imageData,
    setImageData,
    nickname,
    setNickname,
    joinCommunity,
    translateY,
    panResponders,
    closeModal,
  } = useJoinModal(
    playerData.result.id,
    isModalOpen,
    setIsModalOpen,
    setRefreshKey,
  );

  return (
    <Modal
      animationType="fade"
      visible={isModalOpen}
      transparent={true}
      onRequestClose={closeModal}>
      <TouchableOpacity
        style={[
          styles.blur,
          {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          },
        ]}
        activeOpacity={1}
        onPressOut={closeModal}
      />

      <Animated.View
        style={[styles.modalContainer, {transform: [{translateY}]}]}
        {...panResponders.panHandlers}>
        <View
          style={[
            styles.container,
            {
              paddingBottom: insets.bottom + 20,
            },
          ]}>
          <View style={styles.topMark} />
          {joinState === 'profile' ? (
            <JoinProfile
              playerData={playerData}
              setJoinState={setJoinState}
              imageData={imageData}
              setImageData={setImageData}
              nickname={nickname}
              setNickname={setNickname}
            />
          ) : (
            <JoinTerm
              isModalOpen={isModalOpen}
              setJoinState={setJoinState}
              joinCommunity={joinCommunity}
            />
          )}
        </View>
      </Animated.View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  blur: {backgroundColor: 'rgba(0,0,0,0.5)'},
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topMark: {
    alignSelf: 'center',
    width: 50,
    height: 4,
    backgroundColor: '#eaeaea',
    marginTop: 8,
    borderRadius: 20,
  },
});

export default JoinModal;
