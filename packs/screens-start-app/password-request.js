import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';

export default function PasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pressSignIn, setPressSignIn] = useState(false);

  const handleRequestPassword = () => {
    // Verifică dacă email-ul este valid folosind regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Ошибка", "Введите действительный адрес электронной почты.");
      return;
    }
    // ...
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={[styles.inputView, styles.inputContainer1]}>
          <TextInput
            placeholder="Адрес эл. почты"
            placeholderTextColor="#a5a5a5"
            style={globalCss.input}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          style={[
            globalCss.button,
            pressSignIn ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen,
          ]}
          onPressIn={() => setPressSignIn(true)}
          onPressOut={() => setPressSignIn(false)}
          onPress={handleRequestPassword}
        >
          <Text style={[globalCss.buttonText, globalCss.bold, globalCss.textUppercase]}>Получить ссылку</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 20,
  },

  inputView:{
    borderBottomWidth: 2.1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    borderLeftWidth: 2.1,
    borderRightWidth: 2.1,
    paddingLeft: 12,
  },
  inputContainer1: {
    borderTopWidth: 2.1,
    borderRadius: 14,
    paddingBottom: 17, 
    paddingTop: 17, 
    paddingRight: 12, 
    marginBottom: 12, 
  },

});
