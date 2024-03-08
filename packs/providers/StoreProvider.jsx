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

const STORED_ASYNC_LIFETIME = 7 * 86400 // 7 days in seconds
const STORED_ASYNC_PREFIX = "stored--"

export const StoreProvider = ({children}) => {
    const {isReady} = useAuth()
    const [loading, setLoading] = useState(true)
    const loadingRef = useRef(true)
    const requestCourseData = useRef(true)
    const firstRequestData = useRef(true)

    const initFirstData = useCallback(async (withLoading = false, reNew = false, callback = null) => {
        if (withLoading) setTimeout(() => setLoading(true), 1)

        requestCourseData.current = true

        try {
            let sendRequest = true
            let courseData = await getStoredValueAsync("courseData")

            if (!reNew && courseData) sendRequest = false

            if (sendRequest) {
                const data = await sendDefaultRequest(`${SERVER_AJAX_URL}/course/get_categories_copy.php`,
                    {},
                    null,
                    {success: false}
                )

                courseData = {
                    data: data.data,
                    seriesData: data.seriesData,
                    generalInfo: data.generalInfo,
                    categoriesData: data.categoriesData
                }

                await setStoredValueAsync("courseData", courseData)
            }

            const booksData = await getStoredValueAsync("books_books")
            const poetryData = await getStoredValueAsync("books_poetry")
            const dialoguesData = await getStoredValueAsync("books_dialogues")
            const flashcardsData = await getStoredValueAsync("flashcardsData")

            if (courseData) setStoredValue(`${STORED_ASYNC_PREFIX}courseData`, courseData)
            if (booksData) setStoredValue(`${STORED_ASYNC_PREFIX}books_books`, booksData)
            if (poetryData) setStoredValue(`${STORED_ASYNC_PREFIX}books_poetry`, poetryData)
            if (dialoguesData) setStoredValue(`${STORED_ASYNC_PREFIX}books_dialogues`, dialoguesData)
            if (flashcardsData) setStoredValue(`${STORED_ASYNC_PREFIX}flashcardsData`, flashcardsData)

            if (firstRequestData.current) {
                const initData = await sendDefaultRequest(`${SERVER_AJAX_URL}/get_init_data.php`,
                    {
                        // requestCourseData: !sendRequest,
                        // requestBooksData: !!booksData,
                        // requestPoetryData: !!poetryData,
                        // requestDialoguesData: !!dialoguesData,
                        requestCourseData: false,
                        requestBooksData: false,
                        requestPoetryData: false,
                        requestDialoguesData: false,
                        requestFlashcardsData: false,
                        requestSeriesData: !sendRequest && courseData ? (Date.now() / 1000 - courseData.seriesData.lastUpdate > 60) : false,
                    },
                    null,
                    {success: false}
                )

                if (initData.data.courseData) await setStoredValueAsync("courseData", {...courseData, ...initData.data.courseData})
                if (initData.data.booksData) await setStoredValueAsync("books_books", {...booksData, ...initData.data.booksData})
                if (initData.data.poetryData) await setStoredValueAsync("books_poetry", {...poetryData, ...initData.data.poetryData})
                if (initData.data.dialoguesData) await setStoredValueAsync("books_poetry", {...dialoguesData, ...initData.data.dialoguesData})
                if (initData.data.flashcardsData) await setStoredValueAsync("flashcardsData", {...flashcardsData, ...initData.data.flashcardsData})
                if (initData.data.seriesData) await setStoredValueAsync("courseData", {...courseData, seriesData: initData.data.seriesData})
            }

            if (callback) callback()

            return Promise.resolve()
        } catch (err) {
            return Promise.reject()
        } finally {
            setTimeout(() => {
                requestCourseData.current = false
                loadingRef.current = false
                setLoading(false)
            }, 500)


            firstRequestData.current = false
        }
    }, [])

    useEffect(() => {
        if (!isReady) return

        if (!isAuthenticated()) {
            loadingRef.current = false
            setLoading(false)
        } else {
            let interval = setInterval(() => {
                if (!requestCourseData.current && loadingRef.current) {
                    clearInterval(interval)
                    setLoading(false)
                }
            }, 1000)
        }
    }, [isReady]);

    const setStoredValue = (key, value) => stored[key] = value

    const setStoredValueAsync = (key, value) => {
        setStoredValue(key, value)

        return AsyncStorage.setItem(`${STORED_ASYNC_PREFIX}${key}`, JSON.stringify({
            expired: Date.now() + (STORED_ASYNC_LIFETIME * 1000),
            data: value
        }))
    }

    const getStoredValue = (key, isAsyncStored = false) => {
        if (isAsyncStored) key = `${STORED_ASYNC_PREFIX}${key}`

        return stored[key] !== undefined ? stored[key] : null
    }

    const getStoredValueAsync = async (key) => {
        key = `${STORED_ASYNC_PREFIX}${key}`

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

    const deleteStoredValueAsync = (key) => AsyncStorage.removeItem(`${STORED_ASYNC_PREFIX}${key}`);

    return (
        <StoreContext.Provider
            value={{
                setStoredValue,
                getStoredValue,
                deleteStoredValue,

                setStoredValueAsync,
                getStoredValueAsync,
                deleteStoredValueAsync,

                // Load first data
                initFirstData
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
