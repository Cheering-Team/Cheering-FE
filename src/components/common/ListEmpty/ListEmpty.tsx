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
    | 'player'
    | 'chat'
    | 'myChat'
    | 'apply'
    | 'hot'
    | 'vote';
}

const ListEmpty = (props: ListEmptyProps) => {
  const {type = 'feed'} = props;
  return (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.2 + 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CustomText className="text-[19px] text-gray-800 mb-1" fontWeight="600">
        {type === 'feed' && '아직 게시글이 없어요'}
        {type === 'comment' && '아직 댓글이 없어요'}
        {type === 'notification' && '아직 알림이 없어요'}
        {type === 'block' && '차단한 계정이 없어요'}
        {type === 'team' && '등록된 팀이 없어요'}
        {type === 'cheer' && '아직 응원이 없어요'}
        {type === 'player' && '등록된 선수가 없어요'}
        {type === 'chat' && '채팅방이 없어요'}
        {type === 'apply' && '신청 내역이 없어요'}
        {type === 'hot' && '아직 인기 게시글이 없네요'}
        {type === 'myChat' && '아직 참여중인 채팅방이 없어요'}
        {type === 'vote' && '아직 투표가 없어요'}
      </CustomText>
      <CustomText className="text-[15px] text-gray-500">
        {type === 'feed' && '가장 먼저 글을 작성해보세요'}
        {type === 'comment' && '가장 먼저 댓글을 작성해보세요'}
        {type === 'notification' && '커뮤니티에 가입하여 팬들과 소통해보세요'}
        {type === 'cheer' && '가장 먼저 응원을 남겨보세요'}
        {type === 'chat' && '직접 채팅방을 만들어보세요'}
        {type === 'apply' && '지금 바로 신청해보세요'}
        {type === 'hot' && '직접 글을 작성해보세요'}
        {type === 'myChat' && '채팅방에서 함께 응원해보세요'}
        {type === 'vote' && '가장 먼저 글을 작성해보세요'}
      </CustomText>
    </View>
  );
};

export default ListEmpty;
