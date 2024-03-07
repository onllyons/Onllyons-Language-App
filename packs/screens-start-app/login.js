import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Keyboard} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import {isAuthenticated, login} from "../providers/AuthProvider";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

import * as AuthSession from 'expo-auth-session';
import {useStore} from "../providers/StoreProvider";
import * as Linking from "expo-linking";

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

export default function LoginScreen({navigation}) {
    const {initFirstData} = useStore()
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({username: "", password: ""})
    const [loader, setLoader] = useState(false)
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

    useEffect(() => {
        if (isAuthenticated()) navigation.navigate("MainTabNavigator", {screen: "MenuCourseLesson"})
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

                setLoader(false)

                await new Promise(resolve => setTimeout(resolve, 350))

                await initFirstData(true, true)

                googleAuthProcess.current = false
                navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
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

    const handleLogin = () => {
        if (isAuthenticated()) {
            Toast.show({
                type: "error",
                text1: "Вы уже авторизированы"
            });

            navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
        } else {
            Keyboard.dismiss()

            setLoader(true)

            sendDefaultRequest(`${SERVER_AJAX_URL}/user/user_login.php`,
                {...userData},
                navigation,
                {success: false}
            )
                .then(async data => {
                    await login(data.userData, data.tokens)
                    setLoader(false)
                    await new Promise(resolve => setTimeout(resolve, 350))

                    await initFirstData(true, true)

                    navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
                })
                .catch(() => {
                    setTimeout(() => setLoader(false), 1)
                })
        }
    }

    return (
        <View style={styles.container}>
            <Loader visible={loader}/>

            <View style={[styles.inputView, styles.inputContainer1]}>
                <TextInput
                    placeholder="login"
                    placeholderTextColor="#a5a5a5"
                    autoComplete={"username"}
                    textContentType={"username"}
                    autoCapitalize="none"
                    style={globalCss.input}
                    onChangeText={val => setUserData(prev => ({...prev, username: val}))}
                    value={userData.username}
                />
            </View>
            <View style={[styles.inputView, styles.inputContainer2]}>
                <TextInput
                    placeholder="password"
                    autoComplete={"password"}
                    textContentType={"password"}
                    placeholderTextColor="#a5a5a5"
                    autoCapitalize="none"
                    style={[globalCss.input, styles.inputPassword]}
                    secureTextEntry={!showPassword}
                    onChangeText={val => setUserData(prev => ({...prev, password: val}))}
                    value={userData.password}
                />
                <TouchableOpacity style={styles.faEyefaEyeSlash} onPress={togglePasswordVisibility}>
                    <Text style={styles.buttonText}>
                        {showPassword
                            ? <FontAwesomeIcon icon={faEye} size={20} style={globalCss.link}/>
                            : <FontAwesomeIcon icon={faEyeSlash} size={20} style={globalCss.link}/>}
                    </Text>
                </TouchableOpacity>
            </View>
            <AnimatedButtonShadow
                styleButton={[globalCss.button, globalCss.buttonGreen]}
                shadowColor={"green"}
                size={"full"}
                onPress={handleLogin}
            >
                <Text style={[globalCss.buttonText, globalCss.bold]}>ВХОД</Text>
            </AnimatedButtonShadow>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("PasswordScreen")}>
                <Text style={[globalCss.link, globalCss.bold]}>ЗАБЫЛИ ПАРОЛЬ?</Text>
            </TouchableOpacity>
            <AnimatedButtonShadow
                styleButton={[
                    globalCss.button,
                    globalCss.buttonBlue,
                ]}
                onPress={handleGoogleLogin}
                size={"full"}
                shadowColor={"blue"}
            >
                <Text style={[globalCss.buttonText, globalCss.bold]}>ВОЙТИ ЧЕРЕЗ GOOGLE</Text>
            </AnimatedButtonShadow>
            <Text style={styles.termsText}>
                Выполняя вход в аккаунт Onllyons Language, вы соглашаетесь с
                нашими <Text style={globalCss.bold}>Условиями</Text> и
                <Text style={globalCss.bold}> Политикой конфиденциальности</Text>.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        padding: 20,
    },
    faEyefaEyeSlash: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '15%',
        marginRight: '6%',
    },
    forgotPassword: {
        marginBottom: '3%'
    },
    inputView: {
        borderBottomWidth: 2.1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        borderLeftWidth: 2.1,
        borderRightWidth: 2.1,
        paddingLeft: 12,
    },
    inputContainer1: {
        borderTopWidth: 2.1,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        paddingBottom: 17,
        paddingTop: 17,
        paddingRight: 12,
    },
    inputContainer2: {
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        marginBottom: 20,
    },
    inputPassword: {
        paddingTop: 17,
        paddingBottom: 17,
        paddingRight: 0,
    },
    termsText: {
        color: '#636363',
        textAlign: 'center',
        marginTop: '2%',
        fontSize: 16,
    },
});
