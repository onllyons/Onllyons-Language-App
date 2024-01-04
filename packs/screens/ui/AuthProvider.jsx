import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAlertConfirm} from "./AlertConfirmPrivider";

const AuthContext = createContext("user context doesnt exists");

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({});
    const {showAlertConfirm, setAlertConfirm} = useAlertConfirm()

    useEffect(() => {
        retrieveData();
    }, []);

    // Loading user data from local storage
    const retrieveData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");

            if (storedUser !== null) {
                setUser(JSON.parse(storedUser))
            }
        } catch (error) {
            setAlertConfirm({
                title: "Ошибка",
                errorStyle: true,
                message: "Ошибка при загрузке данных пользователя"
            })
            showAlertConfirm()
        }
    };

    const login = async userData => {
        try {
            // Save user data on local storage
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);

            return Promise.resolve("Login successful");
        } catch (error) {
            return Promise.reject("Login failed");
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setUser({});

            return Promise.resolve("Logout successful");
        } catch (error) {
            return Promise.reject("Logout failed");
        }
    };

    const isAuthenticated = () => {
        return !!Object.keys(user).length
    }

    const getUser = () => user

    return (
        <AuthContext.Provider value={{isAuthenticated, getUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
