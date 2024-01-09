import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import {useAuth} from "../screens/ui/AuthProvider";
import axios from "axios";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";

export default function LoginScreen({navigation}) {
    const [PressSignIn, setPressSignIn] = useState(false);
    const [isPressGoogleProfile, setIsPressGoogleProfile] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({username: "", password: ""})

    const [loader, setLoader] = useState(false)

    // Auth
    const {isAuthenticated, login, getUserToken} = useAuth();

    useEffect(() => {
        if (isAuthenticated()) navigation.navigate("MainTabNavigator")
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

            navigation.navigate('MainTabNavigator')
        } else {
            setLoader(true)

            axios.post("https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/user_login.php", {
                ...userData,
                token: getUserToken()
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
                .then(async res => {
                    setLoader(false)

                    await new Promise(resolve => setTimeout(resolve, 100))

                    const data = res.data

                    if (data.success) {
                        login(data.userData)

                        navigation.navigate('MainTabNavigator')
                    } else {
                        Toast.show({
                            type: "error",
                            text1: data.message
                        });
                    }
                })
                .catch(() => setLoader(false))
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
            <TouchableOpacity
                style={[globalCss.button, PressSignIn ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
                onPressIn={() => setPressSignIn(true)}
                onPressOut={() => setPressSignIn(false)}
                onPress={handleLogin}
                activeOpacity={1}
            >
                <Text style={[globalCss.buttonText, globalCss.bold]}>ВХОД</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("PasswordScreen")}>
                <Text style={[globalCss.link, globalCss.bold]}>ЗАБЫЛИ ПАРОЛЬ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("ChangePasswordScreen")}>
                <Text style={[globalCss.link, globalCss.bold]}>change password</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    globalCss.button,
                    isPressGoogleProfile
                        ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
                        : globalCss.buttonBlue,
                ]}
                onPressIn={() => setIsPressGoogleProfile(true)}
                onPressOut={() => setIsPressGoogleProfile(false)}
                onPress={() => navigation.navigate("IntroductionScreen")}
                activeOpacity={1}
            >
                <Text style={[globalCss.buttonText, globalCss.bold]}>ВОЙТИ ЧЕРЕЗ GOOGLE</Text>
            </TouchableOpacity>
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
