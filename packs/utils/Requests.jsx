import axios from "axios";
import Toast from "react-native-toast-message";
import {getTokens, login, logout, setTokens} from "../providers/AuthProvider";

export const SERVER_URL = "https://www.language.onllyons.com"
export const SERVER_AJAX_URL = `${SERVER_URL}/ru/ru-en/backend/mobile_app/ajax`

export const sendDefaultRequest = async (url, dataObj, navigation = null, showOptions = {error: true, success: true}) => {
    showOptions = {error: true, success: true, ...showOptions};

    const formData = new FormData();
    formData.append("tokens", JSON.stringify(getTokens()));

    Object.keys(dataObj).forEach(key => {
        if (typeof dataObj[key] === "object" && dataObj[key]?.type === "image" && dataObj[key]?.uri) {
            // For image
            formData.append(key, {
                uri: dataObj[key].uri,
                type: `image/${getFileTypeFromUri(dataObj[key].uri)}`,
                name: `image.${getFileTypeFromUri(dataObj[key].uri)}`
            });
        } else {
            let data = dataObj[key]

            if (typeof data === "boolean") data = data ? 1 : 0
            else if (typeof dataObj[key] === "object") data = JSON.stringify(dataObj[key])

            formData.append(key, data);
        }
    });

    try {
        const {data} = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Обработка ответа
        if (data.success !== undefined) {
            if (data.success) {
                if (showOptions.success && data.message) {
                    Toast.show({
                        type: "success",
                        text1: data.message
                    });
                }

                if (typeof data.tokens === "object") setTokens(data.tokens);

                return Promise.resolve(data);
            } else {
                if (data.tokensError !== undefined && data.tokensError) {
                    await logout();

                    if (navigation) {
                        console.log("yayaya")
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'StartPageScreen' }],
                        })
                    }
                }

                if (showOptions.error && data.message) {
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
};

export const updateUser = async (navigation = null) => {
    try {
        const response = await sendDefaultRequest(`${SERVER_AJAX_URL}/user/get_user.php`,
            {},
            navigation,
            {success: false, error: false}
        )

        await login(response.user, response.tokens)

        return Promise.resolve(response.user)
    } catch (err) {
        return Promise.reject(err)
    }
}

const getFileTypeFromUri = (uri) => {
    const match = /\.(\w+)$/.exec(uri);
    return match ? match[1] : null;
}