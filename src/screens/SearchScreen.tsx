import {
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CloseButtonSvg from '../../assets/images/close-black.svg';

import React from 'react';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import CameraSvg from '../../assets/images/camera-01.svg';
import TeamCard from '../components/TeamCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {getCommunitiesSearch, postCommunitiesUsers} from '../apis/community';
import ImagePicker from 'react-native-image-crop-picker';
import CustomText from '../components/CustomText';
import Toast from 'react-native-toast-message';
import {navigate} from '../navigations/RootNavigation';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface Community {
  id: number;
  name: string;
}

interface Image {
  uri: string;
  name: string | undefined;
  type: string;
}

type SearchScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Search'
>;

const SearchScreen = ({
  navigation,
}: {
  navigation: SearchScreenNavigationProp;
}) => {
  const [community, setCommunity] = React.useState<Community>({
    id: 0,
    name: '',
  });
  const [searchData, setSearchData] = React.useState(null);
  const [nickname, setNickname] = React.useState('');
  const [imageData, setImageData] = React.useState<Image>({
    uri: '',
    name: '',
    type: '',
  });

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(
    () => ['25%', Platform.OS === 'ios' ? '55%' : '60%'],
    [],
  );

  const handlePresentModalPress = React.useCallback(() => {
    setImageData({uri: '', name: '', type: ''});
    bottomSheetModalRef.current?.present();
  }, []);

  const searchCommunity = async (event: any) => {
    if (event.nativeEvent.text !== '') {
      const response = await getCommunitiesSearch({
        name: event.nativeEvent.text,
      });

      setSearchData(response.data);
    }
  };

  const handleSubmitNickname = async () => {
    const formData = new FormData();

    if (nickname === '') {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '닉네임을 입력해주세요',
      });

      return;
    }

    formData.append('nickname', nickname);

    if (imageData.uri !== '') {
      formData.append('image', imageData);
    }

    const response = await postCommunitiesUsers({id: community?.id}, formData);

    if (response.message === 'join community success') {
      Toast.show({
        type: 'default',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 30,
        text1: '성공적으로 가입되었습니다',
      });
      navigate('Community', {communityId: community.id});
    }
  };

  const handleImageUpload = async () => {
    const image = await ImagePicker.openPicker({
      cropperCircleOverlay: true,
      cropping: true,
      cropperChooseText: '확인',
      cropperCancelText: '취소',
      cropperToolbarTitle: '사진 선택',
    });

    setImageData({uri: image.path, name: image.filename, type: image.mime});
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <View style={styles.SearchSection}>
            <CloseButtonSvg
              width={33}
              height={33}
              onPress={() => navigation.goBack()}
            />
            <TextInput
              style={styles.SearchBar}
              placeholder="선수 또는 소속팀 검색"
              placeholderTextColor="#8a8a8a"
              onChange={searchCommunity}
            />
          </View>
          <FlatList
            data={searchData}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  if (item.isJoin === 'TRUE') {
                    navigation.navigate('Community', {communityId: item.id});
                  } else {
                    setCommunity({id: item.id, name: item.teamName});
                    handlePresentModalPress();
                  }
                }}>
                <TeamCard
                  team={item}
                  setCommunity={setCommunity}
                  handleModal={handlePresentModalPress}
                />
              </Pressable>
            )}
          />
          <BottomSheetModal
            backdropComponent={() => (
              <Pressable
                style={styles.ModalBackDrop}
                onPress={() => bottomSheetModalRef.current?.close()}
              />
            )}
            keyboardBlurBehavior="restore"
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            android_keyboardInputMode="adjustResize"
            keyboardBehavior={
              Platform.OS === 'android' ? 'fillParent' : 'interactive'
            }>
            <View
              style={[
                styles.ModalContainer,
                {paddingBottom: useSafeAreaInsets().bottom + 20},
              ]}>
              <CustomText style={styles.ModalName} fontWeight="600">
                {community?.name}
              </CustomText>
              <CustomText style={styles.ModalText}>
                커뮤니티 가입을 환영합니다
              </CustomText>
              <Pressable onPress={handleImageUpload}>
                <ImageBackground
                  source={
                    imageData.uri
                      ? {uri: imageData.uri}
                      : require('../../assets/images/green_background.png')
                  }
                  style={styles.ProfileInput}
                  imageStyle={{borderRadius: 100}}>
                  <CameraSvg width={30} height={30} />
                </ImageBackground>
              </Pressable>
              <CustomTextInput
                type="Sheet"
                label="닉네임"
                placeholder="커뮤니티 닉네임"
                onChangeText={setNickname}
              />
              <CustomButton
                text="시작하기"
                type="normal"
                onPress={handleSubmitNickname}
              />
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  SearchSection: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingVertical: 7,
    paddingLeft: 7,
  },
  SearchBar: {
    flex: 1,
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    borderRadius: 7,
    paddingHorizontal: 15,
    marginLeft: 6,
    fontSize: 17,
    fontFamily: 'NotoSansKR-Regular',
    includeFontPadding: false,
  },
  SearchText: {
    flex: 1,
    color: 'gray',
  },
  ModalBackDrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.8,
    zIndex: 0,
  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 25,
  },
  ModalName: {
    marginTop: 17,
    fontSize: 25,
    color: '#58a04b',
  },
  ModalText: {
    marginTop: 10,
    fontSize: 17,
  },
  ProfileInput: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: 20,
  },
});

export default SearchScreen;
