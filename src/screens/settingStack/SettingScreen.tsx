import {Pressable, SafeAreaView} from 'react-native';
import CustomText from '../../components/CustomText';

const SettingScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <Pressable
        style={{padding: 10}}
        onPress={() => navigation.navigate('SignOut')}>
        <CustomText>로그아웃</CustomText>
      </Pressable>
    </SafeAreaView>
  );
};

export default SettingScreen;
