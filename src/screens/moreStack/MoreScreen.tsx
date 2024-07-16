import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {getUserInfo} from '../../apis/user';
import {Pressable, SafeAreaView, View} from 'react-native';
import CustomText from '../../components/CustomText';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import SettingSvg from '../../../assets/images/setting-svg.svg';

const MoreScreen = ({navigation}) => {
  const {data, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: getUserInfo,
  });

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 23, paddingVertical: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => navigation.navigate('MyProfile')}>
            <CustomText
              fontWeight="600"
              style={{fontSize: 20, marginRight: 4, paddingBottom: 1}}>
              {data.result.nickname}
            </CustomText>
            <ChevronRightSvg width={14} height={14} />
          </Pressable>
          <SettingSvg width={23} height={23} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoreScreen;
