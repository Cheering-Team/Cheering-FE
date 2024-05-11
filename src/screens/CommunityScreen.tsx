// import {
//   FlatList,
//   ImageBackground,
//   Pressable,
//   StyleSheet,
//   View,
// } from 'react-native';
// import Back from '../hooks/Back';
// import LinearGradient from 'react-native-linear-gradient';
// import React from 'react';

// import CustomText from '../components/CustomText';
// import {getCommunitiesToPosts} from '../apis/community';
// import ToPost, {Post} from '../components/ToPost';
// import {HomeStackParamList} from '../navigations/HomeStackNavigator';
// import {RouteProp} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// type CommunityScreenNavigationProp = NativeStackNavigationProp<
//   HomeStackParamList,
//   'Community'
// >;

// type CommunityScreenRouteProp = RouteProp<HomeStackParamList, 'Community'>;

// const CommunityScreen = ({
//   navigation,
//   route,
// }: {
//   navigation: CommunityScreenNavigationProp;
//   route: CommunityScreenRouteProp;
// }) => {
//   const communityId = route.params.communityId;

//   const [toData, setToData] = React.useState<Post[]>([]);

//   const [curMenu, setCurMenu] = React.useState<'to' | 'from' | 'live' | 'chat'>(
//     'to',
//   );
//   Back(navigation);

//   React.useEffect(() => {
//     const getToPosts = async () => {
//       const response = await getCommunitiesToPosts({id: communityId});
//       setToData(response.data);
//     };

//     if (curMenu === 'to') {
//       getToPosts();
//     }
//   }, [curMenu, communityId]);

//   return (
//     <FlatList
//       data={toData}
//       renderItem={({item}) => <ToPost item={item} />}
//       ListHeaderComponent={() => (
//         <>
//
//           <View style={styles.MenuContainer}>
//             <Pressable
//               style={[styles.Menu, curMenu === 'to' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('to')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'to' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 To
//               </CustomText>
//             </Pressable>
//             <Pressable
//               style={[styles.Menu, curMenu === 'from' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('from')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'from' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 From
//               </CustomText>
//             </Pressable>
//             <Pressable
//               style={[styles.Menu, curMenu === 'live' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('live')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'live' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 Live
//               </CustomText>
//             </Pressable>
//             <Pressable
//               style={[styles.Menu, curMenu === 'chat' && styles.SelectedMenu]}
//               onPress={() => setCurMenu('chat')}>
//               <CustomText
//                 style={[
//                   styles.MenuText,
//                   curMenu === 'chat' && styles.SelectedText,
//                 ]}
//                 fontWeight="600">
//                 Chat
//               </CustomText>
//             </Pressable>
//           </View>
//         </>
//       )}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   // 헤더
//   CommunityHeader: {
//     flex: 1,
//     alignItems: 'center',
//     height: 350,
//   },
//   CommunityHeaderBlur: {
//     width: '100%',
//     height: 350,
//   },
//   CommunityTitle: {
//     position: 'absolute',
//     bottom: -2,
//     flex: 1,
//     alignItems: 'center',
//   },
//   CommunityName: {
//     fontSize: 60,
//     letterSpacing: 2,
//     color: 'white',
//   },
//   CommunityInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 15,
//     bottom: -10,
//   },
//   TeamLogo: {
//     width: 35,
//     height: 35,
//   },

//   // 메뉴
//   MenuContainer: {
//     height: 42,
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#242424',
//     marginBottom: 10,
//   },
//   Menu: {
//     flex: 1,
//     padding: 5,
//   },
//   MenuText: {
//     textAlign: 'center',
//     fontSize: 19,
//     color: 'white',
//   },
//   SelectedMenu: {
//     backgroundColor: 'white',
//   },
//   SelectedText: {
//     color: 'black',
//   },
// });

// export default CommunityScreen;

import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useHeaderHeight} from '@react-navigation/elements';
import CommunityHeader from '../components/CommunityHeader';
import CommunityTopTab from '../components/CommunityTopTab';
import ToPostScreen from './ToPostScreen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigations/HomeStackNavigator';
import {RouteProp} from '@react-navigation/native';
import Back from '../hooks/Back';
import FromPostScreen from './FromPostScreen';
import LiveScreen from './LiveScreen';
import ChatListScreen from './ChatListScreen';

type CommunityScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Community'
>;

type CommunityScreenRouteProp = RouteProp<HomeStackParamList, 'Community'>;

const CommunityScreen = ({
  navigation,
  route,
}: {
  navigation: CommunityScreenNavigationProp;
  route: CommunityScreenRouteProp;
}) => {
  Back(navigation);

  const headerHeight = useHeaderHeight();

  return (
    <Tabs.Container
      renderHeader={CommunityHeader}
      minHeaderHeight={headerHeight}
      renderTabBar={CommunityTopTab}>
      <Tabs.Tab name="To">
        <ToPostScreen
          communityId={route.params.communityId}
          navigation={navigation}
        />
      </Tabs.Tab>
      <Tabs.Tab name="From">
        <FromPostScreen
          communityId={route.params.communityId}
          navigation={navigation}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Live">
        <LiveScreen />
      </Tabs.Tab>
      <Tabs.Tab name="Chat">
        <ChatListScreen navigation={navigation} />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default CommunityScreen;
