import React, {createContext, useContext, useState} from 'react';
import Alerts from "../../components/Alerts";

const AlertConfirmContext = createContext("alert confirm doesnt exists");

export const AlertConfirmProvider = ({children}) => {
    const defaultSettings = {type: "confirm"}

    const [alert, setAlert] = useState({...defaultSettings})

    const hideAlertConfirm = () => setAlert(prev => ({...prev, showAlert: false}))

    const showAlertConfirm = () => setAlert(prev => ({...prev, showAlert: true}))

    const setAlertConfirm = (options) => setAlert(prev => ({...defaultSettings, ...options}))

    return (
        <AlertConfirmContext.Provider value={{hideAlertConfirm, showAlertConfirm, setAlertConfirm}}>
            {React.useMemo(() => <Alerts options={alert}/>, [alert])}
            {children}
        </AlertConfirmContext.Provider>
    );
}

export const useAlertConfirm = () => {
    return useContext(AlertConfirmContext);
};
