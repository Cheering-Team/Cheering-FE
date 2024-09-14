import React from 'react';
import {Dimensions, View} from 'react-native';
import CustomText from '../CustomText';

const WINDOW_HEIGHT = Dimensions.get('window').height;

interface ListEmptyProps {
  type?: 'feed' | 'notification';
}

const ListEmpty = (props: ListEmptyProps) => {
  const {type = 'feed'} = props;
  return (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.3 + 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CustomText fontWeight="600" style={{fontSize: 23, marginBottom: 5}}>
        {type === 'feed' && '아직 게시글이 없어요'}
        {type === 'notification' && '아직 알림이 없어요'}
      </CustomText>
      <CustomText style={{color: '#5b5b5b'}}>
        {type === 'feed' && '가장 먼저 게시글을 작성해보세요'}
        {type === 'notification' && '커뮤니티에 가입하여 팬들과 소통해보세요'}
      </CustomText>
    </View>
  );
};

export default ListEmpty;
