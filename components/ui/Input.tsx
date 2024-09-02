import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
});

export default Input;
