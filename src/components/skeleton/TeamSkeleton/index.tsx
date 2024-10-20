import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TeamSkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
      <View>
        {[1, 1, 1, 1, 1].map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 40,
            }}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 7,
                  borderRadius: 10,
                }}
              />
              <View style={{width: 40, height: 10, borderRadius: 3}} />
            </View>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 7,
                  borderRadius: 10,
                }}
              />
              <View style={{width: 40, height: 10, borderRadius: 3}} />
            </View>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 7,
                  borderRadius: 10,
                }}
              />
              <View style={{width: 40, height: 10, borderRadius: 3}} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default TeamSkeleton;
