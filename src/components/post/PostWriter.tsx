import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {formatDate} from '../../utils/format';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import MoreSvg from '../../../assets/images/three-dots-black.svg';
import OptionModal, {closeModalHandle} from '../common/OptionModal';

interface PostWriterProps {
  feed: any;
  createdAt: string;
  playerUserId: number;
  isWriter: boolean;
}

const PostWriter = (props: PostWriterProps) => {
  const {feed, createdAt, playerUserId, isWriter} = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigation = useNavigation();
  const closeModalRef = useRef<closeModalHandle>(null);

  return (
    <View style={styles.writerContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Pressable
          onPress={() =>
            navigation.navigate('CommunityStack', {
              screen: 'Profile',
              params: {playerUserId},
            })
          }>
          <Avatar uri={feed.writer.image} size={38} />
        </Pressable>
        <View style={styles.writerNameContainer}>
          <Pressable
            onPress={() =>
              navigation.navigate('CommunityStack', {
                screen: 'Profile',
                params: {playerUserId},
              })
            }>
            <CustomText fontWeight="600" style={styles.writerName}>
              {feed.writer.name}
            </CustomText>
          </Pressable>

          <CustomText style={styles.createAt}>
            {formatDate(createdAt)}
          </CustomText>
        </View>
      </View>
      <Pressable onPress={() => setIsModalOpen(true)}>
        <MoreSvg width={18} height={18} style={{marginTop: 7}} />
      </Pressable>
      {isWriter ? (
        <OptionModal
          ref={closeModalRef}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="수정하기"
          option1Press={() => {
            closeModalRef?.current?.closeModal();
            navigation.navigate('CommunityStack', {
              screen: 'PostWrite',
              params: {playerId: feed.player.id, feed},
            });
          }}
          option2Text="삭제하기"
          option2color="#fe6363"
        />
      ) : (
        <OptionModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="신고하기"
          option1Press={() => {
            navigation.navigate('CommunityStack', {
              screen: 'PostWrite',
              params: {playerId: feed.player.id, feed},
            });
          }}
          option1color="#fe6363"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  writerContainer: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  writerNameContainer: {marginLeft: 8, justifyContent: 'center'},
  writerName: {fontSize: 15},
  createAt: {fontSize: 13, color: '#6d6d6d'},
});

export default PostWriter;
