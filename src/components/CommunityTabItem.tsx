import React, {useMemo} from 'react';
import {StyleSheet, Pressable, Platform} from 'react-native';
import {MaterialTabItemProps} from 'react-native-collapsible-tab-view';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/src/types';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

export const TABBAR_HEIGHT = 48;

/**
 * Any additional props are passed to the pressable component.
 */
export const CommunityTabItem = <T extends TabName = string>(
  props: MaterialTabItemProps<T>,
): React.ReactElement => {
  const {
    name,
    index,
    onPress,
    onLayout,
    scrollEnabled,
    indexDecimal,
    label,
    style,
    labelStyle,
    inactiveOpacity = 1,
    pressColor = '#DDDDDD',
    pressOpacity = Platform.OS === 'ios' ? 0.2 : 1,
    ...rest
  } = props;

  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        indexDecimal.value,
        [index - 1, index, index + 1],
        [inactiveOpacity, 1, inactiveOpacity],
        Extrapolation.CLAMP,
      ),
      color: Math.abs(index - indexDecimal.value) < 0.5 ? '#83c677' : 'white',
    };
  });

  const renderedLabel = useMemo(() => {
    if (typeof label === 'string') {
      return (
        <Animated.Text style={[styles.label, stylez, labelStyle]}>
          {`${label}`}
        </Animated.Text>
      );
    }

    return label(props);
  }, [label, labelStyle, props, stylez]);

  return (
    <Pressable
      onLayout={onLayout}
      style={({pressed}) => [!scrollEnabled && styles.grow, styles.item, style]}
      onPress={() => onPress(name)}
      android_ripple={
        {
          // borderless: true,
          // color: pressColor,
        }
      }
      {...rest}>
      {renderedLabel}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 5,
    height: 45,
    backgroundColor: '#242424',
  },
  selectedItem: {
    backgroundColor: 'white',
  },
  label: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    includeFontPadding: false,
  },
});
