import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface FeedSkeletonProps {
  type: 'Home' | 'Community';
}

const FeedSkeleton = ({type}: FeedSkeletonProps) => {
  return (
    <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
      <View style={type === 'Home' && {marginTop: 50}}>
        {[1, 1, 1, 1, 1].map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                width: 33,
                height: 33,
                borderRadius: 999,
                marginRight: 15,
              }}
            />
            <View style={{width: '100%'}}>
              <View
                style={{
                  width: '30%',
                  height: 14,
                  marginVertical: 4,
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  width: '70%',
                  height: 14,
                  marginVertical: 4,
                  borderRadius: 5,
                }}
              />
              <View
                style={{
                  width: '50%',
                  height: 14,
                  marginVertical: 4,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default FeedSkeleton;
