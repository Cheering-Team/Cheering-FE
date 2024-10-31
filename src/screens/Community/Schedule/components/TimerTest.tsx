import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(23, 0, 0, 0); // 오늘 18시 정각 설정

    const updateTimer = () => {
      const currentTime = Date.now();
      const difference = targetTime.getTime() - currentTime;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = String(
        Math.floor((difference / (1000 * 60 * 60)) % 24),
      ).padStart(2, '0');
      const minutes = String(
        Math.floor((difference / (1000 * 60)) % 60),
      ).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
        2,
        '0',
      );

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer(); // 초기 설정
    const timerId = setInterval(() => {
      requestAnimationFrame(updateTimer);
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(timerId); // 컴포넌트가 언마운트될 때 타이머 정리
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default CountdownTimer;
