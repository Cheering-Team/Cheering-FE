import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, Pressable, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {getMyPlayers} from '../../apis/player';
import {useIsFocused} from '@react-navigation/native';
import ChevronDownSvg from '../../../assets/images/chevron-down-black-thin.svg';
import {CommonActions} from '@react-navigation/native';
import CustomText from '../../components/common/CustomText';
import Avatar from '../../components/common/Avatar';
import OptionModal, {
  closeModalHandle,
} from '../../components/common/OptionModal';

const MyPlayerScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const closeModalRef = useRef<closeModalHandle>(null);

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['my', 'players'],
    queryFn: getMyPlayers,
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <FlatList
        data={data.result}
        renderItem={({item, index}) => (
          <Pressable
            style={{
              flexDirection: 'row',
              paddingHorizontal: 17,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() =>
              navigation.navigate('CommunityStack', {
                screen: 'Community',
                params: {playerId: item.id},
              })
            }>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar uri={item.image} size={45} />
              <CustomText style={{fontSize: 16, marginLeft: 15}}>
                {item.koreanName}
              </CustomText>
            </View>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#ededed',
                paddingHorizontal: 11,
                paddingVertical: 6,
                borderRadius: 20,
              }}
              onPress={() => {
                setSelectedIdx(index);
                setIsModalOpen(true);
              }}>
              <Avatar
                uri={item.user.image}
                size={22}
                style={{marginRight: 7}}
              />
              <ChevronDownSvg width={13} height={13} />
            </Pressable>
          </Pressable>
        )}
        contentContainerStyle={{paddingTop: 10}}
        ListEmptyComponent={
          <View
            style={{
              height: Dimensions.get('window').height * 0.3 + 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CustomText
              fontWeight="600"
              style={{fontSize: 23, marginBottom: 5}}>
              아직 가입한 커뮤니티가 없어요
            </CustomText>
            <CustomText style={{color: '#5b5b5b'}}>
              좋아하는 선수를 찾아보세요
            </CustomText>
            <Pressable
              style={{marginTop: 10}}
              onPress={() =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'CategoryStack'}],
                  }),
                )
              }>
              <CustomText
                fontWeight="500"
                style={{color: '#58a04b', fontSize: 15}}>
                선수 찾기
              </CustomText>
            </Pressable>
          </View>
        }
      />
      <OptionModal
        ref={closeModalRef}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        option1Text="내 프로필"
        option1Press={() => {
          closeModalRef.current?.closeModal();
          navigation.navigate('CommunityStack', {
            screen: 'Profile',
            params: {playerUserId: data.result[selectedIdx].user.id},
          });
        }}
        option2Text="커뮤니티 탈퇴"
        option2color="#fe6363"
        option2Press={() => {
          closeModalRef.current?.closeModal();
          navigation.navigate('CommunityStack', {
            screen: 'DeletePlayerUser',
            params: {playerUserId: data.result[selectedIdx].user.id},
          });
        }}
      />
    </>
  );
};

export default MyPlayerScreen;
