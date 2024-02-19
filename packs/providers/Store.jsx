import React, {
    createContext, useCallback,
    useContext, useEffect, useState,
} from "react";
import {Welcome} from "../components/Welcome";
import {isAuthenticated, useAuth} from "./AuthProvider";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";

const StoreContext = createContext("store context doesnt exists");

let stored = {}

export const StoreProvider = ({children}) => {
    const {isReady} = useAuth()
    const [loading, setLoading] = useState(true)

    const setStoredCourseData = useCallback(async () => {
        try {
            const data = await sendDefaultRequest(`${SERVER_AJAX_URL}/course/get_categories.php`,
                {},
                null,
                {success: false}
            )

            setStoredValue("courseData", data)

            return Promise.resolve()
        } catch (err) {
            return Promise.reject()
        } finally {
            if (loading) setTimeout(() => setLoading(false), 1)
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated() && isReady) {
            setStoredCourseData()
        }
    }, [isReady]);

    const setStoredValue = (key, value) => stored[key] = value

    const getStoredValue = (key) => stored[key] !== undefined ? stored[key] : null

    const deleteStoredValue = (key) => {
        if (stored[key] !== undefined) delete stored[key]
    }

    return (
        <StoreContext.Provider
            value={{
                setStoredValue,
                getStoredValue,
                deleteStoredValue,

                // Load courses
                setStoredCourseData
            }}
        >
            {loading ? <Welcome/> : children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    return useContext(StoreContext);
};