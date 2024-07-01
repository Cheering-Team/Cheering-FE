import React, {useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, Pressable, View} from 'react-native';
import CustomText from '../../CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CommentModal = () => {
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(0)).current;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    Animated.timing(translateY, {
      toValue: -Dimensions.get('window').height * 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalOpen(false);
    });
  };

  return (
    <>
      {isModalOpen && (
        <Pressable
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
          onPressOut={closeModal}
        />
      )}

      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            bottom: -Dimensions.get('window').height * 0.6 + 55 + insets.bottom,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
          },
          {transform: [{translateY}]},
        ]}>
        {!isModalOpen ? (
          <Pressable
            style={{
              height: 35,
              backgroundColor: '#58a04b',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
            onPress={openModal}>
            <CustomText fontWeight="600" style={{color: 'white', fontSize: 16}}>
              댓글 100개 모두 보기
            </CustomText>
          </Pressable>
        ) : (
          <View
            style={{
              backgroundColor: '#a2a2a2',
              width: 50,
              height: 6,
              marginTop: 10,
              borderRadius: 6,
            }}
          />
        )}
        <FlatList
          data={[]}
          renderItem={({item}) => <></>}
          style={{
            height: Dimensions.get('window').height * 0.6,
            width: '100%',
          }}
        />
      </Animated.View>
    </>
  );
};

export default CommentModal;
