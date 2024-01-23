import React, {useEffect, useState} from "react";
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
import {isAuthenticated} from "../providers/AuthProvider";
import Loader from "../components/Loader";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";

export default function PasswordScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [pressSignIn, setPressSignIn] = useState(false);

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) navigation.navigate("MainTabNavigator")
    }, []);

    const handleRequestPassword = () => {
        setLoader(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/send_reset_mail.php`,
            {email: email},
            navigation
        )
            .catch(() => {})
            .finally(() => setTimeout(() => setLoader(false), 1))
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
