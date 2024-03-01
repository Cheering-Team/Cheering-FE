import {SafeAreaView, StyleSheet, Text} from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.splashBack}>
      <Text style={styles.splashTitle}>Cheering</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splashBack: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: '#EF4365',
  },
  splashTitle: {
    marginTop: '45%',
    color: 'white',
    fontSize: 50,
    fontWeight: '700',
  },
});

export default SplashScreen;
