import {Community} from 'apis/community/types';
import {Vote as VoteType} from 'apis/vote/types';
import CustomText from 'components/common/CustomText';
import Vote from 'components/post/Vote';
import React from 'react';
import {View} from 'react-native';

interface HotVoteProps {
  community: Community;
  vote: VoteType | null | undefined;
}

const HotVote = ({community, vote}: HotVoteProps) => {
  return (
    <View className="mx-[14] mt-3">
      <CustomText className="text-lg mb-2" fontWeight="500">
        지금 핫한 투표
      </CustomText>
      {vote ? (
        <View className="bg-white px-1 rounded-lg border border-[#eeeeee] shadow-sm shadow-gray-100">
          <Vote vote={vote} community={community} />
        </View>
      ) : (
        <View className="h-[80] justify-center items-center">
          <CustomText className="text-slate-700">
            투표를 직접 만들어보시는 건 어떤가요?
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default HotVote;
