import React, {createContext, useCallback, useContext, useRef, useState} from "react";
import {
    Animated,
    Dimensions,
    Pressable, StyleSheet,
    View
} from "react-native";
import {fadeInNav, fadeOutNav} from "./FadeNavMenu";

const AnimatedNavTopContext = createContext("animated nav top context doesnt exists");

export const AnimatedNavTopContainer = ({ children }) => {
    // Nav top Menu

    const {width: windowWidth, height: windowHeight} = Dimensions.get("window");

    const data = useRef({
        heights: {
            navTop: 100,
            navTopArrows: {},
            navTopMenu: {}
        },

        // For animation slide
        animatedPositionNavTopMenus: {},
        // For animation arrows
        animatedPositionNavTopArrows: {},
        // Nav top background
        animatedNavTopBgTranslateX: new Animated.Value(windowWidth),
        animatedNavTopBgOpacity: new Animated.Value(0),

        navTopMenuCallbacks: {},

        // Current opened menu
        openedNavMenu: null
    }).current

    const setStartPosition = useCallback((pos) => {
        data.heights.navTop = pos
    }, [])

    const setAnimatedMenuHeight = useCallback((id, value) => {
        data.heights.navTopMenu[id] = value
    }, [])


    const initAnimatedMenu = useCallback((id, height, callbacks) => {
        if (!data.animatedPositionNavTopMenus[id]) data.animatedPositionNavTopMenus[id] = new Animated.Value(0)

        data.heights.navTopMenu[id] = height
        data.navTopMenuCallbacks[id] = callbacks
    }, [])

    const initAnimatedArrow = useCallback((id, height) => {
        if (!data.animatedPositionNavTopArrows[id]) data.animatedPositionNavTopArrows[id] = new Animated.Value(0)

        data.heights.navTopArrows[id] = height
    }, [])


    const isMenuLoaded = useCallback((id) => {
        return !!data.animatedPositionNavTopMenus[id]
    }, [])


    const getStartPosition = useCallback(() => {
        return data.heights.navTop
    }, [])

    const getAnimatedMenuHeight = useCallback((id) => {
        return data.heights.navTopMenu[id] ? data.heights.navTopMenu[id] : windowHeight
    }, [])

    const getAnimatedArrowHeight = useCallback((id) => {
        return data.heights.navTopArrows[id] ? data.heights.navTopArrows[id] : windowHeight
    }, [])

    const getAnimatedMenuCallbacks = useCallback((id) => {
        return data.navTopMenuCallbacks[id] ? data.navTopMenuCallbacks[id] : {onOpen: () => {}, onClose: () => {}}
    }, [])

    const getAnimatedMenuY = useCallback((id) => {
        return data.animatedPositionNavTopMenus[id] ? data.animatedPositionNavTopMenus[id] : new Animated.Value(0)
    }, [])

    const getAnimatedArrowY = useCallback((id) => {
        return data.animatedPositionNavTopArrows[id] ? data.animatedPositionNavTopArrows[id] : new Animated.Value(0)
    }, [])

    const getAnimatedBgX = useCallback(() => {
        return data.animatedNavTopBgTranslateX
    }, [])

    const getAnimatedBgOpacity = useCallback(() => {
        return data.animatedNavTopBgOpacity
    }, [])

    // Bug on Android
    const [first, setFirst] = useState(false)

    // Open/close nav menu by id
    const toggleNavTopMenu = (id = null) => {
        if (!first) setFirst(true)

        if (id === null) {
            if (data.openedNavMenu !== null) id = data.openedNavMenu
            else return
        }

        if (!isMenuLoaded(id)) return

        if (data.openedNavMenu !== null && data.openedNavMenu !== id) {
            getAnimatedMenuCallbacks(data.openedNavMenu).onClose()
            getAnimatedMenuCallbacks(id).onOpen()

            Animated.parallel([
                Animated.spring(getAnimatedMenuY(data.openedNavMenu), {
                    toValue: 0,
                    duration: 500,
                    bounciness: 0,
                    useNativeDriver: true,
                }),
                data.animatedPositionNavTopArrows[data.openedNavMenu] && Animated.spring(getAnimatedArrowY(data.openedNavMenu), {
                    toValue: 0,
                    duration: 500,
                    bounciness: 0,
                    useNativeDriver: true,
                }),
                Animated.spring(getAnimatedMenuY(id), {
                    toValue: getAnimatedMenuHeight(id) - 2 + getStartPosition(),
                    duration: 500,
                    bounciness: 0,
                    useNativeDriver: true,
                }),
                data.animatedPositionNavTopArrows[id] && Animated.spring(getAnimatedArrowY(id), {
                    toValue: -getAnimatedArrowHeight(id) + 2,
                    bounciness: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            if (data.openedNavMenu === id) getAnimatedMenuCallbacks(id).onClose()
            else getAnimatedMenuCallbacks(id).onOpen()

            Animated.parallel([
                Animated.spring(getAnimatedMenuY(id), {
                    toValue: data.openedNavMenu === id ? 0 : getAnimatedMenuHeight(id) - 2 + getStartPosition(),
                    bounciness: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                data.animatedPositionNavTopArrows[id] && Animated.spring(getAnimatedArrowY(id), {
                    toValue: data.openedNavMenu === id ? 0 : -getAnimatedArrowHeight(id) + 2,
                    bounciness: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();

            Animated.timing(getAnimatedBgX(), {
                toValue: data.openedNavMenu === id ? windowWidth : 0,
                duration: 1,
                delay: data.openedNavMenu === id ? 500 : 0,
                useNativeDriver: true,
            }).start()
            Animated.timing(getAnimatedBgOpacity(), {
                toValue: data.openedNavMenu === id ? 0 : 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }

        // Fade bottom nav menu
        if (data.openedNavMenu === id) fadeOutNav()
        else if (data.openedNavMenu === null) fadeInNav(() => toggleNavTopMenu())

        data.openedNavMenu = data.openedNavMenu === id ? null : id
    };

    return (
        <AnimatedNavTopContext.Provider value={{
            setStartPosition,
            toggleNavTopMenu,

            // Used inside of animated nav components
            getAnimatedBgOpacity,
            getAnimatedBgX,
            getAnimatedArrowHeight,
            getAnimatedMenuY,
            getAnimatedArrowY,
            initAnimatedMenu,
            initAnimatedArrow,
            setAnimatedMenuHeight
        }}>
            {children}
            <AnimatedNavTopBg/>
        </AnimatedNavTopContext.Provider>
    );
};

export const useAnimatedNavTop = () => {
    return useContext(AnimatedNavTopContext);
};

export const AnimatedNavTopArrow = ({children, id}) => {
    const {initAnimatedArrow, getAnimatedArrowY, getAnimatedArrowHeight} = useAnimatedNavTop()

    return (
        <Animated.View
            style={{
                ...styles.navTopArrowView,
                bottom: -getAnimatedArrowHeight(id),
                transform: [{translateY: getAnimatedArrowY(id)}]
            }}
            onLayout={event => initAnimatedArrow(id, event.nativeEvent.layout.height)}
        >
            {children}
        </Animated.View>
    )
}

export const AnimatedNavTop = ({children, id, onOpen, onClose}) => {
    const {initAnimatedMenu, getAnimatedMenuY} = useAnimatedNavTop()

    const callbacks = {
        onOpen: onOpen ? onOpen : () => {},
        onClose: onClose ? onClose : () => {}
    }

    return (
        <Animated.View
            style={{
                ...styles.navTopModal,
                bottom: "100%",
                transform: [{translateY: getAnimatedMenuY(id)}]
            }}
            onLayout={event => initAnimatedMenu(id, event.nativeEvent.layout.height, callbacks)}
        >
            <View style={styles.navTopModalIn}>
                {children}
            </View>
        </Animated.View>
    )
}

export const AnimatedNavTopBg = React.memo(() => {
    const {toggleNavTopMenu, getAnimatedBgX, getAnimatedBgOpacity} = useAnimatedNavTop()

    return (
        <Animated.View
            style={{
                ...styles.navTopBg,
                opacity: getAnimatedBgOpacity(),
                transform: [{translateX: getAnimatedBgX()}]
            }}
        >
            <Pressable style={{width: "100%", height: "100%"}} onPress={() => toggleNavTopMenu()}></Pressable>
        </Animated.View>
    )
})

const styles = StyleSheet.create({
    navTopArrowView: {
        position: "absolute"
    },
    navTopModal: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 3,
    },
    navTopModalIn: {
        padding: 0,
        width: "100%",
        borderTopWidth: 2.5,
        borderTopColor: "#ebebeb",
    },
    navTopBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
})