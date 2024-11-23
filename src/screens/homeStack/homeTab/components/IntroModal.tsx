import CustomText from 'components/common/CustomText';
import {debounce} from 'lodash';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import SearchSvg from 'assets/images/search-sm.svg';
import {useSearchTeams} from 'apis/team/useTeams';
import FastImage from 'react-native-fast-image';
import CheckSvg from 'assets/images/check-black.svg';
import {useJoinCommunities} from 'apis/community/useCommunities';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

interface IntroModalProps {
  setIsRegisterOpen: Dispatch<SetStateAction<boolean>>;
  setIsIntroOpen: Dispatch<SetStateAction<boolean>>;
}

const IntroModal = ({setIsRegisterOpen, setIsIntroOpen}: IntroModalProps) => {
  const [step, setStep] = useState<'select' | 'complete'>('select');
  const [name, setName] = useState('');
  const debouncedSetName = debounce(setName, 300);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  const {data: teams, isLoading} = useSearchTeams(name, true);
  const {mutateAsync: joinCommunities, isPending} = useJoinCommunities();

  const handleJoincommunities = async () => {
    await joinCommunities({communityIds: selectedId});
    setStep('complete');
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="none"
        visible={step === 'select' || step === 'complete'}>
        <SafeAreaView className="bg-black/60 w-full h-full justify-center items-center">
          {step === 'select' && (
            <>
              <View
                className="w-[90%] h-[90%] bg-white rounded-2xl border border-gray-300 items-center p-3"
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 3, height: 3},
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                }}>
                <CustomText type="titleCenter" className="mb-1 text-2xl">
                  응원하는 팀을 알려주세요!
                </CustomText>
                <Pressable
                  onPress={() => {
                    setIsIntroOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="py-1 px-3 border border-gray-300 rounded-2xl">
                  <CustomText className="text-gray-500" fontWeight="600">
                    혹시 응원하는 팀이 등록되어 있지 않나요?
                  </CustomText>
                </Pressable>

                <View
                  className="bg-gray-100 flex-row px-3 rounded-2xl items-center my-3"
                  style={{paddingVertical: Platform.OS === 'ios' ? 7 : 3}}>
                  <SearchSvg width={17} height={17} />
                  <TextInput
                    className="flex-1 p-0 m-0 ml-[6]"
                    placeholder="팀 검색"
                    onChangeText={debouncedSetName}
                    style={{
                      fontFamily: 'Pretendard-Regular',
                      paddingBottom: 1,
                      fontSize: 16,
                      includeFontPadding: false,
                    }}
                  />
                </View>
                <FlatList
                  style={{width: '100%', marginBottom: 6}}
                  numColumns={2}
                  data={
                    teams
                      ? [
                          ...teams,
                          ...new Array(teams.length % 2).fill({id: null}),
                        ]
                      : []
                  }
                  renderItem={({item}) => {
                    if (item.id == null) {
                      return <View className="flex-1" />;
                    }
                    return (
                      <Pressable
                        onPress={() =>
                          setSelectedId(prev => {
                            if (prev.includes(item.id)) {
                              return prev.filter(id => id !== item.id);
                            } else {
                              return [...prev, item.id];
                            }
                          })
                        }
                        className="items-center rounded-lg overflow-hidden border my-1 mx-1 flex-1"
                        style={{
                          borderColor: item.color,
                          opacity: selectedId.includes(item.id) ? 0.5 : 1,
                        }}>
                        <View
                          className="w-full items-center p-1"
                          style={{backgroundColor: item.color}}>
                          <FastImage
                            source={{uri: item.image}}
                            className="w-[60] h-[60]"
                          />
                        </View>
                        <CustomText
                          className="text-xs mt-1"
                          fontWeight="500">{`${item.sportName} / ${item.leagueName}`}</CustomText>
                        <CustomText
                          className="text-[15px] mb-2"
                          fontWeight="700">
                          {item.shortName}
                        </CustomText>
                        <View className="absolute w-[20] h-[20] right-2 top-2 rounded-[5px] bg-white/80 items-center justify-center">
                          {selectedId.includes(item.id) && (
                            <CheckSvg width={16} height={16} />
                          )}
                        </View>
                      </Pressable>
                    );
                  }}
                  ListEmptyComponent={
                    isLoading ? (
                      <View className="h-[300] justify-center">
                        <ActivityIndicator size={'small'} />
                      </View>
                    ) : (
                      <ListEmpty type="team" />
                    )
                  }
                />
                <CustomText className="mb-1 text-gray-600">{`${selectedId.length}개 선택됨`}</CustomText>
                <Pressable
                  onPress={handleJoincommunities}
                  disabled={selectedId.length === 0 || isPending}
                  className="h-[45] w-full items-center justify-center rounded-lg"
                  style={{
                    backgroundColor:
                      selectedId.length === 0 ? '#cccccc' : 'black',
                  }}>
                  {isPending ? (
                    <ActivityIndicator />
                  ) : (
                    <CustomText
                      className="text-white text-[17px]"
                      fontWeight="500">
                      완료
                    </CustomText>
                  )}
                </Pressable>
              </View>
              <View className="w-[90%]">
                <Pressable
                  onPress={() => setIsIntroOpen(false)}
                  className="self-end mr-3 py-2">
                  <CustomText className="text-white" fontWeight="600">
                    바로 시작하기
                  </CustomText>
                </Pressable>
              </View>
            </>
          )}
          {step === 'complete' && (
            <View className="w-[90%] bg-white rounded-2xl border border-gray-300 items-center p-3">
              <CustomText
                type="titleCenter"
                className="text-2xl mb-[6] text-slate-800">
                환영합니다
              </CustomText>
              <CustomText
                fontWeight="500"
                className="text-[17px] text-slate-600 mb-1">
                응원하는 팀의 커뮤니티에 참여했어요
              </CustomText>
              <CustomText
                fontWeight="500"
                className="text-[17px] text-slate-600 mb-5">
                활동 전, 커뮤니티에서 닉네임을 변경해 주세요
              </CustomText>
              <Pressable
                onPress={() => setIsIntroOpen(false)}
                className="h-[45] w-[95%] items-center justify-center rounded-xl bg-black">
                <CustomText className="text-white text-[17px]" fontWeight="500">
                  시작하기
                </CustomText>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default IntroModal;
