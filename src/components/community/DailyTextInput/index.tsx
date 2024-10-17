import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {Platform, Pressable, View} from 'react-native';
import ArrowSvg from '../../../assets/images/arrow_up.svg';
import {useWriteComment} from 'apis/comment/useComments';

interface DailyTextInputProps extends BottomSheetFooterProps {
  dailyId: number | null;
  isToady: boolean;
}

const DailyTextInput = ({
  dailyId,
  isToady,
  animatedFooterPosition,
}: DailyTextInputProps) => {
  const [content, setContent] = useState('');

  const {mutateAsync: writeComment} = useWriteComment();

  const handleWriteComment = async () => {
    if (dailyId) {
      const data = await writeComment({postId: dailyId, content});

      if (data.message === '작성 완료') {
        setContent('');
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
