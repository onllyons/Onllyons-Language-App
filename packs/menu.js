import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button 
        title="Menu 1" 
        onPress={() => navigation.navigate('FirstMenu')}
      />
      <Button 
        title="Menu 2" 
        onPress={() => navigation.navigate('SecondMenuScreen')}
      />
      <Button 
        title="Menu 3" 
        onPress={() => console.log('Menu 3 selectată')}
      />
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
