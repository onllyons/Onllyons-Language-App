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
                    handlePressIn()

                    if (onPressIn) {
                        onPressIn()
                    }
                }}
                onPressOut={() => {
                    handlePressOut()

                    if (onPressOut) {
                        onPressOut()
                    }
                }}
                onPress={() => {
                    handlePress()

                    if (onPress) {
                        onPress()
                    }
                }}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};