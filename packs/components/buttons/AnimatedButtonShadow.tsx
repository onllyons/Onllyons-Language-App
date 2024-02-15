import {Animated, Pressable, TouchableOpacity, View, ViewStyle} from "react-native";
import React, {useEffect, useRef, useState} from "react";

// Ready-made shadow colors
export const SHADOW_COLORS = {
    green: "#439e04",
    blue: "#368fc3",
    purple: "#4631A8",
    gray1: "#c5c5c5",
    gray2: "#828080",
    gray: "#d8d8d8",
    grayWhite: "#eaeaea",
    yellow: "#a08511"
} as const

type SHADOW_COLOR = keyof typeof SHADOW_COLORS;

type AnimatedButtonShadowProps = {
    disable?: boolean,
    permanentlyActive?: boolean,
    permanentlyActiveOpacity?: number,
    children: React.ReactNode,
    styleContainer?: ViewStyle,
    styleContainerIn?: ViewStyle,
    styleButton?: object,
    type?: "touchable" | "default",
    durationIn?: number, // Milliseconds start animation
    durationOut?: number, // Milliseconds end animation
    moveByY?: number, // Positive value - animation down, negative value - animation up
    moveByX?: number, // Positive value - animation left, negative value - animation right
    size?: "default" | "full"

    activeOpacity?: number, // Only for type === "touchable"

    shadowWidthAdditional?: number,
    shadowHeightAdditional?: number,
    shadowPositionYAdditional?: number,
    shadowPositionXAdditional?: number,

    refButton?: any,

    shadowBorderRadius?: number,
    shadowTopLeftBorderRadius?: number,
    shadowTopRightBorderRadius?: number,
    shadowBottomLeftBorderRadius?: number,
    shadowBottomRightBorderRadius?: number,

    shadowColor?: SHADOW_COLOR | string,
    shadowDisplayAnimate?: "none" | "slide",

    onPress?: (event) => void,
    onPressIn?: (event) => void,
    onPressOut?: (event) => void
    onLayout?: (event) => void
};

