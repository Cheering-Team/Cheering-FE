import CustomText from 'components/common/CustomText';
import React, {View, Pressable, Platform} from 'react-native';
import AlertSvg from 'assets/images/alert-black.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import {useCallback} from 'react';
import {useGetIsUnread} from 'apis/notification/useNotifications';

const HomeTabBar = ({state, descriptors, navigation, position}) => {
  const insets = useSafeAreaInsets();
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const {data, refetch} = useGetIsUnread();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
  return (
    <View
      style={{
        paddingTop: Platform.OS === 'android' ? 2 + insets.top : 2,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'android' ? 50 + insets.top : 50,
        paddingHorizontal: 10,
        width: '100%',
      }}>
      <Pressable className="w-10 h-10" />
      <View
        style={{
          width: '34%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                {paddingBottom: 2, paddingLeft: 3, paddingRight: 0},
                isFocused
                  ? {borderBottomWidth: 2, borderBlockColor: 'black'}
                  : {borderBottomWidth: 2, borderBlockColor: 'white'},
              ]}>
              <CustomText
                type="title"
                style={{
                  fontSize: 26,
                  color: isFocused ? 'black' : 'rgb(190,190,190)',
                  textAlign: 'center',
                }}>
                {label}
              </CustomText>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        className="w-10 h-10 items-center justify-center z-10"
        onPress={() => {
          stackNavigation.navigate('Notification');
        }}>
        <AlertSvg />
        {data && (
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              width: 10,
              height: 10,
              backgroundColor: '#fc3b3b',
              borderRadius: 100,
              top: 7,
              right: 7,
            }}
          />
        )}
      </Pressable>
    </View>
  );
};

export default HomeTabBar;
