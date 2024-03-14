import {Platform, StyleSheet, Text} from "react-native";
import React, {useRef} from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import Toast from "react-native-toast-message";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../../utils/Requests";
import {useNavigation} from "@react-navigation/native";
import {useStore} from "../../providers/StoreProvider";
import {login} from "../../providers/AuthProvider";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import globalCss from "../../css/globalCss";
import {getDeviceInfo} from "../../utils/Utls";

export const AppleLogin = ({setLoader}) => {
    const {initFirstData} = useStore()
    const navigation = useNavigation()
    const appleAuthProcess = useRef(false)

    const handleAppleAuth = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            setLoader(true)

            const data = await sendDefaultRequest(`${SERVER_AJAX_URL}/user/apple_auth_user.php`,
                {...credential, dataIp: getDeviceInfo()},
                navigation,
                {success: false}
            )

            await login(data.userData, data.tokens)

            if (Platform.OS === "ios") {
                setLoader(false)
            } else {
                setTimeout(() => setLoader(false), 50)
            }

            try {
                await initFirstData(true, true)

                appleAuthProcess.current = false
                navigation.reset({
                    index: 0,
                    routes: [{name: 'MainTabNavigator'}],
                });
            } catch (e) {
            }
        } catch (e) {
            appleAuthProcess.current = false

            if (typeof e === "object" && e.code === 'ERR_REQUEST_CANCELED') {
                Toast.show({
                    type: "error",
                    text1: "Авторизация отменена"
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "Ошибка авторизации"
                });
            }

            setTimeout(() => setLoader(false), 50)
        }
    }

    return (
        <AnimatedButtonShadow
            styleButton={[
                styles.buttonSignIn,
                globalCss.buttonWhite,
            ]}
            size={"full"}
            shadowColor={"#e0e0e0"}
            onPress={handleAppleAuth}
        >
            <Text style={[globalCss.buttonTextGray, globalCss.textUpercase]}>ВОЙТИ ЧЕРЕЗ APPLE</Text>
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
    }
})