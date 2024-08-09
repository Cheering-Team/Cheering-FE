import React, {RefObject} from 'react';
import {Animated, FlatList, Pressable, View} from 'react-native';
import ChevronTopSvg from '../../../../../assets/images/chevron-top-black.svg';
import PencilSvg from '../../../../../assets/images/pencil.svg';
import {WINDOW_HEIGHT} from '../../../../constants/dimension';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {CommunityScreenNavigationProp} from '../../../../screens/communityStack/CommunityScreen';

interface FloatButtonProps {
  playerId?: number;
  fadeAnim: Animated.Value;
  flatListRef: RefObject<FlatList<any>>;
  isToTop: boolean;
  offset: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FloatButton = (props: FloatButtonProps) => {
  const {playerId, fadeAnim, flatListRef, isToTop, offset} = props;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CommunityScreenNavigationProp>();

  return (
    <View
      style={{
        alignItems: 'center',
        position: 'absolute',
        bottom: insets.bottom + 67,
        right: 17,
      }}>
      {isToTop && (
        <AnimatedPressable
          style={[
            {
              borderRadius: 100,
              width: 43,
              height: 43,
              marginBottom: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              shadowColor: '#bdbdbd',
              shadowOffset: {width: 1, height: 2},
              shadowOpacity: 0.7,
              shadowRadius: 3,
              elevation: 5,
            },
            {opacity: fadeAnim},
          ]}
          onPress={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({
                offset: offset,
                animated: true,
              });
            }
          }}>
          <ChevronTopSvg width={25} height={25} />
        </AnimatedPressable>
      )}
      {playerId && (
        <View
          style={{
            borderRadius: 100,
            backgroundColor: 'white',
            shadowColor: '#999999',
            shadowOffset: {width: 1, height: 2},
            shadowOpacity: 0.9,
            shadowRadius: 3,
            elevation: 5,
          }}>
          <Pressable
            style={{
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#282828',
              borderRadius: 100,
            }}
            onPress={() => {
              navigation.navigate('PostWrite', {playerId});
            }}>
            <PencilSvg width={25} height={25} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default FloatButton;
