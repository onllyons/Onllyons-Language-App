import React, { useState, useEffect } from 'react';
import { View, Text, Button, Appearance, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import globalCss from "../css/globalCss";

const ProfileSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: darkMode ? '#000' : '#FFF',
    },
    text: {
      color: darkMode ? '#FFF' : '#000',
    },
    buttonContainer: {
      marginTop: 20,
    }
  });

  const handleSystemThemeChange = () => {
  const colorScheme = Appearance.getColorScheme();
  if (colorScheme === 'dark') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
};


  // Încarcă starea inițială a modului întunecat din AsyncStorage
  useEffect(() => {
    async function loadDarkModeState() {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkMode(savedDarkMode === 'true');
        }
      } catch (error) {
        console.error('Eroare la încărcarea stării modului întunecat:', error);
      }
    }

    loadDarkModeState();
  }, []);

  // Salvează starea modului întunecat în AsyncStorage la schimbarea acesteia
  useEffect(() => {
    async function saveDarkModeState() {
      try {
        await AsyncStorage.setItem('darkMode', darkMode.toString());
      } catch (error) {
        console.error('Eroare la salvarea stării modului întunecat:', error);
      }
    }

    saveDarkModeState();
  }, [darkMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Menu Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Dark"
          onPress={() => setDarkMode(true)}
        />
        <Button
          title="White"
          onPress={() => setDarkMode(false)}
        />
        <Button
		  title="Sistem"
		  onPress={handleSystemThemeChange}
		/>
      </View>
    </View>
  );
}

export default ProfileSettings;
