import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from './CustomText';

interface TooltipProps {
  message: string;
}

const Tooltip = ({message}: TooltipProps) => {
  return (
    <>
      <View style={styles.tooltip}>
        <CustomText numberOfLines={2} style={styles.tooltipText}>
          {message}
        </CustomText>
      </View>
      <View style={styles.triangle} />
    </>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: '#fa4b4b',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    maxWidth: 250,
    zIndex: 20,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fa4b4b',
    alignSelf: 'center',
    position: 'absolute',
    transform: [{rotateX: '180deg'}],
    zIndex: 10,
    bottom: -7,
    left: 10,
  },
});

export default Tooltip;
