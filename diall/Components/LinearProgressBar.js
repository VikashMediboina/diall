import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, LinearGradient, Stop, Defs, Rect } from 'react-native-svg';

const LinearProgressBar = ({ progress, width, height }) => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.40);" />
            <Stop offset={`${progress}%`} stopColor="rgba(255, 255, 255, 0.40);" />
            <Stop offset={`${progress}%`} stopColor="#7A7A7A" />
            <Stop offset="100%" stopColor="#7A7A7A" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#grad)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});

export default LinearProgressBar;
