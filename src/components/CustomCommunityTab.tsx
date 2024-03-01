import React from 'react';
import {Animated, View, StyleSheet, Pressable} from 'react-native';

function CustomCommunityTab({state, descriptors, navigation, position}) {
  return (
    <View style={styles.TabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={isFocused ? styles.FocusedTabItem : styles.TabItem}>
            <Animated.Text
              style={isFocused ? styles.FocusedTabText : styles.TabText}>
              {label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default CustomCommunityTab;

const styles = StyleSheet.create({
  TabContainer: {
    flexDirection: 'row',
  },
  TabItem: {
    backgroundColor: '#242424',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  FocusedTabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  TabText: {
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
    paddingBottom: 0,
    fontSize: 18,
    color: 'white',
  },
  FocusedTabText: {
    fontFamily: 'NotoSansKR-Medium',
    includeFontPadding: false,
    paddingBottom: 0,
    fontSize: 18,
    color: '#242424',
  },
});
