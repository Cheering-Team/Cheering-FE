import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatRoom} from 'apis/chat/types';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {Dispatch, SetStateAction} from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeftSvg from 'assets/images/chevron-left.svg';
import OfficialSvg from 'assets/images/official.svg';
import PersonSvg from 'assets/images/person-gray.svg';
import ChevronRightSvg from 'assets/images/chevron-right-gray.svg';
import DrawerSvg from 'assets/images/drawer.svg';

interface ChatRoomHeaderProps {
  chatRoom: ChatRoom;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  participantCount: number;
}

const ChatRoomHeader = ({
  chatRoom,
  setIsDrawerOpen,
  participantCount,
}: ChatRoomHeaderProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        zIndex: 5,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f4',
      }}>
      <View
        className="justify-between flex-1"
        style={{
          height: insets.top + 55,
          paddingTop: insets.top,
          flexDirection: 'row',
          paddingHorizontal: 5,
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeftSvg width={30} height={30} />
        </Pressable>
        <View style={{marginLeft: 6, flex: 1, marginTop: 3}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText fontWeight="600" style={{fontSize: 16, marginRight: 3}}>
              {chatRoom?.name}
            </CustomText>
            {chatRoom.type === 'OFFICIAL' && (
              <OfficialSvg width={15} height={15} />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 2,
            }}>
            <PersonSvg width={11} height={11} />
            <CustomText className="color-[#626262] ml-[3] text-[14px]">
              {participantCount}
            </CustomText>
            <View
              style={{
                width: 1,
                height: 12,
                backgroundColor: '#d7d6d6',
                marginHorizontal: 4,
              }}
            />
            <Pressable
              onPress={() => {
                if (chatRoom.community) {
                  navigation.navigate('Community', {
                    communityId: chatRoom.community?.id,
                    initialIndex: 0,
                  });
                }
              }}>
              <CustomText
                style={{color: '#626262', marginRight: 2, fontSize: 14}}>
                {chatRoom.type === 'OFFICIAL'
                  ? '커뮤니티 바로가기'
                  : chatRoom.community?.koreanName}
              </CustomText>
            </Pressable>

            <ChevronRightSvg width={9} height={9} />
          </View>
        </View>

        {chatRoom.type === 'OFFICIAL' ? (
          <></>
        ) : (
          <Pressable onPress={() => setIsDrawerOpen(true)}>
            <DrawerSvg width={27} height={27} style={{marginRight: 5}} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ChatRoomHeader;
