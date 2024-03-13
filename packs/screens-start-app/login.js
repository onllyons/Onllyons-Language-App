import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Keyboard} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faArrowLeft, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import {isAuthenticated, login} from "../providers/AuthProvider";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

import * as AuthSession from 'expo-auth-session';
import {useStore} from "../providers/StoreProvider";
import * as Linking from "expo-linking";
import {useFocusEffect} from "@react-navigation/native";

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

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated()) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabNavigator' }],
                })
            }
        }, [])
    );

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

                if (Platform.OS === "ios") {
                    setLoader(false)
                } else {
                    setTimeout(() => setLoader(false), 50)
                }

                await initFirstData(true, true)

                googleAuthProcess.current = false
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabNavigator' }],
                });
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

            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabNavigator' }],
            });
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

                    if (Platform.OS === "ios") {
                        setLoader(false)
                    } else {
                        setTimeout(() => setLoader(false), 50)
                    }

                    await initFirstData(true, true)

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabNavigator' }],
                    });
                })
                .catch(() => {
                    setTimeout(() => setLoader(false), 1)
                })
        }
    }

    return (
        <View style={styles.container}>
                <Loader visible={loader}/>

            <View style={globalCss.navTabUser}>
              <TouchableOpacity style={globalCss.itemNavTabUserBtnBack}
                                onPress={() => navigation.goBack()}>
                  <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
              </TouchableOpacity>
              <View style={globalCss.itemNavTabUserTitleCat}>
                  <Text style={globalCss.dataCategoryTitle}>Введите данные</Text>
              </View>
            </View>

            <View style={styles.itemFullContents}>
                <View style={[styles.inputView, styles.inputContainer1]}>
                    <TextInput
                        placeholder="Электронный адрес или имя пользователя"
                        placeholderTextColor="#a5a5a5"
                        autoComplete={"username"}
                        textContentType={"username"}
                        autoCapitalize="none"
                        style={globalCss.input}
                        onChangeText={val => setUserData(prev => ({...prev, username: val}))}
                        value={userData.username}
                    /> 
                </View>
                <View style={[styles.inputView, styles.inputContainer1, styles.inputContainer2]}>
                    <TextInput
                        placeholder="Пароль"
                        autoComplete={"password"}
                        textContentType={"password"}
                        placeholderTextColor="#a5a5a5"
                        autoCapitalize="none"
                        style={globalCss.input}
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
                    <Text style={[globalCss.buttonText, globalCss.bold, globalCss.textUpercase]}>Войти</Text>
                </AnimatedButtonShadow>
                <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("PasswordScreen")}>
                    <Text style={[globalCss.link, globalCss.bold]}>ЗАБЫЛИ ПАРОЛЬ?</Text>
                </TouchableOpacity>

                <View style={styles.fixedBottom}>
                    <View style={styles.fullBottomFixed}>
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

                        <AnimatedButtonShadow
                            styleButton={[
                                styles.buttonSignIn,
                                globalCss.buttonWhite,
                            ]}
                            size={"full"}
                            shadowColor={"#e0e0e0"}
                        >
                            <Text style={[globalCss.buttonTextGray, globalCss.textUpercase]}>ВОЙТИ ЧЕРЕЗ APPLE</Text>
                        </AnimatedButtonShadow>


                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.termsText}>
                            Выполняя вход в аккаунт Onllyons Language, вы соглашаетесь с нашими
                          </Text>
                          <Text style={[styles.termsText, styles.link]} onPress={() => Linking.openURL('https://www.language.onllyons.com/term/')}>
                             Условия использования и
                          </Text>
                          <Text style={[styles.termsText, styles.link]} onPress={() => Linking.openURL('https://www.language.onllyons.com/privacy/')}>
                            Политика использования данных.
                          </Text>
                        </View>
                    </View>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    itemFullContents:{
        width: '100%',
        flex: 1,
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
    link:{
        fontWeight: '700',
        color: "#3ca6ff",
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
        paddingRight: 12,
    },
    inputContainer2: {
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        marginBottom: 20,
        paddingRight: 5,
    },
    termsText: {
        color: '#636363',
        textAlign: 'center',
        fontSize: 16,
    },
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
    fixedBottom:{
        width: '100%',
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        paddingBottom: '12%',
    },
    fullBottomFixed:{
        width: '100%',
    },
});










