import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React, {Dispatch, RefObject, SetStateAction, useRef} from 'react';
import {Pressable, View} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import MoreSvg from '../../../../assets/images/three-dots-black.svg';
import {formatTime} from 'utils/format';
import OptionModal from 'components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {GetDailysResponse, Post} from 'apis/post/types';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useGetRandomComment} from 'apis/comment/useComments';
import RefreshSvg from '../../../../assets/images/refresh.svg';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface DailyProps {
  dailyData?: GetDailysResponse;
  post: Post;
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  setContent: Dispatch<SetStateAction<string>>;
  setCurId: Dispatch<SetStateAction<number | null>>;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  bottomSheetRef: RefObject<BottomSheetMethods>;
  setCurComment: Dispatch<SetStateAction<number | null>>;
}

const Daily = ({
  dailyData,
  post,
  setIsWriteOpen,
  setContent,
  setCurId,
  setIsDeleteOpen,
  bottomSheetRef,
  setCurComment,
}: DailyProps) => {
  const moreModalRef = useRef<BottomSheetModal>(null);

  const {data, refetch} = useGetRandomComment(post.id);

  return (
    <View>
      <Pressable
        className="flex-row my-[5]"
        onLongPress={() => {
          moreModalRef.current?.present();
          ReactNativeHapticFeedback.trigger('impactLight', options);
        }}>
        <Avatar uri={dailyData?.owner.image} size={40} className="mt-1" />
        <View
          className="bg-white p-3 ml-3 rounded-[15px] flex-row items-center max-w-[65%]"
          style={{
            shadowColor: '#000000',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <CustomText className="text-[15px]">{post.content}</CustomText>
        </View>
        <View
          className="justify-between
  ">
          <Pressable
            className="p-2"
            onPress={() => moreModalRef.current?.present()}>
            <MoreSvg width={11} height={11} />
          </Pressable>

          <CustomText className="ml-2 text-[12px] text-gray-500">
            {formatTime(post.createdAt)}
          </CustomText>
        </View>
        <OptionModal
          modalRef={moreModalRef}
          firstText="수정"
          firstSvg="edit"
          firstOnPress={() => {
            setIsWriteOpen(true);
            setContent(post.content);
            setCurId(post.id);
          }}
          secondText="삭제"
          secondColor="#ff2626"
          secondSvg="trash"
          secondOnPress={() => {
            setIsDeleteOpen(true);
            setCurId(post.id);
          }}
        />
      </Pressable>
      <Pressable
        className="bg-white self-end my-4 py-2 px-3 rounded-[15px] w-[80%]"
        onPress={() => {
          bottomSheetRef.current?.snapToIndex(0);
          setCurComment(post.id);
        }}
        style={{
          shadowColor: '#000000',
          shadowOffset: {width: 1, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}>
        <View className="flex-row">
          <CustomText className="text-[13px]">💬</CustomText>
          <CustomText className="text-gray-500 ml-1 text-[13px]">
            {post.commentCount}
          </CustomText>
        </View>
        {post.commentCount !== 0 && (
          <View className="flex-row items-center mt-2 h-10">
            <Avatar uri={data?.result?.writer.image} size={25} />
            <CustomText className="mx-3 text-[13px] flex-1" numberOfLines={2}>
              {data?.result?.content}
            </CustomText>
            <Pressable
              onPress={() => refetch()}
              className="bg-white p-[6] rounded-full"
              style={{
                shadowColor: '#000000',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 5,
              }}>
              <RefreshSvg width={13} height={13} />
            </Pressable>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default Daily;
