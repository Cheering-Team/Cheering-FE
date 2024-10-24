import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import React, {RefObject, useState} from 'react';
import {Platform, Pressable, View} from 'react-native';
import ArrowSvg from '../../../assets/images/arrow_up.svg';
import {useWriteComment} from 'apis/comment/useComments';
import {showTopToast} from 'utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Fan} from 'apis/user/types';
import {queryClient} from '../../../../App';
import {dailyKeys} from 'apis/post/queries';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

interface DailyTextInputProps extends BottomSheetFooterProps {
  dailyId: number | null;
  isToady: boolean;
  writer?: Fan;
  communityId: number;
  date: string;
  bottomSheetRef: RefObject<BottomSheetMethods>;
}

const DailyTextInput = ({
  dailyId,
  isToady,
  writer,
  bottomSheetRef,
  communityId,
  date,
  animatedFooterPosition,
}: DailyTextInputProps) => {
  const insets = useSafeAreaInsets();

  const [content, setContent] = useState('');

  const {mutateAsync: writeComment} = useWriteComment(dailyId, writer);

  const handleWriteComment = async () => {
    if (dailyId) {
      try {
        setContent('');
        await writeComment({postId: dailyId, content});
      } catch (error: any) {
        if (error.code === 2004) {
          showTopToast(insets.top + 20, '부적절한 단어가 포함되어 있습니다');
        }
        if (error.code === 404) {
          bottomSheetRef.current?.close();
          showTopToast(insets.top + 20, '글이 삭제되었어요');
          queryClient.invalidateQueries({
            queryKey: dailyKeys.list(communityId, date),
          });
        }
      }
    }
  };

  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <View className="py-[5] px-2 border-t border-t-[#eeeeee] bg-white">
        <View
          className="flex-row bg-[#f5f5f5] rounded-[20px] justify-between pl-3 pr-10"
          style={{paddingVertical: Platform.OS === 'ios' ? 9 : 6}}>
          <BottomSheetTextInput
            multiline
            placeholder={
              isToady ? '답글을 남겨보세요' : '당일에만 소통할 수 있어요'
            }
            // editable={isToady}
            value={content}
            onChangeText={setContent}
            allowFontScaling={false}
            style={{
              flex: 1,
              paddingLeft: 0,
              paddingTop: 0,
              paddingBottom: 0,
              margin: 0,
              fontSize: 14,
              lineHeight: 20,
              includeFontPadding: false,
              fontFamily: 'NotoSansKR-Regular',
            }}
          />
          <Pressable
            className="absolute right-[5] bottom-[3] bg-black px-[13] py-[9] rounded-[20px]"
            disabled={content.trim().length === 0}
            style={[
              content.trim().length === 0 && {backgroundColor: '#a1a1a1'},
            ]}
            onPress={handleWriteComment}>
            <ArrowSvg width={15} height={15} />
          </Pressable>
        </View>
      </View>
    </BottomSheetFooter>
  );
};

export default DailyTextInput;
