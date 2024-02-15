import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import {isAuthenticated, login} from "../providers/AuthProvider";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

export default function LoginScreen({navigation}) {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({username: "", password: ""})

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) navigation.navigate("MainTabNavigator", {screen: "MenuCourseLesson"})
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        if (isAuthenticated()) {
            Toast.show({
                type: "error",
                text1: "Вы уже авторизированы"
            });

            navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
        } else {
            setLoader(true)

            sendDefaultRequest(`${SERVER_AJAX_URL}/user_login.php`,
                {...userData},
                navigation,
                {success: false}
            )
                .then(async data => {
                    await login(data.userData, data.tokens)
                    navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
                })
                .catch(() => {})
                .finally(() => setTimeout(() => setLoader(false), 1))
        }
    }

    return (
        <View style={styles.container}>
            <Loader visible={loader}/>

            <View style={[styles.inputView, styles.inputContainer1]}>
                <TextInput
                    placeholder="login"
                    placeholderTextColor="#a5a5a5"
                    style={globalCss.input}
                    onChangeText={val => setUserData(prev => ({...prev, username: val}))}
                    value={userData.username}
                />
            </View>
            <View style={[styles.inputView, styles.inputContainer2]}>
                <TextInput
                    placeholder="password"
                    placeholderTextColor="#a5a5a5"
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
                onPress={() => navigation.navigate("LoginGoogleScreen")}
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
