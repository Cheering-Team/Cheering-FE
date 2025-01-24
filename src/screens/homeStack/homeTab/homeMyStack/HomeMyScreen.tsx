import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native';
import LogoSvg from 'assets/images/logo-text.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyStarCarousel from 'components/home/MyStarCarousel';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';

const CollectScreen = () => {
  const insets = useSafeAreaInsets();

  const {data: communities} = useGetMyCommunities(true);

  if (!communities) {
    return null;
  }

  return (
    <View
      className="flex-1"
      style={{
        marginTop: insets.top,
      }}>
      <ScrollView>
        <View className="h-[45] justify-center items-center">
          <LogoSvg width={200} height={50} />
        </View>
        <MyStarCarousel communities={communities} />
        <View className="justify-center items-center h-[200]">
          <CustomText>나머지 모아보기 내용</CustomText>
        </View>
      </ScrollView>
    </View>
  );
};

export default CollectScreen;
