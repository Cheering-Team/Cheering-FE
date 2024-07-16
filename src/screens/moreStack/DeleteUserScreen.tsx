import React, {useContext, useState} from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/CustomText';
import BackSvg from '../../../assets/images/arrow-left.svg';
import CustomButton from '../../components/CustomButton';
import CheckSvg from '../../../assets/images/check-white.svg';
import {useMutation} from '@tanstack/react-query';
import {deleteUser} from '../../apis/user';
import {AuthContext} from '../../navigations/AuthSwitch';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DeleteUserScreen = ({navigation}) => {
  const signOut = useContext(AuthContext)?.signOut;
  const insets = useSafeAreaInsets();
  const [isAgree, setIsAgree] = useState(false);

  const mutation = useMutation({mutationFn: deleteUser});

  const handleDeleteUser = async () => {
    const data = await mutation.mutateAsync();

    if (data.message === '회원탈퇴되었습니다.') {
      signOut?.();

      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '회원 탈퇴되었습니다.',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="600" style={{fontSize: 20}}>
          회원탈퇴
        </CustomText>
        <View style={{width: 32, height: 32}} />
      </View>
      <View style={{padding: 15, flex: 1}}>
        <CustomText fontWeight="500" style={{fontSize: 19, marginBottom: 10}}>
          회원탈퇴 유의사항
        </CustomText>
        <CustomText style={{fontSize: 17, marginBottom: 5}}>
          - 회원탈퇴 시, 가입된 모든 커뮤니티에서 자동으로 탈퇴됩니다.
        </CustomText>
        <CustomText style={{fontSize: 17}}>
          - 모든 커뮤니티에서의 활동들이 삭제됩니다.
        </CustomText>
      </View>
      <View style={{padding: 15}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Pressable
            style={
              isAgree
                ? {
                    width: 22,
                    height: 22,
                    backgroundColor: '#6abe5b',
                    borderRadius: 5,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                : {
                    width: 22,
                    height: 22,
                    borderWidth: 2,
                    borderColor: '#d3d3d3',
                    borderRadius: 5,
                    marginRight: 10,
                  }
            }
            onPress={() => setIsAgree(prev => !prev)}>
            {isAgree && <CheckSvg width={13} height={13} />}
          </Pressable>
          <CustomText style={{fontSize: 17}}>
            위 유의사항을 모두 확인하였습니다.
          </CustomText>
        </View>
        <CustomButton
          type="normal"
          text="계정 삭제하기"
          disabled={!isAgree}
          onPress={handleDeleteUser}
        />
      </View>
    </SafeAreaView>
  );
};

export default DeleteUserScreen;
