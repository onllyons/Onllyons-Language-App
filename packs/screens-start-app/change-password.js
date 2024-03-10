import React, {useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';

import globalCss from '../css/globalCss';
import Loader from "../components/Loader";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
// icons
import {faArrowLeft, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

export default function ChangePasswordScreen({navigation}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    })

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleChangePassword = () => {
        setLoader(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/user/change_password.php`,
            {...data},
            navigation
        )
            .then(() => {})
            .catch(() => {
            })
            .finally(() => setTimeout(() => setLoader(false), 1))
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={styles.container}>
            <View style={styles.containerWhite}>

                <View style={globalCss.navTabUser}>
                    <TouchableOpacity
                        style={globalCss.itemNavTabUserBtnBack}
                        onPress={() => navigation.navigate("UserData")}
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            size={30}
                            style={globalCss.blue}
                        />
                    </TouchableOpacity>
                    <View style={globalCss.itemNavTabUserTitleCat}>
                        <Text style={globalCss.dataCategoryTitle}>Профиль</Text>
                    </View>
                </View>


                <View style={styles.containerGeneral}>
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

                    <AnimatedButtonShadow
                        styleButton={[globalCss.button, globalCss.buttonGreen]}
                        onPress={handleChangePassword}
                        shadowColor={"green"}
                        size={"full"}
                    >
                        <Text style={[globalCss.buttonText, globalCss.bold, globalCss.textUpercase]}>Сохранить
                            пароль</Text>
                    </AnimatedButtonShadow>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    containerWhite: {
        backgroundColor: 'white',
        flex: 1,
    },
    containerGeneral: {
        padding: '5%',
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
