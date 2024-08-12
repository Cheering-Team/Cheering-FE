import React, {useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation} from '@tanstack/react-query';
import {deletePlayerUser} from '../../apis/player';
import Toast from 'react-native-toast-message';
import {Pressable, View} from 'react-native';
import BackSvg from '../../../assets/images/arrow-left.svg';
import CustomText from '../../components/common/CustomText';
import CheckBox from '../../components/common/CheckBox';
import CustomButton from '../../components/common/CustomButton';

const DeletePlayerUserScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;

  const insets = useSafeAreaInsets();
  const [isAgree, setIsAgree] = useState(false);

  const mutation = useMutation({mutationFn: deletePlayerUser});

  const handleDeleteUser = async () => {
    const data = await mutation.mutateAsync({playerUserId});

    if (data.message === '커뮤니티에서 탈퇴했습니다.') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '커뮤니티에서 탈퇴했습니다.',
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
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
          커뮤니티 탈퇴
        </CustomText>
        <View style={{width: 32, height: 32}} />
      </View>
      <View style={{padding: 15, flex: 1}}>
        <CustomText fontWeight="500" style={{fontSize: 19, marginBottom: 10}}>
          커뮤니티 탈퇴 유의사항
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
          <CheckBox
            isCheck={isAgree}
            onPress={() => setIsAgree(prev => !prev)}
          />
          <CustomText style={{fontSize: 17}}>
            위 유의사항을 모두 확인하였습니다.
          </CustomText>
        </View>
        <CustomButton
          type="normal"
          text="커뮤니티 탈퇴"
          disabled={!isAgree}
          onPress={handleDeleteUser}
        />
      </View>
    </SafeAreaView>
  );
};

export default DeletePlayerUserScreen;
