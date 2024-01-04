import React, {useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import {useAuth} from "../screens/ui/AuthProvider";
import {useAlertLoading} from "../screens/ui/AlertLoadingProvider";
import {useAlertConfirm} from "../screens/ui/AlertConfirmPrivider";
import axios from "axios";

export default function LoginScreen({navigation}) {
    const [PressSignIn, setPressSignIn] = useState(false);
    const [isPressGoogleProfile, setIsPressGoogleProfile] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({username: "", password: ""})

    // Auth
    const {isAuthenticated, getUser, login, logout} = useAuth();
    const {hideAlertLoading, showAlertLoading} = useAlertLoading()
    const {hideAlertConfirm, showAlertConfirm, setAlertConfirm} = useAlertConfirm()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
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
                onPress={() => {
                    if (isAuthenticated()) {
                        setAlertConfirm({
                            title: "Вы уже авторизированы",
                            message: "Вы будете перенаправлены на главную",
                            errorStyle: true,
                            confirmBtn: {
                                callback: () => navigation.navigate('Main')
                            }
                        })
                        showAlertConfirm()
                    } else {
                        showAlertLoading()

                        axios.post("https://language.onllyons.com/ru/ru-en/packs/assest/user-signup/user_login.php", {...userData, fromMobile: true}, {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        })
                            .then(res => {
                                const data = res.data

                                if (data.success) {
                                    login(data.user)

                                    setAlertConfirm({
                                        title: "Вы успешно авторизированы",
                                        message: "Вы будете перенаправлены на главную",
                                        confirmBtn: {
                                            callback: () => navigation.navigate('Main')
                                        }
                                    })
                                    showAlertConfirm()
                                } else {
                                    setAlertConfirm({
                                        title: "Ошибка",
                                        errorStyle: true,
                                        message: data.error_message
                                    })
                                    showAlertConfirm()
                                }
                            })
                            .finally(() => hideAlertLoading())
                    }
                }}
                activeOpacity={1}
            >
                <Text style={[globalCss.buttonText, globalCss.bold]}>ВХОД</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("Забыли пароль?")}>
                <Text style={[globalCss.link, globalCss.bold]}>ЗАБЫЛИ ПАРОЛЬ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("Изменить пароли")}>
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
                onPress={() => navigation.navigate("Introduction")}
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
