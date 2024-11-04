import CustomText from 'components/common/CustomText';
import React, {View, TouchableOpacity, Pressable, Platform} from 'react-native';
import AlertSvg from 'assets/images/alert-black.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';

const HomeTabBar = ({state, descriptors, navigation, position}) => {
  const insets = useSafeAreaInsets();
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
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
          width: '37%',
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
            <TouchableOpacity
              activeOpacity={1}
              key={label}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                {paddingBottom: 3, paddingLeft: 3, paddingRight: 0},
                isFocused
                  ? {borderBottomWidth: 3, borderBlockColor: 'black'}
                  : {borderBottomWidth: 3, borderBlockColor: 'white'},
              ]}>
              <CustomText
                fontWeight="600"
                style={{
                  fontSize: 28,
                  color: isFocused ? 'black' : 'rgb(190,190,190)',
                  textAlign: 'center',
                }}>
                {label}
              </CustomText>
            </TouchableOpacity>
          );
        })}
      </View>

      <Pressable
        className="w-10 h-10 items-center justify-center z-10"
        onPress={() => {
          stackNavigation.navigate('Notification');
        }}>
        <AlertSvg />
      </Pressable>
    </View>
  );
};

export default HomeTabBar;
