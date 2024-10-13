import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useGetPlayers} from 'apis/player/usePlayers';
import {
  useGetPlayerAccountInfo,
  useRegisterPlayerAccount,
} from 'apis/user/useUsers';
import Avatar from 'components/common/Avatar';
import CustomBottomSheetTextInput from 'components/common/CustomBottomSheetTextInput';
import CustomButton from 'components/common/CustomButton';
import CustomText from 'components/common/CustomText';
import StackHeader from 'components/common/StackHeader';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showBottomToast} from 'utils/toast';

const PlayerAccountScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [playerId, setPlayerId] = useState(0);
  const [phone, setPhone] = useState('');

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => [200 + insets.bottom], [insets.bottom]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const {data: playersData, refetch} = useGetPlayers(name, false);
  const {data: playerAccountData} = useGetPlayerAccountInfo(playerId);
  const {mutateAsync: registerPlayerAccount} = useRegisterPlayerAccount();

  const handleRegisterPlayerAccount = async () => {
    const data = await registerPlayerAccount({playerId, phone});

    if (data.message === '선수 계정을 등록하였습니다.') {
      bottomSheetModalRef.current?.close();
      showBottomToast(insets.bottom + 20, data.message);
    }

    setPhone('');
  };

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="선수 계정 관리" type="back" />
      <View className="flex-row items-center m-2">
        <TextInput
          placeholder="선수 검색"
          className="flex-1 h-10 border border-gray-300 rounded-lg p-2"
          value={name}
          onChangeText={setName}
        />
        <Pressable
          className="bg-black justify-center rounded-lg p-2 ml-2"
          onPress={() => refetch()}>
          <CustomText className="text-white" fontWeight="500">
            선수 검색
          </CustomText>
        </Pressable>
      </View>
      <FlatList
        data={playersData?.result}
        renderItem={({item}) => (
          <Pressable
            className="flex-row items-center p-2"
            onPress={() => {
              bottomSheetModalRef.current?.present();
              setPlayerId(item.id);
            }}>
            <Avatar uri={item.image} size={35} />
            <CustomText className="text-base ml-2">
              {item.koreanName}
            </CustomText>
          </Pressable>
        )}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior="restore"
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize">
        <BottomSheetView className="flex-1">
          <View className="p-3">
            {playerAccountData?.message ===
            '선수 계정이 등록되어있지않습니다.' ? (
              <>
                <CustomBottomSheetTextInput
                  label="휴대폰 번호"
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <CustomButton
                  text="신청하기"
                  type="normal"
                  onPress={handleRegisterPlayerAccount}
                />
              </>
            ) : (
              <>
                <CustomBottomSheetTextInput
                  label="휴대폰 번호"
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <CustomButton
                  text="비밀번호 재발급"
                  type="normal"
                  onPress={handleRegisterPlayerAccount}
                />
              </>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default PlayerAccountScreen;
