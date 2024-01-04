import React, {createContext, useContext, useState} from 'react';
import Alerts from "../../components/Alerts";

const AlertLoadingContext = createContext("alert loading doesnt exists");

export const AlertLoadingProvider = ({children}) => {
    const defaultSettings = {type: "loading"}


    const [alert, setAlert] = useState({...defaultSettings})

    const hideAlertLoading = () => setAlert(prev => ({...prev, showAlert: false}))

    const showAlertLoading = () => setAlert(prev => ({...prev, showAlert: true}))

    const setAlertLoading = (options) => setAlert(prev => ({...defaultSettings, ...options}))

    return (
        <AlertLoadingContext.Provider value={{hideAlertLoading, showAlertLoading, setAlertLoading}}>
            {React.useMemo(() => <Alerts options={alert}/>, [alert])}
            {children}
        </AlertLoadingContext.Provider>
    );
};

export const useAlertLoading = () => {
    return useContext(AlertLoadingContext);
};
