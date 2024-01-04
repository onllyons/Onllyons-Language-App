import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';

export default function LoginScreen({ navigation }) {
  const [PressSignIn, setPressSignIn] = useState(false);

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={[styles.inputView, styles.inputContainer1]}>
        <TextInput
          placeholder="Новый пароль"
          placeholderTextColor="#a5a5a5"
          style={[globalCss.input, styles.inputPassword]}
        />
        <TouchableOpacity style={styles.faEyefaEyeSlash} onPress={togglePasswordVisibility}>
          <Text style={styles.buttonText}>
            {showPassword 
              ? <FontAwesomeIcon icon={faEye} size={20} style={globalCss.link} />
              : <FontAwesomeIcon icon={faEyeSlash} size={20} style={globalCss.link} />}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.inputView, styles.inputContainer2]}>
        <TextInput
          placeholder="Повторите пароль"
          placeholderTextColor="#a5a5a5"
          style={[globalCss.input, styles.inputPassword]}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.faEyefaEyeSlash} onPress={togglePasswordVisibility}>
          <Text style={styles.buttonText}>
            {showPassword 
              ? <FontAwesomeIcon icon={faEye} size={20} style={globalCss.link} />
              : <FontAwesomeIcon icon={faEyeSlash} size={20} style={globalCss.link} />}
          </Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity 
        style={[globalCss.button, PressSignIn ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
        onPressIn={() => setPressSignIn(true)}
        onPressOut={() => setPressSignIn(false)}
        onPress={() => navigation.navigate("LoginScreen")}
        activeOpacity={1}
      >
        <Text style={[globalCss.buttonText, globalCss.bold, globalCss.textUpercase]}>Сохранить пароль</Text>
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
  faEyefaEyeSlash: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '15%',
    marginRight: '6%',
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
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  inputContainer2: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginBottom: 20,
  },
  inputPassword:{
    paddingTop: 17, 
    paddingBottom: 17, 
    paddingRight: 0, 
  },
});
