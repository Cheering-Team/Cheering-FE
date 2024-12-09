import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatRoom} from 'apis/chat/types';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChevronLeftSvg from 'assets/images/chevron-left.svg';
import OfficialSvg from 'assets/images/official.svg';
import PersonSvg from 'assets/images/person-gray.svg';
import ChevronRightSvg from 'assets/images/chevron-right-gray.svg';
import DrawerSvg from 'assets/images/drawer.svg';
import MegaphoneSvg from 'assets/images/megaphone.svg';
import ChevronDownGraySvg from 'assets/images/chevron-down-gray.svg';
import ChevronUpGraySvg from 'assets/images/chevron-up-gray.svg';

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

  // const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

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
          <ChevronLeftSvg width={35} height={35} />
        </Pressable>
        <View style={{marginLeft: 10, flex: 1, marginTop: 3}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText fontWeight="600" style={{fontSize: 17, marginRight: 3}}>
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
            <PersonSvg width={12} height={12} />
            <CustomText className="color-[#626262] ml-[3] text-[15px]">
              {participantCount}
            </CustomText>
            <View
              style={{
                width: 1,
                height: 9,
                backgroundColor: '#626262',
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
              }}>
              <CustomText
                style={{color: '#626262', marginRight: 2, fontSize: 15}}>
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
      {/* {chatRoom?.description !== '' && (
        <Pressable
          onPress={() => setIsDescriptionOpen(prev => !prev)}
          className="mt-[5] mx-[10] rounded-[10px] bg-white py-[10] px-[15] flex-row border border-[#eeeeee]"
          style={{
            shadowColor: '#000000',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
          }}>
          <MegaphoneSvg width={20} height={20} style={{marginTop: 2}} />
          <CustomText
            className="flex-1 text-[#404040] text-base mx-[10]"
            fontWeight="400"
            numberOfLines={isDescriptionOpen ? undefined : 2}>
            {chatRoom?.description}
          </CustomText>
          <View>
            {isDescriptionOpen ? (
              <ChevronUpGraySvg width={18} height={18} style={{marginTop: 2}} />
            ) : (
              <ChevronDownGraySvg
                width={18}
                height={18}
                style={{marginTop: 2}}
              />
            )}
          </View>
        </Pressable>
      )} */}
    </View>
  );
};

export default ChatRoomHeader;
