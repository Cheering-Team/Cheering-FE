import React from 'react';
import {FlatList, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DailySkeleton = () => {
  return (
    <FlatList
      data={[1, 1, 1, 1, 1, 1, 1]}
      contentContainerStyle={{marginTop: 10, marginHorizontal: 15}}
      renderItem={() => (
        <SkeletonPlaceholder backgroundColor="#f4f4f4" highlightColor="#ffffff">
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  marginTop: 4,
                }}
              />
              <View
                style={{
                  width: '65%',
                  marginLeft: 12,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: 15,
                    borderRadius: 5,
                    marginVertical: 3,
                  }}
                />
                <View
                  style={{
                    width: '60%',
                    height: 15,
                    borderRadius: 5,
                    marginVertical: 3,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
                width: '70%',
                marginVertical: 30,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 25, height: 25, borderRadius: 999}} />
                <View
                  style={{
                    height: 15,
                    flex: 1,
                    marginLeft: 12,
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
          </View>
        </SkeletonPlaceholder>
      )}
    />
  );
};

export default DailySkeleton;
