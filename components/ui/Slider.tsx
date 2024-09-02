import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated, ViewStyle } from 'react-native';

interface SliderProps {
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  step?: number;
  style?: ViewStyle;
  thumbTintColor?: string;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
}

const Slider: React.FC<SliderProps> = ({
  minimumValue,
  maximumValue,
  onValueChange,
  step = 1,
  style,
  thumbTintColor = '#4267B2',
  minimumTrackTintColor = '#4267B2',
  maximumTrackTintColor = '#CCCCCC',
}) => {
  const [value, setValue] = useState(minimumValue);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      animatedValue.stopAnimation();
    },
    onPanResponderMove: (_, gestureState) => {
      const newValue = Math.max(
        minimumValue,
        Math.min(
          maximumValue,
          minimumValue + (gestureState.dx / 300) * (maximumValue - minimumValue)
        )
      );
      const steppedValue = Math.round(newValue / step) * step;
      setValue(steppedValue);
      animatedValue.setValue(
        ((steppedValue - minimumValue) / (maximumValue - minimumValue)) * 300
      );
      onValueChange(steppedValue);
    },
    onPanResponderRelease: () => {
      animatedValue.flattenOffset();
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.minimumTrack,
            { backgroundColor: minimumTrackTintColor },
            { width: animatedValue },
          ]}
        />
        <View
          style={[
            styles.maximumTrack,
            { backgroundColor: maximumTrackTintColor },
          ]}
        />
      </View>
      <Animated.View
        style={[
          styles.thumb,
          { backgroundColor: thumbTintColor },
          { transform: [{ translateX: animatedValue }] },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    flexDirection: 'row',
  },
  minimumTrack: {
    height: 4,
  },
  maximumTrack: {
    height: 4,
    flex: 1,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Slider;
