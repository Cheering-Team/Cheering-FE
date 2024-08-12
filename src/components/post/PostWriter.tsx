import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {formatDate} from '../../utils/format';
import Avatar from '../common/Avatar';
import CustomText from '../common/CustomText';
import {useNavigation} from '@react-navigation/native';
import MoreSvg from '../../../assets/images/three-dots-black.svg';
import OptionModal from '../common/OptionModal';
import AlertModal from '../common/AlertModal/AlertModal';
import {deletePost} from '../../apis/post';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface PostWriterProps {
  feed: any;
  createdAt: string;
  playerUserId: number;
  isWriter: boolean;
}

const PostWriter = (props: PostWriterProps) => {
  const {feed, createdAt, playerUserId, isWriter} = props;

  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts'], exact: false});
      queryClient.invalidateQueries({queryKey: ['my', 'posts'], exact: false});
    },
  });

  const handleDeletePost = async () => {
    const data = await mutation.mutateAsync({postId: feed.id});

    if (data.message === '게시글을 삭제하였습니다.') {
      Toast.show({
        type: 'default',
        position: 'top',
        visibilityTime: 3000,
        topOffset: insets.top + 20,
        text1: '게시글을 삭제하였습니다.',
      });
    }
  };

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
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          option1Text="수정하기"
          option1Press={() => {
            navigation.navigate('CommunityStack', {
              screen: 'PostWrite',
              params: {playerId: feed.player.id, feed},
            });
          }}
          option2Text="삭제하기"
          option2color="#fe6363"
          option2Press={() => {
            setIsAlertOpen(true);
          }}
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
      <AlertModal
        isModalOpen={isAlertOpen}
        setIsModalOpen={setIsAlertOpen}
        title="게시글을 삭제하시겠어요?"
        content="게시글을 삭제한 후에는 복구할 수 없습니다."
        button1Text="삭제"
        button1Color="#fe6363"
        button2Text="취소"
        button1Press={() => {
          handleDeletePost();
        }}
      />
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
