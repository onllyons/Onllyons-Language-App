import React, {createContext, useContext, useState} from 'react';
import Alerts from "../../components/Alerts";

const AlertBaseContext = createContext("alert base doesnt exists");

export const AlertBaseProvider = ({children}) => {
    const defaultSettings = {type: "alert"}

    const [alert, setAlert] = useState({...defaultSettings})

    const hideAlertBase = () => setAlert(prev => ({...prev, showAlert: false}))

    const showAlertBase = () => setAlert(prev => ({...prev, showAlert: true}))

    const setAlertBase = (options) => setAlert(prev => ({...defaultSettings, ...options}))

    return (
        <AlertBaseContext.Provider value={{hideAlertBase, showAlertBase, setAlertBase}}>
            {React.useMemo(() => <Alerts options={alert}/>, [alert])}
            {children}
        </AlertBaseContext.Provider>
    );
}

export const useAlertBase = () => {
    return useContext(AlertBaseContext);
};
