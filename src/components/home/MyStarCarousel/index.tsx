import {WINDOW_WIDTH} from 'constants/dimension';
import React, {useEffect, useRef, useState} from 'react';
import MyStarCard from '../MyStarCard';
import {queryClient} from '../../../../App';
import {communityKeys} from 'apis/community/queries';
import {Community} from 'apis/community/types';
import {Animated, ListRenderItem, View} from 'react-native';

interface MyStarCarouselProps {
  communities: Community[];
}

const MyStarCarousel = ({communities}: MyStarCarouselProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [curIndex, setCurIndex] = useState(0);

  const renderItem: ListRenderItem<Community> = ({item, index}) => {
    return <MyStarCard community={item} index={index} scrollX={scrollX} />;
  };

  useEffect(() => {
    if (communities) {
      communities.forEach(community => {
        queryClient.setQueryData(communityKeys.detail(community.id), community);
      });
    }
  }, [communities]);

  return (
    <>
      <Animated.FlatList
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{
          paddingHorizontal: (WINDOW_WIDTH * 0.1) / 2,
          paddingVertical: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={communities}
        decelerationRate={'fast'}
        horizontal
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: true,
            listener: (event: any) => {
              setCurIndex(
                Math.round(
                  event.nativeEvent.contentOffset.x / (WINDOW_WIDTH * 0.9),
                ),
              );
            },
          },
        )}
        scrollEventThrottle={16}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        bounces={false}
        style={{height: 200}}
        snapToAlignment={'start'}
        snapToInterval={WINDOW_WIDTH * 0.9}
      />
      <View className="flex-row justify-center items-center mt-[3]">
        {communities.map((_, index) => {
          if (index === curIndex) {
            return (
              <View
                key={index}
                className="w-[7] h-[7] bg-gray-600 rounded-full mx-[3]"
              />
            );
          }
          return (
            <View
              key={index}
              className="w-[5] h-[5] bg-gray-300 rounded-full mx-[3]"
            />
          );
        })}
      </View>
    </>
  );
};

export default MyStarCarousel;
