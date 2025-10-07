import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import { GRAY } from '@/styles/colors';

export const LoadingScreen = (props: any) => {
  return (
    <View style={{...styles.loadingContainer, ...props.style}}>
      <ActivityIndicator size="large" color={GRAY} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingGif: {
    width: 30,
    height: 30,
    opacity: 0.5,
  },
});
