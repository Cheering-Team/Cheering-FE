import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import React, {useEffect, useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatMonthDaySlash, formatRemainingTime} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import UpSvg from 'assets/images/chevron-up-gray.svg';
import {VoteOption, Vote as VoteType} from 'apis/vote/types';
import {useVote} from 'apis/vote/useVotes';
import {Post} from 'apis/post/types';
import RankingSvg from 'assets/images/fullscreen-black.svg';
import {WINDOW_WIDTH} from 'constants/dimension';

interface VoteProps {
  vote: VoteType;
  post: Post;
}

const Vote = ({vote, post}: VoteProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [isOpen, setIsOpen] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [first, setFirst] = useState<VoteOption>();

  const {mutate: postVote} = useVote(post.id);

  const handleVote = (voteOptionId: number) => {
    postVote({voteOptionId});
  };

  useEffect(() => {
    setFirst([...vote.options].sort((a, b) => b.percent - a.percent)[0]);
  }, [vote]);

  return (
    <View className="my-2 py-1 px-1 rounded-x items-start">
      <Pressable
        className="flex-row items-center pr-3"
        onPress={() => setIsRanking(true)}>
        <CustomText className="text-[17px] my-1 ml-2 flex-1" fontWeight="500">
          {vote.title}
        </CustomText>
        <RankingSvg width={20} height={20} />
      </Pressable>
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
      <View className="w-full bg-white">
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
                    backgroundColor: `${post.community.color}28`,
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
              {vote.isVoted && option.isVoted && (
                <Pressable
                  className="mr-3 px-3 py-1"
                  onPress={() => setIsRanking(true)}>
                  <CustomText
                    fontWeight="600"
                    className="text-base"
                    style={{color: post.community.color}}>
                    결과보기
                  </CustomText>
                </Pressable>
              )}
              {vote.isVoted && (
                <CustomText
                  fontWeight={
                    option.isVoted ? '500' : '400'
                  }>{`${option.percent}%`}</CustomText>
              )}
            </View>
          </Pressable>
        ))}

        {vote.options.length > 5 &&
          (!isOpen ? (
            <Pressable
              className="justify-center h-[31] border border-slate-300 my-1 flex-1 mx-1 flex-row items-center pr-2 rounded-[5px]"
              onPress={() => {
                setIsOpen(true);
              }}>
              <DownSvg width={13} height={13} />
              <CustomText
                className="text-slate-500 text-base ml-1"
                fontWeight="500">
                항목 전체보기
              </CustomText>
            </Pressable>
          ) : (
            <Pressable
              className="justify-center h-[31] border border-slate-300 my-1 flex-1 mx-1 flex-row items-center pr-2 rounded-[5px]"
              onPress={() => {
                setIsOpen(false);
              }}>
              <UpSvg width={13} height={13} />
              <CustomText
                className="text-slate-500 text-base ml-1"
                fontWeight="500">
                닫기
              </CustomText>
            </Pressable>
          ))}
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
      {isRanking && (
        <Modal transparent={true} animationType="fade">
          <Pressable
            className="w-full h-full justify-center items-center bg-black/90"
            onPress={() => setIsRanking(false)}>
            <Pressable
              onPress={() => {
                //
              }}
              className="flex-row"
              style={{
                width: WINDOW_WIDTH,
                height: WINDOW_WIDTH,
                backgroundColor: '#f7f7f7',
              }}>
              <View className="w-[30%]">
                <FastImage
                  source={{uri: first?.image}}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View className="py-3 px-4 flex-1">
                <CustomText
                  className="text-gray-900 text-2xl"
                  type="titleCenter"
                  numberOfLines={2}>
                  {vote.title}
                </CustomText>
                <View className="flex-1">
                  {[...vote.options]
                    .sort((a, b) => b.percent - a.percent)
                    .slice(0, 5)
                    .map((option, index) => (
                      <View className="flex-row items-center mb-2">
                        <FastImage
                          source={{uri: option.image}}
                          className="w-[25] h-[25] rounded-full border border-gray-50 mr-1"
                        />
                        <CustomText
                          className="text-[17px] text-gray-900"
                          fontWeight="700">
                          {option.name}
                        </CustomText>
                        <View className="flex-1 ml-2">
                          <View
                            className="justify-center"
                            style={{
                              width: `${option.percent}%`,
                              height: 35,
                              backgroundColor:
                                index === 0 ? post.community.color : '#959595',
                            }}>
                            <CustomText
                              className="self-end text-lg text-white mr-1"
                              fontWeight="700">{`${option.percent}%`}</CustomText>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
                <FastImage
                  source={require('assets/images/logo-store.png')}
                  className="w-[150] h-6 self-end"
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default Vote;
