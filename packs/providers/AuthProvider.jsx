import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import axios from "axios";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";

const AuthContext = createContext("user context doesnt exists");

const callback = {
    callback: null,
    complete: false
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [firstLaunch, setFirstLaunch] = useState(Date.now());
    const [tokens, setTokens] = useState({
        mobileToken: "",
        accessToken: "",
        refreshToken: "",
    })

    const [loader, setLoader] = useState(false)

    // Loading user data from local storage
    const retrieveData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            const storedTokens = await AsyncStorage.getItem("tokens");
            const firstLaunchDate = await AsyncStorage.getItem("firstLaunch");

            if (storedUser !== null) {
                setUser(JSON.parse(storedUser))
            }

            if (storedTokens !== null) {
                setTokens(prev => ({...prev, ...JSON.parse(storedTokens)}))
            }

            console.log(tokens)

            if (firstLaunchDate === null) {
                await AsyncStorage.setItem("firstLaunch", `${firstLaunch}`);
            } else {
                setFirstLaunch(firstLaunchDate)
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    };

    const login = async (userData, tokensData) => {
        try {
            // Save user data on local storage
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);

            await AsyncStorage.setItem("tokens", JSON.stringify({...tokens, ...tokensData}));
            setTokens({...tokens, ...tokensData});

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("tokens");
            setUser({});

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    };

    const isAuthenticated = () => {
        return !!Object.keys(user).length
    }

    const getUser = () => user

    const getTokens = () => tokens

    const setSuccessCallback = func => {
        if (callback.complete) func()
        else callback.callback = func
    }

    const checkServerResponse = async (response, navigation = null, showSuccess = true, showError = true) => {
        if (!response.success) {
            if (response.tokensError) {
                await logout()

                if (navigation) navigation.navigate("StartPageScreen")
            }

            if (showError) {
                Toast.show({
                    type: "error",
                    text1: response.message
                });
            }

            return Promise.reject(response);
        }

        if (showSuccess) {
            Toast.show({
                type: "success",
                text1: response.message
            });
        }

        if (response.token) setTokens(prev => ({...prev, accessToken: response.token}))

        return Promise.resolve(response);
    }

    useMemo(() => {
        callback.complete = false

        setLoader(true)

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
                }

                return axios.post("https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/get_device_token.php", {
                    ...deviceInfo,
                    tokens: tokens,
                    userId: isAuthenticated() ? user.id : -1
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
            })
            .then(async data => {
                if (data.data.success) {
                    setTokens(prev => ({...prev, mobileToken: data.data.mobileToken, accessToken: data.data.token}))

                    setTimeout(() => setLoader(false), 1)

                    if (isAuthenticated() && !data.data.userAvailable) {
                        await new Promise(resolve => setTimeout(resolve, 100))

                        Toast.show({
                            type: "error",
                            text1: "Ошибка, перевойдите в аккаунт"
                        });

                        return logout()
                    }
                }
            })
            .catch(async () => {
                setTimeout(() => setLoader(false), 1)

                await new Promise(resolve => setTimeout(resolve, 100))

                Toast.show({
                    type: "error",
                    text1: "Ошибка при обращении к серверу"
                });
            })
            .finally(() => {
                if (callback.callback) callback.callback()

                callback.complete = true
            })
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, checkServerResponse, getUser, getTokens, login, logout, setSuccessCallback}}>
            <Loader visible={loader}/>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
