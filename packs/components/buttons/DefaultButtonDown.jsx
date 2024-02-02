import {Animated, TouchableOpacity} from "react-native";
import React, {useRef} from "react";

export const DefaultButtonDown = ({children, style, onPress, onPressIn, onPressOut}) => {
    const transitionY = useRef(new Animated.Value(0));

    const handlePressIn = (func = null) => {
        Animated.timing(transitionY.current, {
            toValue: 5,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            if (func) func()
        })
    }

    const handlePressOut = (func = null) => {
        Animated.timing(transitionY.current, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            if (func) func()
        })
    }

    const handlePress = () => {
        handlePressIn(() => handlePressOut())
    }

    return (
        <Animated.View
            style={[style, {transform: [{translateY: transitionY.current}]}]}
        >
            <TouchableOpacity
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPressIn={() => {
                    console.log("88888888888888888888")
                    handlePressIn()

                    if (onPressIn) {
                        console.log("11111111111")
                        onPressIn()
                    }
                }}
                onPressOut={() => {
                    console.log("99999999999999")
                    handlePressOut()

                    if (onPressOut) {
                        console.log("22222222222222")
                        onPressOut()
                    }
                }}
                onPress={() => {
                    console.log("000000000000000")
                    handlePress()

                    if (onPress) {
                        console.log("333333333333333333")
                        onPress()
                    }
                }}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};