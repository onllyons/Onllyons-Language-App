import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import Loader from "../../components/Loader";
import Toast from "react-native-toast-message";

const AuthContext = createContext("user context doesnt exists");

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [firstLaunch, setFirstLaunch] = useState(Date.now());
    const [token, setToken] = useState("")

    const [loader, setLoader] = useState(false)

    // Loading user data from local storage
    const retrieveData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");

            if (storedUser !== null) {
                setUser(JSON.parse(storedUser))
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    };

    // Loading first time launch from local storage
    const recordFirstLaunchDate = async () => {
        try {
            const firstLaunchDate = await AsyncStorage.getItem("firstLaunch");

            if (firstLaunchDate === null) {
                await AsyncStorage.setItem("firstLaunch", `${firstLaunch}`);
            } else {
                setFirstLaunch(firstLaunchDate)
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    }

    useMemo(() => {
        setLoader(true)

        recordFirstLaunchDate()
            .then(() => retrieveData())
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
                    userId: isAuthenticated() ? user.id : -1
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
            })
            .then(async data => {
                if (data.data.success) {
                    setToken(data.data.token)

                    setLoader(false)

                    if (isAuthenticated() && !data.data.userAvailable) {
                        await new Promise(resolve => setTimeout(resolve, 100))

                        Toast.show({
                            type: "error",
                            text1: "Ошибка при загрузке данных пользователя, перевойдите в аккаунт"
                        });

                        return logout()
                    }
                }
            })
            .catch(async () => {
                setLoader(false)

                await new Promise(resolve => setTimeout(resolve, 100))

                Toast.show({
                    type: "error",
                    text1: "Ошибка при обращении к серверу"
                });
            })
    }, []);

    const login = async userData => {
        try {
            // Save user data on local storage
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);

            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
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

    const getUserToken = () => token

    return (
        <AuthContext.Provider value={{isAuthenticated, getUser, getUserToken, login, logout}}>
            <Loader visible={loader}/>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
