import React, {useCallback, useEffect} from 'react';
import CustomTextInput, {CustomTextInputProps} from './CustomTextInput';
import {useBottomSheetInternal} from '@gorhom/bottom-sheet';

const CustomBottomSheetTextInput = (props: CustomTextInputProps) => {
  const {shouldHandleKeyboardEvents} = useBottomSheetInternal();

  const handleOnFocus = useCallback(() => {
    shouldHandleKeyboardEvents.value = true;
  }, [shouldHandleKeyboardEvents]);

  const handleOnBlur = useCallback(() => {
    shouldHandleKeyboardEvents.value = false;
  }, [shouldHandleKeyboardEvents]);

  useEffect(() => {
    return () => {
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);

  return (
    <CustomTextInput onFocus={handleOnFocus} onBlur={handleOnBlur} {...props} />
  );
};

export default CustomBottomSheetTextInput;
