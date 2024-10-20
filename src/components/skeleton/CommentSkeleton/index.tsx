import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CommentSkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
      <View style={{paddingHorizontal: 15}}>
        {[1, 1, 1, 1, 1].map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              marginVertical: 15,
            }}>
            <View
              style={{
                width: 33,
                height: 33,
                borderRadius: 999,
                marginTop: 3,
              }}
            />
            <View style={{width: '100%', marginLeft: 10}}>
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
            </View>
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default CommentSkeleton;
