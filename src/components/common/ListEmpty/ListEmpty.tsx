import React from 'react';
import {Dimensions, View} from 'react-native';
import CustomText from '../CustomText';

const WINDOW_HEIGHT = Dimensions.get('window').height;

interface ListEmptyProps {
  type:
    | 'feed'
    | 'notification'
    | 'block'
    | 'comment'
    | 'team'
    | 'cheer'
    | 'player';
}

const ListEmpty = (props: ListEmptyProps) => {
  const {type = 'feed'} = props;
  return (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.2 + 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CustomText fontWeight="600" className="text-gray-700 text-[17px]">
        {type === 'feed' && '아직 게시글이 없어요'}
        {type === 'comment' && '아직 댓글이 없어요'}
        {type === 'notification' && '아직 알림이 없어요'}
        {type === 'block' && '차단한 계정이 없어요'}
        {type === 'team' && '등록된 팀이 없어요'}
        {type === 'cheer' && '아직 응원이 없어요'}
        {type === 'player' && '등록된 선수가 없어요'}
      </CustomText>
      <CustomText style={{color: '#5b5b5b'}}>
        {type === 'feed' && '가장 먼저 게시글을 작성해보세요'}
        {type === 'comment' && '가장 먼저 댓글을 작성해보세요'}
        {type === 'notification' && '커뮤니티에 가입하여 팬들과 소통해보세요'}
        {type === 'cheer' && '가장 먼저 응원을 남겨보세요'}
      </CustomText>
    </View>
  );
};

export default ListEmpty;
