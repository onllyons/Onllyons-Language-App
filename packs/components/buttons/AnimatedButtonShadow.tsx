import {Animated, Pressable, StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useRef, useState} from "react";

type AnimatedButtonShadowProps = {
    children: React.ReactNode,
    styleContainer?: object,
    styleContainerIn?: object,
    styleButton?: object,
    type?: "touchable" | "default",
    durationIn?: number, // Milliseconds start animation
    durationOut?: number, // Milliseconds end animation
    moveByY?: number, // Positive value - animation down, negative value - animation up
    moveByX?: number, // Positive value - animation left, negative value - animation right

    activeOpacity?: number, // Only for type === "touchable"

    shadowWidthAdditional?: number,
    shadowHeightAdditional?: number,
    shadowPositionYAdditional?: number,
    shadowPositionXAdditional?: number,
    shadowBorderRadius?: number,
    shadowColor?: string,

    onPress?: () => void,
    onPressIn?: () => void,
    onPressOut?: () => void
};

export const AnimatedButtonShadow: React.FC<AnimatedButtonShadowProps> = ({
    children,
    styleContainer = {},
    styleContainerIn = {},
    styleButton = {},
    type = "default",
    durationIn = 150,
    durationOut = 150,
    moveByY = 5,
    moveByX = 0,

    activeOpacity = 0.75,

    shadowWidthAdditional = 0,
    shadowHeightAdditional = 0,
    shadowPositionYAdditional = 0,
    shadowPositionXAdditional = 0,
    shadowBorderRadius = 14,
    shadowColor = "#636363",

    onPress,
    onPressIn,
    onPressOut
}) => {
    const transitionContainerY = useRef(new Animated.Value(0));
    const transitionContainerX = useRef(new Animated.Value(0));
    const transitionShadowY = useRef(new Animated.Value(moveByY));
    const transitionShadowX = useRef(new Animated.Value(moveByX));
    const opacityShadow = useRef(new Animated.Value(1));
    const [buttonData, setButtonData] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0
    })

    const handlePressIn = () => {
        Animated.parallel([
            moveByY !== 0 && Animated.timing(transitionContainerY.current, {
                toValue: moveByY,
                duration: durationIn,
                useNativeDriver: true,
            }),
            moveByY !== 0 && Animated.timing(transitionShadowY.current, {
                toValue: 0,
                duration: durationIn,
                useNativeDriver: true,
            }),

            moveByX !== 0 && Animated.timing(transitionContainerX.current, {
                toValue: moveByX,
                duration: durationIn,
                useNativeDriver: true,
            }),
            moveByX !== 0 && Animated.timing(transitionShadowX.current, {
                toValue: 0,
                duration: durationIn,
                useNativeDriver: true,
            }),

            type === "touchable" && Animated.timing(opacityShadow.current, {
                toValue: activeOpacity,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start()
    }

    const handlePressOut = () => {
        Animated.parallel([
            moveByY !== 0 && Animated.timing(transitionContainerY.current, {
                toValue: 0,
                duration: durationOut,
                useNativeDriver: true,
            }),
            moveByY !== 0 && Animated.timing(transitionShadowY.current, {
                toValue: moveByY,
                duration: durationOut,
                useNativeDriver: true,
            }),

            moveByX !== 0 && Animated.timing(transitionContainerX.current, {
                toValue: 0,
                duration: durationOut,
                useNativeDriver: true,
            }),
            moveByX !== 0 && Animated.timing(transitionShadowX.current, {
                toValue: moveByX,
                duration: durationOut,
                useNativeDriver: true,
            }),

            type === "touchable" && Animated.timing(opacityShadow.current, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start()
    }

    let ButtonComponent = null

    if (type === "touchable") ButtonComponent = TouchableOpacity
    else if (type === "default") ButtonComponent = Pressable

    return (
            <Animated.View
                style={[
                    styleContainer, {
                    transform: [
                        {translateY: transitionContainerY.current},
                        {translateX: transitionContainerX.current}
                    ]}
                ]}
            >
                <View style={[{position: "relative"}, styleContainerIn]}>
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: buttonData.y + shadowPositionYAdditional,
                            left: buttonData.x + shadowPositionXAdditional,
                            width: buttonData.width + shadowWidthAdditional,
                            height: buttonData.height + shadowHeightAdditional,
                            backgroundColor: shadowColor,
                            borderRadius: shadowBorderRadius,
                            opacity: opacityShadow.current,

                            transform: [
                                {translateY: transitionShadowY.current},
                                {translateX: transitionShadowX.current},
                            ]
                        }}
                    />

                    <ButtonComponent
                        activeOpacity={activeOpacity}
                        style={styleButton}
                        onLayout={(e) => setButtonData({
                            height: e.nativeEvent.layout.height,
                            width: e.nativeEvent.layout.width,
                            x: e.nativeEvent.layout.x,
                            y: e.nativeEvent.layout.y
                        })}
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
                </View>
            </Animated.View>
    );
};