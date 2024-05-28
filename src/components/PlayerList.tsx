import {Dimensions, FlatList, Image, Pressable, View} from 'react-native';
import CustomText from './CustomText';
import React from 'react';

const PlayerList = () => {
  return (
    <FlatList
      numColumns={3}
      contentContainerStyle={{paddingTop: 80}}
      data={[
        {
          name: '전준우',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%8C%E1%85%AE%E1%86%AB%E1%84%8B%E1%85%AE.jpeg',
        },
        {
          name: '유강남',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%B2%E1%84%80%E1%85%A1%E1%86%BC%E1%84%82%E1%85%A1%E1%86%B7.jpeg',
        },
        {
          name: '정훈',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%92%E1%85%AE%E1%86%AB.jpeg',
        },
        {
          name: '김민성',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%86%B7%E1%84%86%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A5%E1%86%BC.jpeg',
        },
        {
          name: '레이예스',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%89%E1%85%B3.jpeg',
        },
        {
          name: '전준우',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%8C%E1%85%AE%E1%86%AB%E1%84%8B%E1%85%AE.jpeg',
        },
        {
          name: '유강남',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%B2%E1%84%80%E1%85%A1%E1%86%BC%E1%84%82%E1%85%A1%E1%86%B7.jpeg',
        },
        {
          name: '정훈',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%92%E1%85%AE%E1%86%AB.jpeg',
        },
        {
          name: '김민성',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%86%B7%E1%84%86%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A5%E1%86%BC.jpeg',
        },
        {
          name: '레이예스',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%89%E1%85%B3.jpeg',
        },
        {
          name: '전준우',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%8C%E1%85%AE%E1%86%AB%E1%84%8B%E1%85%AE.jpeg',
        },
        {
          name: '유강남',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8B%E1%85%B2%E1%84%80%E1%85%A1%E1%86%BC%E1%84%82%E1%85%A1%E1%86%B7.jpeg',
        },
        {
          name: '정훈',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%92%E1%85%AE%E1%86%AB.jpeg',
        },
        {
          name: '김민성',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%86%B7%E1%84%86%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A5%E1%86%BC.jpeg',
        },
        {
          name: '레이예스',
          team: '롯데 자이언츠',
          image:
            'https://cheering-bucket.s3.ap-northeast-2.amazonaws.com/%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%89%E1%85%B3.jpeg',
        },
      ]}
      renderItem={({item}) => (
        <Pressable style={{paddingBottom: 10, backgroundColor: 'white'}}>
          <Image
            source={{uri: item.image}}
            resizeMode="cover"
            style={{
              height: 150,
              width: Dimensions.get('window').width / 3,
              backgroundColor: 'white',
            }}
          />
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}>
            <View>
              <CustomText
                style={{fontSize: 12, color: '#3f3f3f', paddingBottom: 0}}>
                {item.team}
              </CustomText>
              <CustomText fontWeight="500" style={{fontSize: 16}}>
                {item.name}
              </CustomText>
            </View>

            <CustomText
              fontWeight="600"
              style={{fontSize: 12, color: '#fd5853', marginTop: 5}}>
              12,321+
            </CustomText>
          </View>
        </Pressable>
      )}
    />
  );
};

export default PlayerList;
