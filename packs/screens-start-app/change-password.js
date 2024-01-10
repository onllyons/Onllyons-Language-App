import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import Toast from "react-native-toast-message";
import axios from "axios";
import {useAuth} from "../screens/ui/AuthProvider";
import Loader from "../components/Loader";

export default function ChangePasswordScreen({navigation}) {
    const [PressSignIn, setPressSignIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    })

    const {getUser, isAuthenticated, getUserToken} = useAuth();

    useEffect(() => {
        if (!isAuthenticated()) navigation.navigate("StartPageScreen")
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleChangePassword = () => {
        if (!isAuthenticated()) {
            Toast.show({
                type: "error",
                text1: "Вы не авторизированы"
            });
        } else {
            setLoader(true)

            console.log(data)
            axios.post("https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/change_password.php", {
                ...data,
                userId: getUser().id,
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
                        Toast.show({
                            type: "success",
                            text1: data.message
                        });

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Loader visible={loader}/>
                <View style={[styles.inputView, styles.inputContainer1]}>
                    <TextInput
                        placeholder="Старый пароль"
                        placeholderTextColor="#a5a5a5"
                        value={data.current_password}
                        secureTextEntry={!showPassword}
                        onChangeText={val => setData(prev => ({...prev, current_password: val}))}
                        style={[globalCss.input, styles.inputPassword]}
                    />
                    <TouchableOpacity style={styles.faEyefaEyeSlash} onPress={togglePasswordVisibility}>
                        <Text style={styles.buttonText}>
                            {showPassword
                                ? <FontAwesomeIcon icon={faEye} size={20} style={globalCss.link}/>
                                : <FontAwesomeIcon icon={faEyeSlash} size={20} style={globalCss.link}/>}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.inputView, styles.inputContainer2]}>
                    <TextInput
                        placeholder="Новый пароль"
                        placeholderTextColor="#a5a5a5"
                        value={data.new_password}
                        secureTextEntry={!showNewPassword}
                        onChangeText={val => setData(prev => ({...prev, new_password: val}))}
                        style={[globalCss.input, styles.inputPassword]}
                    />
                    <TouchableOpacity style={styles.faEyefaEyeSlash} onPress={toggleNewPasswordVisibility}>
                        <Text style={styles.buttonText}>
                            {showNewPassword
                                ? <FontAwesomeIcon icon={faEye} size={20} style={globalCss.link}/>
                                : <FontAwesomeIcon icon={faEyeSlash} size={20} style={globalCss.link}/>}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.inputView, styles.inputContainer3]}>
                    <TextInput
                        placeholder="Повторите пароль"
                        placeholderTextColor="#a5a5a5"
                        style={[globalCss.input, styles.inputPassword]}
                        secureTextEntry={!showNewPassword}
                        value={data.confirm_password}
                        onChangeText={val => setData(prev => ({...prev, confirm_password: val}))}
                    />
                    <TouchableOpacity style={styles.faEyefaEyeSlash} onPress={toggleNewPasswordVisibility}>
                        <Text style={styles.buttonText}>
                            {showNewPassword
                                ? <FontAwesomeIcon icon={faEye} size={20} style={globalCss.link}/>
                                : <FontAwesomeIcon icon={faEyeSlash} size={20} style={globalCss.link}/>}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[globalCss.button, PressSignIn ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
                    onPressIn={() => setPressSignIn(true)}
                    onPressOut={() => setPressSignIn(false)}
                    onPress={handleChangePassword}
                    activeOpacity={1}
                >
                    <Text style={[globalCss.buttonText, globalCss.bold, globalCss.textUpercase]}>Сохранить пароль</Text>
                </TouchableOpacity>

            </View>
        </TouchableWithoutFeedback>
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
    },
    inputContainer2: {
        borderTopWidth: 0
    },
    inputContainer3: {
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        marginBottom: 20,
    },
    inputPassword: {
        paddingTop: 17,
        paddingBottom: 17,
        paddingRight: 0,
    },
});
