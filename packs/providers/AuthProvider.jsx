import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import axios from "axios";
import Toast from "react-native-toast-message";
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import {useNavigation} from "@react-navigation/native";

const AuthContext = createContext("user context doesnt exists");

let user = {};
let tokens = {
    mobileToken: "",
    accessToken: "",
    refreshToken: "",
};
let firstLaunch = Date.now();

export const login = async (userData, tokensData) => {
    try {
        // Save user data on local storage
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        user = userData;

        await AsyncStorage.setItem(
            "tokens",
            JSON.stringify({...tokens, ...tokensData})
        );

        setTokens(tokensData);

        return Promise.resolve();
    } catch (error) {
        return Promise.reject();
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("tokens");
        user = {};
        tokens.accessToken = "";
        tokens.refreshToken = "";

        return Promise.resolve();
    } catch (error) {
        return Promise.reject();
    }
};

export const isAuthenticated = () => {
    return !!Object.keys(user).length;
};

export const getUser = () => user;

export const getTokens = () => tokens;

export const setTokens = (obj) => {
    if (typeof obj === "object") {
        if (!obj.mobileToken) obj.mobileToken = tokens.mobileToken;
        if (!obj.accessToken) obj.accessToken = tokens.accessToken;
        if (!obj.refreshToken) obj.refreshToken = tokens.refreshToken;
    }

    tokens = {...tokens, ...obj};
};

export const AuthProvider = ({children}) => {
    const [isReady, setIsReady] = useState(false);
    const navigation = useNavigation();

    // Loading user data from local storage
    const retrieveData = async () => {
        try {
            await AsyncStorage.removeItem("seriesData");
            const storedUser = await AsyncStorage.getItem("user");
            const storedTokens = await AsyncStorage.getItem("tokens");
            const firstLaunchDate = await AsyncStorage.getItem("firstLaunch");

            if (storedUser !== null) {
                user = JSON.parse(storedUser);
            }

            if (storedTokens !== null) {
                setTokens(JSON.parse(storedTokens));
            }

            if (firstLaunchDate === null) {
                await AsyncStorage.setItem("firstLaunch", `${firstLaunch}`);
            } else {
                firstLaunch = firstLaunchDate;
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    };

    useMemo(() => {
        setIsReady(false);

        retrieveData()
            .then(() => {
                const deviceInfo = {
                    brand: Device.brand,
                    deviceName: Device.deviceName,
                    osVersion: Device.osVersion,
                    osBuildId: Device.osBuildId,
                    osInternalBuildId: Device.osInternalBuildId,
                    manufacturer: Device.manufacturer,
                    deviceYearClass: Device.deviceYearClass,
                    firstLaunch: firstLaunch,
                };

                const formData = new FormData();
                formData.append("tokens", JSON.stringify(getTokens()));
                formData.append("userId", isAuthenticated() ? user.id : -1);

                Object.keys(deviceInfo).forEach(key => {
                    formData.append(key, deviceInfo[key]);
                });

                return axios.post(
                    "https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/get_device_token.php",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            })
            .then(async (data) => {
                if (data.data.success) {
                    await AsyncStorage.setItem(
                        "tokens",
                        JSON.stringify({...tokens, ...data.data.tokens})
                    );

                    setTokens(data.data.tokens);

                    if (isAuthenticated() && !data.data.userAvailable) {
                        Toast.show({
                            type: "error",
                            text1: "Ошибка, перевойдите в аккаунт",
                        });

                        try {
                            await logout();
                            navigation.navigate("StartPageScreen")
                            setTimeout(() => setIsReady(true), 1);
                        } catch (err) {
                            return Promise.reject()
                        }
                    } else if (data.data.userAvailable && data.data.user) {
                        navigation.navigate("MainTabNavigator")
                        return login(data.data.user, data.data.tokens)
                    }

                    setTimeout(() => setIsReady(true), 1);
                }
            })
            .catch(async () => {
                setTimeout(() => setIsReady(true), 1);

                Toast.show({
                    type: "error",
                    text1: "Ошибка при обращении к серверу",
                });
            })
            .finally(() => setTimeout(() => setIsReady(true), 1))
    }, []);

    useEffect(() => {
        (async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playThroughEarpieceAndroid: false,
            });
        })();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getUser,
                getTokens,
                login,
                logout,
                setTokens,
                isReady
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
