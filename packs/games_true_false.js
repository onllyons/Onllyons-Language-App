import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

export default function GamesTrueFalse({navigation}) {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NumberGame />
        </GestureHandlerRootView>
    );
}

const NumberGame = () => {
    // Generate the initial current and next numbers
    const initialCurrentNumber = generateRandomNumber();
    const initialNextNumber = generateRandomNumber();

    // Set the initial state
    const [currentNumber, setCurrentNumber] = useState(initialCurrentNumber);
    const [nextNumber, setNextNumber] = useState(initialNextNumber);

    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // Animated value for background color
    // const backgroundColor = translateY.interpolate({
    //     inputRange: [-150, 0, 150],
    //     outputRange: ['green', 'grey', 'red'],
    //     extrapolate: 'clamp'
    // });

    let lastChange = useRef(Date.now())
    console.log("update")

    const swipeGesture = Gesture.Pan()
        .onChange((event) => {
            if (Date.now() - lastChange.current < 500) return

            lastChange.current = Date.now()

            console.log(event.translationY)
            translateY.setValue(event.translationY);
            // const newScale = event.translationY < 0 ? 1.1 : 0.9;
            // scale.setValue(newScale);
            console.log("change")
        })
        // .onEnd((event) => {
        //     if (event.translationY < 0) {
        //         console.log(`Swiped Up: ${currentNumber}`);
        //     } else {
        //         console.log(`Swiped Down: ${currentNumber}`);
        //     }
        //     // Set the current number to the pre-generated next number
        //     setCurrentNumber(nextNumber);
        //     // Generate a new number for the next swipe
        //     setNextNumber(generateRandomNumber());
        //
        //     Animated.spring(translateY, {
        //         toValue: 0,
        //         useNativeDriver: true,
        //     }).start();
        //     Animated.spring(scale, {
        //         toValue: 1,
        //         useNativeDriver: true,
        //     }).start();
        // });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={swipeGesture}>
                <View style={styles.numbersRow}>
                    <Animated.View style={[styles.numberView, {
                        transform: [{ translateY }, { scale }],
                        // backgroundColor: backgroundColor
                    }]}>
                        <Text style={styles.numberText}>{currentNumber}</Text>
                    </Animated.View>
                    <View style={styles.nextNumberView}>
                        <Text style={styles.nextNumberText}>{nextNumber}</Text>
                    </View>
                </View>
            </GestureDetector>
        </View>
    );
};

// Helper function to generate a random number between 1 and 9
function generateRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numbersRow: {
        flexDirection: 'row', // Align children horizontally
        alignItems: 'center', // Align children vertically in the center
    },
    numberView: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginRight: 20, // Add some spacing between the number and next number views
    },
    numberText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '600',
    },
    nextNumberView: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(200, 200, 200, 0.8)',
        borderRadius: 12,
    },
    nextNumberText: {
        fontSize: 16,
        color: '#000',
    },
});