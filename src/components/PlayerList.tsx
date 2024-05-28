import {Dimensions, FlatList, Image, Pressable, View} from 'react-native';
import CustomText from './CustomText';
import React from 'react';
import {formatComma} from '../utils/format';
import StarOrangeSvg from '../../assets/images/star-orange.svg';

const PlayerList = props => {
  const {teamName, players} = props;

  return (
    <FlatList
      numColumns={3}
      contentContainerStyle={{paddingTop: 80}}
      data={players}
      renderItem={({item}) => (
        <Pressable style={{paddingBottom: 10, backgroundColor: 'white'}}>
          <Image
            source={{uri: item.image}}
            resizeMode="cover"
            style={{
              height: 150,
              width: Dimensions.get('window').width / 3,
              backgroundColor: 'white',
            }}
          />
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}>
            <View>
              <CustomText
                style={{fontSize: 12, color: '#3f3f3f', paddingBottom: 0}}>
                {teamName}
              </CustomText>
              <CustomText fontWeight="500" style={{fontSize: 16}}>
                {item.name}
              </CustomText>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <StarOrangeSvg width={11} height={11} />
              <CustomText
                fontWeight="600"
                style={{
                  fontSize: 12,
                  color: '#F99E35',
                  paddingBottom: 2,
                  marginLeft: 3,
                }}>
                {formatComma(item.fanCount)}
              </CustomText>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
};

export default PlayerList;
