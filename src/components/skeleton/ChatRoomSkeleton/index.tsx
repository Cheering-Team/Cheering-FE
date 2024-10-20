import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ChatRoomSkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
      <View style={{paddingHorizontal: 15, paddingTop: 3}}>
        {[1, 1, 1, 1, 1].map((_, index) => (
          <View key={index} style={{flexDirection: 'row', paddingVertical: 7}}>
            <View style={{width: 59, height: 59, borderRadius: 15}} />
            <View style={{marginLeft: 12, width: '100%'}}>
              <View
                style={{
                  height: 10,
                  width: '20%',
                  marginVertical: 5,
                  borderRadius: 3,
                }}
              />
              <View
                style={{
                  height: 10,
                  width: '50%',
                  marginVertical: 5,
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

export default ChatRoomSkeleton;
