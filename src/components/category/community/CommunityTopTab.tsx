import React, {Dispatch, SetStateAction} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import CustomText from '../../common/CustomText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CommunityTopTabProps {
  type?: 'normal' | 'absolute';
  scrollY?: Animated.Value;
  curTab: string;
  setCurTab: Dispatch<SetStateAction<string>>;
}

const CommunityTopTab = (props: CommunityTopTabProps) => {
  const {
    type = 'normal',
    scrollY = new Animated.Value(0),
    curTab,
    setCurTab,
  } = props;

  const insets = useSafeAreaInsets();

  let translateYInteract;

  if (type === 'absolute') {
    const diffClamp = Animated.diffClamp(scrollY, 0, 100);

    translateYInteract = diffClamp.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -70],
    });
  }

  return (
    <Animated.FlatList
      style={[
        styles.container,
        type === 'absolute' && {
          top: insets.top + 52,
          zIndex: 5,
          position: 'absolute',
          width: '100%',
          transform: translateYInteract
            ? [{translateY: translateYInteract}]
            : [],
        },
      ]}
      horizontal={true}
      data={[{name: '피드'}, {name: '채팅'}]}
      renderItem={({item}) => (
        <Pressable
          style={[
            styles.tabItem,
            curTab === item.name && styles.selectedTabItem,
          ]}
          key={item.name}
          onPress={() => {
            setCurTab(item.name);
          }}>
          <CustomText
            fontWeight={curTab === item.name ? '700' : '700'}
            style={[
              styles.tabName,
              curTab === item.name && styles.selectedTabName,
            ]}>
            {item.name}
          </CustomText>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'black',
  },
  tabItem: {
    paddingTop: 5,
    paddingBottom: 2,
    marginBottom: 2,
    marginHorizontal: 15,
    paddingHorizontal: 2,
  },
  selectedTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabName: {fontSize: 17, color: '#9f9f9f'},
  selectedTabName: {color: 'white'},
});

export default CommunityTopTab;
