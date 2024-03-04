import {View, StyleSheet, Dimensions, Text} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    interpolateColor, runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle, useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import React, {useRef} from "react";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CUBE_SIZE = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_WIDTH * .8 : SCREEN_HEIGHT * .8;
const POSITION_TRIGGER = (SCREEN_HEIGHT / 2 - CUBE_SIZE / 2) * .7

export const AnswerButton = ({
    text,
    isAnswerSubmitted,
    isAnswerCorrect,
    isBlocked,
    checkBlocked,
    handleAnswerSelect
}) => {
    const translateY = useSharedValue(0);
    let allowHaptics = useRef(true)

    const vibration = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            if (isBlocked) return runOnJS(checkBlocked)()

            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            if (isBlocked) return runOnJS(checkBlocked)()

            const translateTo = ctx.startY + event.translationY

            translateY.value = ctx.startY + event.translationY;

            // Vibration
            if (allowHaptics.current && Math.abs(translateTo) >= POSITION_TRIGGER) {
                runOnJS(vibration)()
                allowHaptics.current = false
            } else if (!allowHaptics.current && Math.abs(translateTo) <= POSITION_TRIGGER / 3) {
                allowHaptics.current = true
            }
        },
        onEnd: (event, ctx) => {
            if (isBlocked) return runOnJS(checkBlocked)()

            const translateEnd = ctx.startY + event.translationY

            if (Math.abs(translateEnd) >= POSITION_TRIGGER) runOnJS(handleAnswerSelect)(translateEnd < 0)

            translateY.value = withSpring(0);
        }
    });

    const backgroundColor = useDerivedValue(() => {
        return interpolateColor(
            translateY.value,
            [-POSITION_TRIGGER, -(POSITION_TRIGGER / 3), POSITION_TRIGGER / 3, POSITION_TRIGGER],
            ['#81b344', 'white', 'white', '#ca3431']
        );
    }, [text, isAnswerSubmitted]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            backgroundColor: backgroundColor.value,
        };
    });

    return (
        <View style={[styles.container, isAnswerSubmitted && styles.containerInactive]}>
            <PanGestureHandler enabled={!isAnswerSubmitted} onGestureEvent={panGestureEvent}>
                <Animated.View style={[styles.cube, animatedStyle, isAnswerSubmitted && (isAnswerCorrect ? styles.correct : styles.incorrect)]}>
                    <Text style={styles.headerText}>{text}</Text>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerInactive: {
        pointerEvents: "none",
        opacity: .5
    },
    cube: {
        width: CUBE_SIZE,
        height: CUBE_SIZE,
        backgroundColor: 'white',
        borderColor: "#e0e0e0",
        alignSelf: 'center',
        alignItem: 'center',
        justifyContent: 'center',
        borderWidth: 2.1,
        borderRadius: 14,
    },
    correct: {
        borderColor: "#81b344",
    },
    incorrect: {
        borderColor: "#ca3431",
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
        margin: 15
    },
});