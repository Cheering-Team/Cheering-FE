import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  formatDate,
  formatMonthDaySlash,
  formatRemainingTime,
} from 'utils/format';
import DownSvg from 'assets/images/chevron-down-gray.svg';
import UpSvg from 'assets/images/chevron-up-gray.svg';
import {VoteOption, Vote as VoteType} from 'apis/vote/types';
import {useVote} from 'apis/vote/useVotes';
import {Post} from 'apis/post/types';
import RankingSvg from 'assets/images/fullscreen-black.svg';
import {WINDOW_WIDTH} from 'constants/dimension';
import LinearGradient from 'react-native-linear-gradient';
import DownloadSvg from 'assets/images/download.svg';
import ShareSvg from 'assets/images/share.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {captureRef} from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {showBottomToast, showTopToast} from 'utils/toast';
import Toast from 'react-native-toast-message';
import {queryClient, toastConfig} from '../../../App';
import Share from 'react-native-share';
import {voteKeys} from 'apis/vote/queries';

interface VoteProps {
  vote: VoteType;
  post: Post;
}

const Vote = ({vote, post}: VoteProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  const viewRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [first, setFirst] = useState<VoteOption | null>();

  const {mutateAsync: postVote} = useVote(post.id);

  const handleVote = async (voteOptionId: number) => {
    try {
      await postVote({voteOptionId});
    } catch (error: any) {
      if (error.code === 2009) {
        showTopToast({type: 'fail', message: '이미 마감된 투표입니다'});
        queryClient.invalidateQueries({queryKey: voteKeys.detail(post.id)});
      }
    }
  };

  const hasAndroidPermission = async () => {
    const getCheckPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };
    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Number(Platform.Version) >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  };

  const captureView = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    try {
      const uri = await captureRef(viewRef, {
        format: 'png', // 이미지 포맷 (png, jpg 가능)
        quality: 0.8, // 품질 (0~1)
      });
      CameraRoll.saveAsset(uri, {type: 'photo'});
      showBottomToast({message: '저장 완료'});
    } catch (error) {
      console.error('Error capturing view:', error);
    }
  };

  const shareRanking = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png', // 이미지 포맷 (png, jpg 가능)
        quality: 0.8, // 품질 (0~1)
      });

      await Share.open({
        title: '공유하기',
        url: `file://${uri}`,
        type: 'image/png',
        message: vote.title,
      });
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    setFirst([...vote.options].sort((a, b) => b.percent - a.percent)[0]);
  }, [vote]);

  return (
    <View className="my-2 py-1 px-1 rounded-x items-start">
      <View className="flex-row items-center pr-3">
        <CustomText className="text-[17px] my-1 ml-2 flex-1" fontWeight="500">
          {vote.title}
        </CustomText>
        <Pressable onPress={() => setIsRanking(true)} className="pl-2 py-1">
          <RankingSvg width={20} height={20} />
        </Pressable>
      </View>
      {vote.match && (
        <Pressable
          onPress={() =>
            navigation.navigate('CommunityStack', {
              screen: 'Match',
              params: {
                matchId: vote.match.id,
                communityId: post.community.id,
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
        {vote.options.slice(0, isOpen ? 20 : 5).map((option, index) => (
          <Pressable
            key={option.id}
            onPress={() => {
              if (!vote.isClosed) {
                if (!vote.isVoted) {
                  handleVote(option.id);
                  setIsOpen(true);
                } else if (option.isVoted) {
                  handleVote(option.id);
                }
              }
            }}
            className="flex-row items-center my-1">
            <View
              className="w-full relative bg-gray-100 h-[40] rounded-full overflow-hidden"
              style={{
                borderWidth: 1,
                borderColor: option.isVoted ? post.community.color : 'white',
              }}>
              {(vote.isVoted || vote.isClosed) && (
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
                  style={{opacity: vote.isClosed ? 0.5 : 1}}
                  className="w-7 h-7 rounded-full border border-gray-50 bg-white"
                />
              )}
              <CustomText
                className="text-[17px] ml-[6] flex-1"
                fontWeight={option.isVoted ? '500' : '400'}
                style={{opacity: vote.isClosed ? 0.5 : 1}}>
                {option.name}
              </CustomText>
              {!vote.isClosed && vote.isVoted && option.isVoted && (
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
              {vote.isClosed && index === 0 && (
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
              {(vote.isVoted || vote.isClosed) && (
                <CustomText
                  style={{opacity: vote.isClosed ? 0.5 : 1}}
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
              className="justify-center py-1 border border-slate-300 my-1 mx-1 flex-row items-center pr-2 rounded-[5px]"
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
              className="justify-center py-1 border border-slate-300 my-1 mx-1 flex-row items-center pr-2 rounded-[5px]"
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
              ref={viewRef}
              onPress={() => {
                //
              }}
              className="flex-row"
              style={{
                width: WINDOW_WIDTH,
                height: WINDOW_WIDTH,
                backgroundColor: '#f7f7f7',
              }}>
              <FastImage
                source={{uri: first?.backgroundImage || first?.image}}
                className="w-[35%] h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={[
                  '#f0f0f000',
                  '#f0f0f010',
                  '#f0f0f010',
                  '#f0f0f010',
                  '#f0f0f0ff',
                  '#f0f0f0ff',
                  '#f0f0f0',
                ]}
                start={{x: 0, y: 1}}
                style={{
                  ...StyleSheet.absoluteFillObject,
                }}
              />
              <View
                className="pt-3 absolute w-full h-full"
                style={{paddingLeft: first?.image ? WINDOW_WIDTH * 0.33 : 16}}>
                <CustomText
                  className="text-gray-900 text-[18px] leading-5 mr-4"
                  fontWeight="900"
                  type="titleCenter"
                  numberOfLines={1}>
                  {vote.title}
                </CustomText>
                <View className="flex-row justify-between mb-1 mr-4">
                  <CustomText
                    className="text-xs text-gray-600"
                    fontWeight="300">{`${vote.totalCount}명 참여`}</CustomText>
                  <CustomText
                    className="text-xs text-gray-600"
                    fontWeight="300">{`${formatDate(new Date().toISOString())} 기준`}</CustomText>
                </View>
                {vote.match && (
                  <View className="flex-row items-center mb-[6] mr-4">
                    <CustomText
                      className="text-gray-600 text-[13px]"
                      fontWeight="600">
                      {`${formatMonthDaySlash(vote.match.time)} vs ${vote.match.shortName}`}
                    </CustomText>
                    <FastImage
                      source={{uri: vote.match.opponentImage}}
                      className="w-5 h-5 ml-[2]"
                    />
                  </View>
                )}

                {first && (
                  <View className="flex-1 mr-4">
                    {[...vote.options]
                      .filter(option => option.percent)
                      .sort((a, b) => b.percent - a.percent)
                      .slice(0, 5)
                      .map(option => (
                        <View className="mb-[6]" key={option.id}>
                          <CustomText
                            numberOfLines={2}
                            className="mb-[1]"
                            fontWeight={
                              option.percent >= first.percent ? '700' : '400'
                            }
                            style={{
                              color:
                                option.percent >= first.percent
                                  ? '#303236'
                                  : 'gray',
                            }}>
                            {option.name}
                          </CustomText>
                          <View className="flex-row items-center">
                            <View
                              className="justify-center rounded-[1px]"
                              style={{
                                width: `${option.percent}%`,
                                height: 30,
                                backgroundColor:
                                  option.percent >= first?.percent
                                    ? post.community.color
                                    : '#959595',
                              }}>
                              {option.percent >= 30 && (
                                <CustomText
                                  className="self-end text-base text-white mr-1"
                                  fontWeight="700">{`${option.percent || 0}%`}</CustomText>
                              )}
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )}
                <View className="flex-row self-end items-center mr-1 mb-[2]">
                  <FastImage
                    source={require('assets/images/store.png')}
                    className="h-[10] w-[25]"
                    resizeMode="contain"
                  />
                  <View className="w-[1] h-[10] bg-slate-400 mx-1" />
                  <FastImage
                    source={require('assets/images/logo-korean-black.png')}
                    className="h-[10] w-[35]"
                    resizeMode="contain"
                  />
                  <View className="w-[1] h-[10] bg-slate-400 mx-1" />
                  <View className="flex-row items-center">
                    <FastImage
                      source={{uri: post.community.image}}
                      className="h-[11] w-[11] mr-[3]"
                      resizeMode="contain"
                    />
                    <CustomText fontWeight="600" className="text-[11px]">
                      {post.community.koreanName}
                    </CustomText>
                  </View>
                </View>
              </View>
            </Pressable>
            <View
              className="flex-row absolute"
              style={{bottom: insets.bottom + 40}}>
              <Pressable className="mr-3 items-center" onPress={captureView}>
                <View className="bg-white rounded-full p-[10]">
                  <DownloadSvg width={25} height={25} />
                </View>
                <CustomText className="text-white text-xs mt-2">
                  저장
                </CustomText>
              </Pressable>
              <Pressable className="ml-3 items-center" onPress={shareRanking}>
                <View className="bg-white rounded-full p-[10]">
                  <ShareSvg width={25} height={25} />
                </View>
                <CustomText className="text-white text-xs mt-2">
                  공유
                </CustomText>
              </Pressable>
            </View>
          </Pressable>
          <Toast config={toastConfig} />
        </Modal>
      )}
    </View>
  );
};

export default Vote;
