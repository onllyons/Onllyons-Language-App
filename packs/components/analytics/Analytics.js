import {useNavigation} from "@react-navigation/native";
import {useCallback, useEffect, useRef} from "react";
import * as Device from "expo-device";
import {Dimensions} from "react-native";
import axios from "axios";
import {getTokens, getUser} from "../../providers/AuthProvider";
import {SERVER_AJAX_URL} from "../../utils/Requests";

export const Analytics = () => {
    const DELAY_SEND_ANALYTICS = 10 // Seconds

    const navigation = useNavigation();
    const sendAnalyticsTimeout = useRef(null)

    // Analytics

    const analyticsInfo = useRef({
        currentAnalyticId: -1,
        deviceName: Device.deviceName,
        osVersion: Device.osVersion,
        operatingSystem: Device.osName,
        windowWidth: Dimensions.get("window").width,
        language: "ru",
        lastScreen: "",
        lengthStayOnScreen: 0,
        screen: ""
    })

    useEffect(() => {
        navigation.addListener("state", handleNavigationChange)
    }, [navigation]);

    const handleNavigationChange = (state) => {
        if (!state.data.state || !state.data.state.routes) return

        let route = state.data.state.routes[state.data.state.index]

        if (!route) return
        if (route.state && route.state.routes.length > 0) route = route.state.routes[route.state.index]
        if (!route) return

        let nameRoute = route.name

        if (nameRoute === "MainTabNavigator") nameRoute = "MenuCourseLesson"

        if (analyticsInfo.current.screen !== nameRoute) {
            analyticsInfo.current.lengthStayOnScreen = 0
            analyticsInfo.current.currentAnalyticId = -1
        }

        if (!nameRoute) return;

        analyticsInfo.current.screen = nameRoute
        sendAnalytics()
        analyticsInfo.current.lastScreen = nameRoute
    };

    const sendAnalytics = useCallback((plusTime = 0) => {
        if (sendAnalyticsTimeout.current) {
            clearTimeout(sendAnalyticsTimeout.current)
            sendAnalyticsTimeout.current = null
        }

        analyticsInfo.current.lengthStayOnScreen += plusTime

        const userId = getUser().id !== undefined ? getUser().id : -1

        axios.post(`${SERVER_AJAX_URL}/send_analytics.php`, {
            ...analyticsInfo.current,
            tokens: getTokens(),
            userId: userId
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(({data}) => {
                if (data.success && data.id !== undefined) analyticsInfo.current.currentAnalyticId = data.id
            })
            .catch(() => {})

        sendAnalyticsTimeout.current = setTimeout(() => sendAnalytics(DELAY_SEND_ANALYTICS), DELAY_SEND_ANALYTICS * 1000)
    }, [])

    return null
}