import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CommunitySkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
      <View>
        {[1, 1, 1].map((_, index) => (
          <View key={index} style={{flexDirection: 'row', marginBottom: 50}}>
            <View style={{flex: 1}}>
              <View style={{height: 150}} />
              <View
                style={{
                  height: 10,
                  width: '70%',
                  marginTop: 5,
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  height: 10,
                  width: '50%',
                  marginTop: 5,
                  borderRadius: 3,
                }}
              />
            </View>
            <View style={{flex: 1}}>
              <View style={{height: 150}} />
              <View
                style={{
                  height: 10,
                  width: '70%',
                  marginTop: 5,
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  height: 10,
                  width: '50%',
                  marginTop: 5,
                  borderRadius: 3,
                }}
              />
            </View>
            <View style={{flex: 1}}>
              <View style={{height: 150}} />
              <View
                style={{
                  height: 10,
                  width: '70%',
                  marginTop: 5,
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  height: 10,
                  width: '50%',
                  marginTop: 5,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default CommunitySkeleton;
