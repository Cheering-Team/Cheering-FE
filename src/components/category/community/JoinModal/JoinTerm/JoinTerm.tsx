import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import CustomText from '../../../../common/CustomText';
import CheckBox from '../../../../common/CheckBox';
import CustomButton from '../../../../common/CustomButton';
import ArrowLeftGraySvg from '../../../../../../assets/images/arrow-left-gray.svg';

interface JoinTermProps {
  isModalOpen: boolean;
  setJoinState: Dispatch<SetStateAction<'profile' | 'term'>>;

  joinCommunity: () => void;
}

const JoinTerm = (props: JoinTermProps) => {
  const {isModalOpen, setJoinState, joinCommunity} = props;

  const [agreements, setAgreements] = useState({
    one: false,
    two: false,
    three: false,
  });

  const toggleAgreement = (agreement: 'one' | 'two' | 'three') => {
    setAgreements(prev => ({
      ...prev,
      [agreement]: !prev[agreement],
    }));
  };

  useEffect(() => {
    if (!isModalOpen) {
      setJoinState('profile');
      setAgreements({one: false, two: false, three: false});
    }
  }, [isModalOpen, setJoinState]);

  return (
    <>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          setJoinState('profile');
          setAgreements({one: false, two: false, three: false});
        }}>
        <ArrowLeftGraySvg width={32} height={32} />
      </Pressable>

      <CustomText fontWeight="600" style={styles.termTitle}>
        커뮤니티 이용수칙
      </CustomText>

      <CustomText style={styles.termInfo}>
        커뮤니티 이용 전, 아래의 사항들에 동의해주세요
      </CustomText>
      <View style={styles.termContainer}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          <CheckBox
            isCheck={agreements.one}
            onPress={() => toggleAgreement('one')}
            style={{marginTop: 2}}
          />

          <CustomText fontWeight="500" style={{fontSize: 16, color: '#353535'}}>
            해당 커뮤니티는 선수와 팬들을 위한 공간입니다.
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          <CheckBox
            isCheck={agreements.two}
            onPress={() => toggleAgreement('two')}
            style={{marginTop: 2}}
          />
          <View>
            <CustomText
              fontWeight="500"
              style={{
                fontSize: 16,
                color: '#353535',
              }}>
              선수를 비하하는 등의 글, 댓글, 채팅 작성 시
            </CustomText>
            <CustomText
              fontWeight="500"
              style={{
                marginLeft: 3,
                fontSize: 16,
                color: '#353535',
              }}>
              커뮤니티 이용이 정지될 수 있습니다.
            </CustomText>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 5,
          }}>
          <CheckBox
            isCheck={agreements.three}
            onPress={() => toggleAgreement('three')}
            style={{marginTop: 2}}
          />
          <View>
            <CustomText
              fontWeight="500"
              style={{
                fontSize: 16,
                color: '#353535',
              }}>
              깨끗한 커뮤니티 유지를 위하여 커뮤니티 가입
            </CustomText>
            <CustomText
              fontWeight="500"
              style={{
                marginLeft: 3,
                fontSize: 16,
                color: '#353535',
              }}>
              24시간 이후에 글을 작성할 수 있습니다.
            </CustomText>
          </View>
        </View>
      </View>
      <CustomButton
        text="시작하기"
        type="normal"
        disabled={!Object.values(agreements).every(Boolean)}
        onPress={() => {
          joinCommunity();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {position: 'absolute', top: 20, left: 13},
  termTitle: {
    fontSize: 22,
    color: '#000000',
    alignSelf: 'center',
    marginTop: 18,
  },
  termInfo: {
    fontSize: 15,
    color: '#515151',
    marginTop: 5,
    alignSelf: 'center',
  },
  termContainer: {paddingLeft: 2, marginTop: 25, marginBottom: 30},
});

export default JoinTerm;