export const AnimatedButtonShadow: React.FC<AnimatedButtonShadowProps> = React.memo(({
    disable = false,
    permanentlyActive = null,
    permanentlyActiveOpacity = 1,
    children,
    styleContainer = {},
    styleContainerIn = {},
    styleButton = {},
    type = "default",
    durationIn = 150,
    durationOut = 150,
    moveByY = 5,
    moveByX = 0,
    size = "default",

    refButton,

    activeOpacity = 0.75,

    shadowWidthAdditional = 0,
    shadowHeightAdditional = 0,
    shadowPositionYAdditional = 0,
    shadowPositionXAdditional = 0,

    shadowBorderRadius = 14,
    shadowTopLeftBorderRadius,
    shadowTopRightBorderRadius,
    shadowBottomLeftBorderRadius,
    shadowBottomRightBorderRadius,

    shadowColor = "#636363",
    shadowDisplayAnimate = "none",

    onPress,
    onPressIn,
    onPressOut,
    onLayout
}) => {
    const transitionContainerY = useRef(new Animated.Value(0));
    const transitionContainerX = useRef(new Animated.Value(0));
    const transitionShadowY = useRef(new Animated.Value(shadowDisplayAnimate === "slide" ? 0 : moveByY));
    const transitionShadowX = useRef(new Animated.Value(shadowDisplayAnimate === "slide" ? 0 : moveByX));
    const opacityShadow = useRef(new Animated.Value(1));
    const opacityContainer = useRef(new Animated.Value(1));
    const [buttonData, setButtonData] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0
    })
    const permanentlyActiveRef = useRef(permanentlyActive)
    permanentlyActiveRef.current = permanentlyActive

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
            }),

            permanentlyActiveRef.current && permanentlyActiveOpacity < 1 && Animated.timing(opacityContainer.current, {
                toValue: permanentlyActiveOpacity,
                duration: durationIn,
                useNativeDriver: true,
            }),
        ]).start()
    }

    const handlePressOut = () => {
        if (permanentlyActiveRef.current) return

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
            }),

            permanentlyActiveOpacity < 1 && Animated.timing(opacityContainer.current, {
                toValue: 1,
                duration: durationOut,
                useNativeDriver: true,
            }),
        ]).start()
    }

    useEffect(() => {
        return () => {
            transitionContainerY.current.stopAnimation();
            transitionContainerX.current.stopAnimation();
            transitionShadowY.current.stopAnimation();
            transitionShadowX.current.stopAnimation();
            opacityShadow.current.stopAnimation();
            opacityContainer.current.stopAnimation();
        };
    }, []);

    useEffect(() => {
        if (buttonData.width !== 0 && shadowDisplayAnimate === "slide") {
            Animated.parallel([
                moveByY !== 0 && Animated.timing(transitionShadowY.current, {
                    toValue: moveByY,
                    duration: durationOut,
                    useNativeDriver: true,
                }),
                moveByX !== 0 && Animated.timing(transitionShadowX.current, {
                    toValue: moveByX,
                    duration: durationOut,
                    useNativeDriver: true,
                })
            ]).start()
        }
    }, [buttonData])

    useEffect(() => {
        if (permanentlyActive === null) return

        if (permanentlyActive) handlePressIn()
        else handlePressOut()
    }, [permanentlyActive])

    let ButtonComponent = null

    if (type === "touchable") ButtonComponent = TouchableOpacity
    else if (type === "default") ButtonComponent = Pressable

    return (
            <Animated.View
                style={[
                    size === "full" && {width: "100%"},
                    styleContainer,
                    {
                        opacity: opacityContainer.current,
                        transform: [
                            {translateY: transitionContainerY.current},
                            {translateX: transitionContainerX.current}
                        ]
                    }
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
                            backgroundColor: SHADOW_COLORS[shadowColor] ? SHADOW_COLORS[shadowColor] : shadowColor,
                            borderTopLeftRadius: typeof shadowTopLeftBorderRadius !== "undefined" ? shadowTopLeftBorderRadius : shadowBorderRadius,
                            borderTopRightRadius: typeof shadowTopRightBorderRadius !== "undefined" ? shadowTopRightBorderRadius : shadowBorderRadius,
                            borderBottomLeftRadius: typeof shadowBottomLeftBorderRadius !== "undefined" ? shadowBottomLeftBorderRadius : shadowBorderRadius,
                            borderBottomRightRadius: typeof shadowBottomRightBorderRadius !== "undefined" ? shadowBottomRightBorderRadius : shadowBorderRadius,
                            opacity: opacityShadow.current,

                            transform: [
                                {translateY: transitionShadowY.current},
                                {translateX: transitionShadowX.current},
                            ]
                        }}
                    />

                    <ButtonComponent
                        ref={refButton}
                        activeOpacity={activeOpacity}
                        style={[size === "full" && {width: "100%"}, styleButton]}
                        onLayout={(e) => {
                            if (onLayout) onLayout(e)

                            if (buttonData.height === 0 || buttonData.height !== e.nativeEvent.layout.height) {
                                setButtonData({
                                    height: e.nativeEvent.layout.height,
                                    width: e.nativeEvent.layout.width,
                                    x: e.nativeEvent.layout.x,
                                    y: e.nativeEvent.layout.y
                                })
                            }
                        }}
                        onPressIn={(event) => {
                            if (disable) return

                            handlePressIn()

                            if (onPressIn) {
                                onPressIn(event)
                            }
                        }}
                        onPressOut={(event) => {
                            if (disable) return

                            handlePressOut()

                            if (onPressOut) {
                                onPressOut(event)
                            }
                        }}
                        onPress={(event) => {
                            if (disable) return

                            if (onPress) onPress(event)
                        }}
                    >
                        {children}
                    </ButtonComponent>
                </View>
            </Animated.View>
    );
})

