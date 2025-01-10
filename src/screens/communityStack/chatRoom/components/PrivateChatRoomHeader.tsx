import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatRoom} from 'apis/chat/types';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeftSvg from 'assets/images/chevron-left.svg';
import {useGetMeetById} from 'apis/meet/useMeets';
import MatchInfo from 'components/common/MatchInfo';
import ChevronRightSvg from 'assets/images/chevron-right-gray.svg';

interface PrivateChatRoomHeader {
  chatRoom: ChatRoom;
}

const PrivateChatRoomHeader = ({chatRoom}: PrivateChatRoomHeader) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {data: meet} = useGetMeetById(chatRoom.meetId);

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        zIndex: 5,
        flex: 1,
      }}>
      <View
        className="flex-1"
        style={{
          height: insets.top + 45,
          paddingTop: insets.top,
          flexDirection: 'row',
          paddingHorizontal: 5,
          alignItems: 'center',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#f4f4f4',
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeftSvg width={25} height={25} />
        </Pressable>

        <View style={{marginLeft: 6, flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText fontWeight="600" style={{fontSize: 16}}>
              {meet?.title}
            </CustomText>
          </View>

          <View
            className="flex-row items-center mt-[2]"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CustomText className="color-[#757575] text-[13px]">
              {chatRoom.type === 'CONFIRM'
                ? '모임 단체대화'
                : '모임장과 1:1 대화'}
            </CustomText>
            {chatRoom.type === 'CONFIRM' && (
              <>
                <View
                  style={{
                    width: 1,
                    height: 12,
                    backgroundColor: '#cccccc',
                    marginHorizontal: 4,
                  }}
                />
                <Pressable
                  onPress={() => {
                    if (chatRoom.community) {
                      navigation.navigate('Community', {
                        communityId: chatRoom.community?.id,
                      });
                    }
                  }}
                  className="flex-row items-center">
                  <CustomText
                    style={{color: '#757575', marginRight: 2, fontSize: 13}}>
                    모임으로 가기
                  </CustomText>
                  <ChevronRightSvg width={9} height={9} />
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
      {meet && (
        <View className="px-2 mt-1">
          <MatchInfo match={meet.match} height={55} radius={3} />
          <View className="px-2 py-[6] border border-slate-200 bg-white mt-1 rounded-md shadow-sm shadow-gray-100">
            <View className="flex-row">
              <View className="flex-1 flex-row items-center">
                <CustomText
                  className="mr-2 text-slate-500 text-[13px]"
                  fontWeight="500">
                  모집 인원
                </CustomText>
                <CustomText className="text-[14px]">{`${meet.currentCount}/${meet.max}`}</CustomText>
              </View>
              <View className="flex-1 flex-row items-center">
                <CustomText
                  className="mr-2 text-slate-500  text-[13px]"
                  fontWeight="500">
                  선호 성별
                </CustomText>
                <CustomText className="text-[14px]">{`${meet.gender === 'ANY' ? '성별 무관' : '남자만'}`}</CustomText>
              </View>
            </View>
            <View className="flex-row mt-[5]">
              <View className="flex-1 flex-row items-center">
                <CustomText
                  className="mr-2 text-slate-500 text-[13px]"
                  fontWeight="500">
                  선호 나이
                </CustomText>
                <CustomText className="text-[14px]">{`${meet.minAge}~${meet.maxAge}세`}</CustomText>
              </View>
              {meet.type === 'BOOKING' ? (
                <View className="flex-1 flex-row items-center">
                  <CustomText
                    className="mr-2 text-slate-500 text-[13px]"
                    fontWeight="500">
                    선호 위치
                  </CustomText>
                  <CustomText className="text-[14px]">{meet.place}</CustomText>
                </View>
              ) : (
                <View className="flex-1 flex-row items-center">
                  <CustomText
                    className="mr-2 text-slate-500 text-[13px]"
                    fontWeight="500">
                    티켓 여부
                  </CustomText>
                  <CustomText className="text-[14px]">{`${meet.hasTicket ? '있음' : '없음'}`}</CustomText>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PrivateChatRoomHeader;
