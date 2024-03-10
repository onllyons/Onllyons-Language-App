import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, StyleSheet, Text, } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle, withRepeat } from 'react-native-reanimated';
import Svg, { Rect, Circle, Polygon } from 'react-native-svg';
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import globalCss from "../css/globalCss";

const { width, height } = Dimensions.get('window');

const shapes = ['circle', 'triangle', 'square', 'rhombus'];

const generateConfettiPieces = (count) => {
  let pieces = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 10 + 5;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const initialX = Math.random() * width;
    pieces.push({ size, shape, color, initialX });
  }
  return pieces;
};

const renderShape = (shape, size, color) => {
  switch (shape) {
    case 'circle':
      return <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />;
    case 'triangle':
      return <Polygon points={`${size / 2},0 ${size}, ${size} 0,${size}`} fill={color} />;
    case 'square':
      return <Rect x={0} y={0} width={size} height={size} fill={color} />;
    case 'rhombus':
      return <Polygon points={`${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}`} fill={color} />;
    default:
      return null;
  }
};

const ConfettiPiece = ({ size, shape, color }) => {
  // Poziție inițială aleatorie pe axa X (de-a lungul marginii superioare a ecranului)
  const initialX = Math.random() * width;
  const x = useSharedValue(initialX);
  const y = useSharedValue(-size); // Începe deasupra ecranului
  const rotation = useSharedValue(0);

  // Determină direcția de deplasare (stânga sau dreapta) și ajustează în consecință
  const isMovingRight = Math.random() < 0.5;
  const finalX = isMovingRight ? initialX + (Math.random() * width / 2) : initialX - (Math.random() * width / 2);
  // Asigură că finalX rămâne în limitele ecranului
  const adjustedFinalX = Math.min(Math.max(finalX, 0), width);

useEffect(() => {
  // Animație pentru mișcare diagonală repetitivă
  y.value = withRepeat(withTiming(height + size, {
    duration: 4000 + Math.random() * 3000, // Durată variabilă pentru efectul de cădere
    easing: Easing.quad, // Easing pentru o cădere mai naturală
  }), -1, false); // -1 pentru repetare infinită, false pentru a nu inversa animația

  x.value = withRepeat(withTiming(adjustedFinalX, {
    duration: 4000 + Math.random() * 3000, // Aceeași durată ca și pentru y pentru o mișcare diagonală
    easing: Easing.quad, // Easing similar pentru o mișcare fluidă
  }), -1, false); // -1 pentru repetare infinită, false pentru a nu inversa animația

  rotation.value = withRepeat(withTiming(360, {
    duration: 2000, // Durata unei rotații complete
    easing: Easing.linear, // Easing linear pentru o rotație uniformă
  }), -1, true); // true pentru a inversa animația și a oferi variație
}, []);


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { rotateZ: `${rotation.value}deg` }
      ],
      position: 'absolute',
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {renderShape(shape, size, color)}
      </Svg>
    </Animated.View>
  );
};




export const Congratulations = ({ navigation }) => {
  const [confettiPieces, setConfettiPieces] = useState(generateConfettiPieces(100));

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {confettiPieces.map((piece, index) => (
        <ConfettiPiece key={index} {...piece} />
      ))}

      <View style={styles.containerAbsolute}>
            
            <Image
               source={require('../images/El/successful.png')}
               style={styles.infoCategoryImg}
            />   
            <Text style={styles.paymentSuccessful}>Вы успешно оформили подписку. Пользуйтесь всеми преимуществами без ограничений.</Text>
            <AnimatedButtonShadow
                styleButton={[globalCss.button, globalCss.buttonGreen]}
                shadowColor={"green"}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabNavigator' }],
                    })
                }}
            >
                <Text style={globalCss.buttonText}>НАЧАТЬ</Text>
            </AnimatedButtonShadow>
      </View>


    </View>
  );
};
const styles = StyleSheet.create({
    containerAbsolute: {
        position: 'absolute',
        alignSelf: "center",
        top: '18%',
        width: '87%',
        zIndex: 1,
    },
    infoCategoryImg: {
        width: 370,
        height: 370,
        resizeMode: "contain",
        alignSelf: "center",
    },
    paymentSuccessful:{
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        color: '#424242',
        marginVertical: "5%",
    },
});