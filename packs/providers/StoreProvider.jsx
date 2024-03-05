import React, {
    createContext, useCallback,
    useContext, useEffect, useRef, useState,
} from "react";
import {Welcome} from "../components/Welcome";
import {isAuthenticated, useAuth} from "./AuthProvider";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StoreContext = createContext("store context doesnt exists");

let stored = {}

// const STORED_ASYNC_LIFETIME = 7 * 86400 // 7 days is seconds
const STORED_ASYNC_LIFETIME = 1

export const StoreProvider = ({children}) => {
    const {isReady} = useAuth()
    const [loading, setLoading] = useState(true)
    const requestCourseData = useRef(true)

    const setStoredCourseData = useCallback(async (withLoading, callback) => {
        if (withLoading) setTimeout(() => setLoading(true), 1)

        requestCourseData.current = true

        try {
            const data = await sendDefaultRequest(`${SERVER_AJAX_URL}/course/get_categories_copy.php`,
                {},
                null,
                {success: false}
            )

            await setStoredValueAsync("courseData", {
                data: data.data,
                seriesData: data.seriesData,
                generalInfo: data.generalInfo,
                categoriesData: data.categoriesData
            })

            if (callback) callback()

            return Promise.resolve()
        } catch (err) {
            return Promise.reject()
        } finally {
            if (withLoading) {
                setTimeout(() => setLoading(false), 500)
            }

            requestCourseData.current = false
        }
    }, [])

    useEffect(() => {
        if (!isReady) return

        if (!isAuthenticated()) {
            setLoading(false)
        } else {
            getStoredValueAsync("courseData")
                .then(data => {
                    if (data) setTimeout(() => setLoading(false), 3000)
                    else throw new Error()
                })
                .catch(() => {
                    if (!requestCourseData.current) {
                        console.log("request")
                        setStoredCourseData(true)
                    }
                })
        }
    }, [isReady]);

    const setStoredValue = (key, value) => stored[key] = value

    const setStoredValueAsync = (key, value) => {
        return AsyncStorage.setItem(`stored__${key}`, JSON.stringify({
            expired: Date.now() + (STORED_ASYNC_LIFETIME * 1000),
            data: value
        }))
    }

    const getStoredValue = (key) => stored[key] !== undefined ? stored[key] : null

    const getStoredValueAsync = async (key) => {
        key = `stored__${key}`

        try {
            const value = await AsyncStorage.getItem(key);

            if (value === null) return Promise.resolve(null);

            const json = JSON.parse(value);

            if (json.expired < Date.now()) {
                try {
                    await AsyncStorage.removeItem(key);
                } catch (err) {}

                return Promise.resolve(null);
            }

            return Promise.resolve(json.data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    const deleteStoredValue = (key) => {
        if (stored[key] !== undefined) delete stored[key]
    }

    const deleteStoredValueAsync = (key) => AsyncStorage.removeItem(`stored__${key}`);

    return (
        <StoreContext.Provider
            value={{
                setStoredValue,
                getStoredValue,
                deleteStoredValue,

                setStoredValueAsync,
                getStoredValueAsync,
                deleteStoredValueAsync,

                // Load courses
                setStoredCourseData
            }}
        >
            <>
                <Welcome visible={loading}/>
                {children}
            </>
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    return useContext(StoreContext);
};
