import React, {useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import globalCss from '../css/globalCss';
import axios from "axios";
import {useAuth} from "../screens/ui/AuthProvider";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";

export default function PasswordScreen() {
    const [email, setEmail] = useState("");
    const [pressSignIn, setPressSignIn] = useState(false);

    const [loader, setLoader] = useState(false)

    const {getUserToken} = useAuth()

    const handleRequestPassword = () => {
        setLoader(true)

        axios.post("https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/send_reset_mail.php", {
            email: email,
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
                } else {
                    Toast.show({
                        type: "error",
                        text1: data.message
                    });
                }
            })
            .catch(() => setLoader(false))
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Loader visible={loader}/>

                <View style={[styles.inputView, styles.inputContainer1]}>
                    <TextInput
                        placeholder="Адрес эл. почты"
                        placeholderTextColor="#a5a5a5"
                        style={globalCss.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        globalCss.button,
                        pressSignIn ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen,
                    ]}
                    onPressIn={() => setPressSignIn(true)}
                    onPressOut={() => setPressSignIn(false)}
                    onPress={handleRequestPassword}
                >
                    <Text style={[globalCss.buttonText, globalCss.bold, globalCss.textUppercase]}>Получить ссылку</Text>
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
        borderRadius: 14,
        paddingBottom: 17,
        paddingTop: 17,
        paddingRight: 12,
        marginBottom: 12,
    },

});
