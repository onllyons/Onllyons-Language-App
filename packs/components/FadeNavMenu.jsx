import {Animated, Pressable} from "react-native";

const opacity = new Animated.Value(0);
const translateY = new Animated.Value(100);

let callbackOnTap = null

export const fadeOutNav = () => {
    Animated.parallel([
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }),
        Animated.timing(translateY, {
            toValue: 100,
            duration: 0,
            delay: 500,
            useNativeDriver: true,
        })
    ]).start();
}

export const fadeInNav = (callback = null) => {
    Animated.parallel([
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
        Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        })
    ]).start();

    callbackOnTap = callback
}

export const FadeNavMenu = () => {
    return (
        <Animated.View style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "11.02%",
            minHeight: 90,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            transform: [{translateY: translateY}],
            opacity: opacity
        }}>
            <Pressable style={{width: "100%", height: "100%"}} onPress={() => {
                if (callbackOnTap) callbackOnTap()
            }}></Pressable>
        </Animated.View>
    )
}