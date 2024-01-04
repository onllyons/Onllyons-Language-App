import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecondMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Second Menu Screen</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
});
