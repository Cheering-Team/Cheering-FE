import CustomText from 'components/common/CustomText';
import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

const width = 50;

const AgeSliderLabel = props => {
  return (
    <View style={{position: 'relative'}}>
      {Number.isFinite(props.oneMarkerLeftPosition) &&
        Number.isFinite(props.oneMarkerValue) && (
          <View
            style={[
              styles.sliderLabel,
              {left: props.oneMarkerLeftPosition - width / 2},
            ]}>
            <CustomText fontWeight="500" style={styles.sliderLabelText}>
              {props.oneMarkerValue}
            </CustomText>
          </View>
        )}

      {Number.isFinite(props.twoMarkerLeftPosition) &&
        Number.isFinite(props.twoMarkerValue) && (
          <View
            style={[
              styles.sliderLabel,
              {left: props.twoMarkerLeftPosition - width / 2},
            ]}>
            <CustomText fontWeight="500" style={styles.sliderLabelText}>
              {props.twoMarkerValue === 45 ? '45+' : props.twoMarkerValue}
            </CustomText>
          </View>
        )}
    </View>
  );
};

export default AgeSliderLabel;

const styles = StyleSheet.create({
  sliderLabel: {
    position: 'absolute',
    bottom: -10,
    minWidth: width,
    paddingHorizontal: 8,
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    color: '#484848',
    fontSize: 12,
  },
});
