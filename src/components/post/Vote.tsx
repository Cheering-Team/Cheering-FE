import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatMonthDaySlash, formatRemainingTime} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import UpSvg from 'assets/images/chevron-up-gray.svg';
import {Vote as VoteType} from 'apis/vote/types';
import {useVote} from 'apis/vote/useVotes';
import {Post} from 'apis/post/types';

interface VoteProps {
  vote: VoteType;
  post: Post;
}

const Vote = ({vote, post}: VoteProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [isOpen, setIsOpen] = useState(false);

  const {mutate: postVote} = useVote(post.id);

  const handleVote = (voteOptionId: number) => {
    postVote({voteOptionId});
  };

  return (
    <View className="my-2 py-1 px-1 rounded-x items-start">
      <CustomText className="text-[17px] my-1 ml-2" fontWeight="500">
        {vote.title}
      </CustomText>
      {vote.match && (
        <Pressable
          onPress={() =>
            navigation.navigate('CommunityStack', {
              screen: 'Match',
              params: {
                matchId: vote.match.id,
                community: post.community,
              },
            })
          }
          className="flex-row items-center border border-gray-200 rounded-lg ml-2 px-1 my-1 py-[2]">
          <CustomText className="text-[15px] mr-[3]">
            {`${formatMonthDaySlash(vote.match.time)} vs ${vote.match.shortName}`}
          </CustomText>
          <FastImage
            source={{uri: vote.match.opponentImage}}
            className="w-6 h-6"
          />
        </Pressable>
      )}
      <View className="w-full">
        {vote.options.slice(0, isOpen ? 20 : 5).map(option => (
          <Pressable
            key={option.id}
            onPress={() => {
              if (!vote.isVoted) {
                handleVote(option.id);
                setIsOpen(true);
              } else if (option.isVoted) {
                handleVote(option.id);
              }
            }}
            className="flex-row items-center my-1">
            <View
              className="w-full relative bg-gray-100 h-[40] rounded-full overflow-hidden"
              style={{
                borderWidth: 1,
                borderColor: option.isVoted ? post.community.color : 'white',
              }}>
              {vote.isVoted && (
                <View
                  style={{
                    width: `${option.percent}%`,
                    backgroundColor: `${post.community.color}30`,
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                  }}
                />
              )}
            </View>
            <View className="absolute z-10 flex-row items-center pl-2 pr-3 w-full">
              {option.communityId && (
                <FastImage
                  source={{uri: option.image}}
                  className="w-7 h-7 rounded-full border border-gray-50 bg-white"
                />
              )}
              <CustomText
                className="text-[17px] ml-[6] flex-1"
                fontWeight={option.isVoted ? '500' : '400'}>
                {option.name}
              </CustomText>
              {vote.isVoted && (
                <CustomText
                  fontWeight={
                    option.isVoted ? '500' : '400'
                  }>{`${option.percent}%`}</CustomText>
              )}
            </View>
          </Pressable>
        ))}

        <View className="flex-row">
          {vote.options.length > 5 &&
            (!isOpen ? (
              <Pressable
                className="justify-center h-[35] border border-slate-300 my-1 flex-1 mx-1 flex-row items-center pr-2 rounded-md"
                onPress={() => setIsOpen(true)}>
                <DownSvg width={13} height={13} />
                <CustomText
                  className="text-slate-500 text-base ml-1"
                  fontWeight="500">
                  항목 전체보기
                </CustomText>
              </Pressable>
            ) : (
              <Pressable
                className="justify-center h-[35] border border-slate-300 my-1 flex-1 mx-1 flex-row items-center pr-2 rounded-md"
                onPress={() => setIsOpen(false)}>
                <UpSvg width={13} height={13} />
                <CustomText
                  className="text-slate-500 text-base ml-1"
                  fontWeight="500">
                  닫기
                </CustomText>
              </Pressable>
            ))}

          {vote.isVoted && (
            <Pressable
              className="justify-center h-[35] my-1 mx-1 flex-1 flex-row items-center pr-2 rounded-md"
              style={{backgroundColor: post.community.color}}>
              <CustomText
                className="text-white text-base ml-1"
                fontWeight="500">
                결과보기
              </CustomText>
            </Pressable>
          )}
        </View>

        {/* {isOpen && (
          <View className="flex-row">
            {vote.isVoted && (
              <Pressable
                className="justify-center h-[32] my-1 mr-1 flex-1 flex-row items-center pr-2 rounded-md"
                style={{backgroundColor: post.community.color}}>
                <CustomText
                  className="text-white text-base ml-1"
                  fontWeight="500">
                  순위보기
                </CustomText>
              </Pressable>
            )}
            <Pressable
              className="justify-center h-[32] border border-slate-300 my-1 ml-1 flex-1 flex-row items-center pr-2 rounded-md"
              onPress={() => setIsOpen(false)}>
              <UpSvg width={13} height={13} />
              <CustomText
                className="text-slate-500 text-base ml-1"
                fontWeight="500">
                닫기
              </CustomText>
            </Pressable>
          </View>
        )} */}
      </View>
      <View className="flex-row mt-[2] mx-3">
        <CustomText
          className="text-gray-400 text-[13px] flex-1"
          fontWeight="600">
          {formatRemainingTime(vote.endTime)}
        </CustomText>
        <CustomText className="text-gray-400 text-[13px]" fontWeight="600">
          {`${vote.totalCount}명 참여`}
        </CustomText>
      </View>
    </View>
  );
};

export default Vote;
