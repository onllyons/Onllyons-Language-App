import React, {useEffect, useState} from "react";
import globalCss from '../css/globalCss';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function StartPageScreen({ navigation }) {
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [isPressedReview, setIsPressedReview] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Уже есть аккаунт?</Text>
        <Text style={styles.subheading}>
          Начните с того, на чем остановились.
        </Text>
      </View>
    
      <TouchableOpacity 
        style={[globalCss.button, isPressedReview ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
        onPressIn={() => setIsPressedReview(true)}
        onPressOut={() => setIsPressedReview(false)}
        onPress={() => navigation.navigate("LoginScreen")}
        activeOpacity={1}
      >
        <Text style={globalCss.buttonText}>ВХОД</Text>
      </TouchableOpacity>
      

      
      <View style={styles.signupContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.subheading}>Впервые на Onllyons Language?</Text>
        </View>
        <TouchableOpacity
          style={[
            globalCss.button,
            isPressedContinue
              ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
              : globalCss.buttonBlue,
          ]}
          onPressIn={() => setIsPressedContinue(true)}
          onPressOut={() => setIsPressedContinue(false)}
          onPress={() => navigation.navigate("IntroductionScreen")}
          activeOpacity={1}
        >
          <Text style={globalCss.buttonText}>НАЧАТЬ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('MainTabNavigator')}><Text>home</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  textContainer: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 0,
  },
  subheading: {
    fontSize: 18,
    color: "#666",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    width: "100%",
  },
});
