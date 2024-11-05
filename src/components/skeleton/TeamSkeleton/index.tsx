import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const TeamSkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
      <View style={{marginHorizontal: 20}}>
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
          <View
            style={{
              width: '100%',
              height: 18,
              marginVertical: 20,
              borderRadius: 3,
            }}
          />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default TeamSkeleton;
