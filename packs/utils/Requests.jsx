import axios from "axios";
import Toast from "react-native-toast-message";
import {getTokens, logout, setTokens} from "../providers/AuthProvider";

export const SERVER_URL = "https://www.language.onllyons.com"
export const SERVER_AJAX_URL = `${SERVER_URL}/ru/ru-en/backend/mobile_app/ajax`

export const sendDefaultRequest = async (url, dataObj, navigation = null, showOptions = {error: true, success: true}) => {
    showOptions = {error: true, success: true, ...showOptions}

    try {
        const {data} = await axios.post(url, {
            tokens: getTokens(),
            ...dataObj
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })

        if (data.success !== undefined) {
            if (data.success) {
                if (showOptions.success) {
                    Toast.show({
                        type: "success",
                        text1: data.message
                    });
                }

                if (typeof data.tokens === "object") setTokens(data.tokens)

                return Promise.resolve(data);
            } else {
                if (data.tokensError !== undefined && data.tokensError) {
                    await logout()

                    if (navigation) navigation.navigate("StartPageScreen")
                }

                if (showOptions.error) {
                    Toast.show({
                        type: "error",
                        text1: data.message
                    });
                }

                return Promise.reject(data);
            }
        }
    } catch (err) {
        if (showOptions.error) {
            Toast.show({
                type: "error",
                text1: "Произошла ошибка, попробуйте позже"
            });
        }

        return Promise.reject(err);
    }

    return Promise.reject({success: false, message: "Произошла ошибка, попробуйте позже"});
}
