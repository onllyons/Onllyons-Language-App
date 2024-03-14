import globalCss from "../../css/globalCss";
import {Platform, StyleSheet, Text} from "react-native";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import React, {useEffect, useRef} from "react";
import Toast from "react-native-toast-message";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../../utils/Requests";
import {login} from "../../providers/AuthProvider";
import {useStore} from "../../providers/StoreProvider";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import {useNavigation} from "@react-navigation/native";

const CLIENT_ID = '975364175854-m47vlh1uomkpscbuhq9776f97ei3bshu.apps.googleusercontent.com';
const REDIRECT_URI = "https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/user/google_login.php"

const useGoogleAuth = () => {
    const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

    const [request, response, promptAsync] = AuthSession.useAuthRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        prompt: AuthSession.Prompt.Login,
        scopes: [
            "email",
            "profile"
        ],
    }, discovery);

    return {request, response, promptAsync};
};

export const GoogleLogin = ({setLoader}) => {
    const navigation = useNavigation()
    const {initFirstData} = useStore()
    const {promptAsync, request} = useGoogleAuth();
    const codeVerifier = useRef(0)
    const googleAuthProcess = useRef(false)

    if (request && request.codeVerifier) codeVerifier.current = request.codeVerifier

    // Deep linking
    useEffect(() => {
        const subscription = Linking.addEventListener("url", ({url}) => handleUrl(url))

        const handleUrl = url => {
            const parsed = Linking.parse(url)

            if (parsed.path === "google-login" || parsed.hostname === "google-login") {
                googleAuth(parsed.queryParams.code)
            }
        }

        // Отписка от событий
        return () => subscription.remove();
    }, []);

    const googleAuth = (code) => {
        if (googleAuthProcess.current) return

        setLoader(true)
        googleAuthProcess.current = true

        sendDefaultRequest(`${SERVER_AJAX_URL}/user/google_auth_user.php`,
            {
                code: code,
                codeVerifier: codeVerifier.current
            },
            navigation,
            {success: false}
        )
            .then(async data => {
                await login(data.userData, data.tokens)

                if (Platform.OS === "ios") {
                    setLoader(false)
                } else {
                    setTimeout(() => setLoader(false), 50)
                }

                try {
                    await initFirstData(false, true)

                    googleAuthProcess.current = false
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabNavigator' }],
                    });
                } catch (e) {}
            })
            .catch(() => {
                setTimeout(() => setLoader(false), 1)
                googleAuthProcess.current = false

                Toast.show({
                    type: "error",
                    text1: "Ошибка авторизации"
                })
            })
    }

    const handleGoogleLogin = () => {
        promptAsync()
            .then(data => {
                if (!data.params.code) {
                    if (Platform.OS === "ios") throw new Error()
                    return
                }

                googleAuth(data.params.code)
            })
            .catch(() => {

                if (Platform.OS !== "ios") return

                Toast.show({
                    type: "error",
                    text1: "Ошибка авторизации"
                })
            })
    }

    return (
        <AnimatedButtonShadow
            styleButton={[
                styles.buttonSignIn,
                globalCss.buttonWhite,
            ]}
            onPress={handleGoogleLogin}
            size={"full"}
            shadowColor={"#e0e0e0"}
        >
            <Text style={[globalCss.buttonTextGray, globalCss.textUpercase]}>ВОЙТИ ЧЕРЕЗ GOOGLE</Text>
        </AnimatedButtonShadow>
    )
}

const styles = StyleSheet.create({
    buttonSignIn:{
        width: "100%",
        paddingVertical: "4%",
        alignItems: "center",
        borderRadius: 13,
        marginBottom: "4.4%",
        borderColor: '#e0e0e0',
        borderTopWidth: 2.1,
        borderLeftWidth: 2.1,
        borderRightWidth: 2.1,
        borderBottomWidth: 2.1,
    },
})