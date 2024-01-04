import React, { useState } from 'react';
import globalCss from '../css/globalCss';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FirstMenu({ navigation }) {
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [isPressedReview, setIsPressedReview] = useState(false);
  const [isCardPressed1, setIsCardPressed1] = useState(false);
  const [isCardPressed2, setIsCardPressed2] = useState(false);

  return (
    <View style={globalCss.container}>

      <Text style={globalCss.title}>Курс: Английский язык</Text>

      <View style={globalCss.row}>
        <TouchableOpacity 
          style={[globalCss.card, isCardPressed1 ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry]}
          onPressIn={() => setIsCardPressed1(true)}
          onPressOut={() => setIsCardPressed1(false)}
          activeOpacity={1}
        >
          <Text>Flash Card</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[globalCss.card, isCardPressed2 ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry]}
          onPressIn={() => setIsCardPressed2(true)}
          onPressOut={() => setIsCardPressed2(false)}
          activeOpacity={1}
        >
          <Text>Flash Card</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[globalCss.button, isPressedContinue ? [globalCss.buttonPressed, globalCss.buttonPressedBlue] : globalCss.buttonBlue]}
        onPressIn={() => setIsPressedContinue(true)}
        onPressOut={() => setIsPressedContinue(false)}
        activeOpacity={1}
      >
        <Text style={globalCss.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[globalCss.button, isPressedReview ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
        onPressIn={() => setIsPressedReview(true)}
        onPressOut={() => setIsPressedReview(false)}
        activeOpacity={1}
      >
        <Text style={globalCss.buttonText}>REVIEW</Text>
      </TouchableOpacity>
    </View>
  );
}
