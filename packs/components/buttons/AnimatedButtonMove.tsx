import {Animated, Pressable, TouchableOpacity, ViewStyle} from "react-native";
import React, {useRef} from "react";

type AnimatedButtonMoveProps = {
    children: React.ReactNode,
    styleContainer?: ViewStyle,
    styleButton?: ViewStyle,
    type?: "touchable" | "default",
    durationIn?: number, // Milliseconds start animation
    durationOut?: number, // Milliseconds end animation
    moveBy?: number, // Positive value - animation down, negative value - animation up

    activeOpacity?: number, // Only for type === "touchable"

    onPress?: () => void,
    onPressIn?: () => void,
    onPressOut?: () => void
};

export const AnimatedButtonMove: React.FC<AnimatedButtonMoveProps> = ({
    children,
    styleContainer = {},
    styleButton = {},
    type = "default",
    durationIn = 150,
    durationOut = 150,
    moveBy = 5,

    activeOpacity = 0.75,

    onPress,
    onPressIn,
    onPressOut
}) => {
    const transitionY = useRef(new Animated.Value(0));

    const handlePressIn = () => {
        Animated.timing(transitionY.current, {
            toValue: moveBy,
            duration: durationIn,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.timing(transitionY.current, {
            toValue: 0,
            duration: durationOut,
            useNativeDriver: true,
        }).start()
    }

    let ButtonComponent = null

    if (type === "touchable") ButtonComponent = TouchableOpacity
    else if (type === "default") ButtonComponent = Pressable

    return (
        <Animated.View
            style={[styleContainer, {transform: [{translateY: transitionY.current}]}]}
        >
            <ButtonComponent
                style={[styleButton]}
                activeOpacity={activeOpacity}
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
                    if (onPress) onPress()
                }}
            >
                {children}
            </ButtonComponent>
        </Animated.View>
    );
};