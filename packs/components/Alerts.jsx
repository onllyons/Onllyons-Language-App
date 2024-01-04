import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';

const alertInit = {
    showAlert: false,
    showProgress: false,
    title: "",
    message: "",
    errorStyle: false,
    cancelBtn: {
        show: false,
        text: "Cancel",
        callback: () => {}
    },
    confirmBtn: {
        show: true,
        text: "Ok",
        callback: () => {}
    },
    closeOnTouchOutside: true,
    closeOnHardwareBackPress: false,
    progressSize: "40",
}

const getAlertOptionsByType = options => {
    let alertOptions = alertInit

    switch (options.type) {
        case "loading":
            alertOptions = {
                ...alertInit,
                showProgress: true,
                title: "Loading...",
                closeOnTouchOutside: false,
                message: "",
                ...options,
                cancelBtn: {
                    ...alertInit.cancelBtn,
                    show: false
                },
                confirmBtn: {
                    ...alertInit.confirmBtn,
                    show: false
                }
            }
            break

        case "confirm":
            alertOptions = {
                ...alertInit,
                showProgress: false,
                title: "Completed!",
                message: "",
                ...options,
                cancelBtn: {
                    ...alertInit.cancelBtn,
                    show: false
                },
                confirmBtn: {
                    ...alertInit.confirmBtn,
                    show: true,
                    text: "Ok"
                }
            }
            break

        case "alert":
            alertOptions = {
                ...alertInit,
                showProgress: false,
                title: "Confirmation",
                message: "Are you sure?",
                ...options,
                cancelBtn: {
                    ...alertInit.cancelBtn,
                    show: true,
                    text: "No"
                },
                confirmBtn: {
                    ...alertInit.confirmBtn,
                    show: true,
                    text: "Yes"
                },
            }
            break
    }

    if (options.cancelBtn) {
        alertOptions.cancelBtn = {...alertOptions.cancelBtn, ...options.cancelBtn}
    }
    if (options.confirmBtn) {
        alertOptions.confirmBtn = {...alertOptions.confirmBtn, ...options.confirmBtn}
    }

    return alertOptions
}

const Alerts = ({options}) => {
    const [alert, setAlert] = useState({...alertInit})

    useEffect(() => {
        setAlert(getAlertOptionsByType(options))
        console.log(alertInit)
    }, [options])

    return (
        <View>
            <AwesomeAlert
                show={alert.showAlert}
                showProgress={alert.showProgress}
                title={alert.title}
                message={alert.message}
                closeOnTouchOutside={alert.closeOnTouchOutside}
                closeOnHardwareBackPress={alert.closeOnHardwareBackPress}
                showCancelButton={alert.cancelBtn.show}
                showConfirmButton={alert.confirmBtn.show}
                cancelText={alert.cancelBtn.text}
                confirmText={alert.confirmBtn.text}
                confirmButtonColor={alert.errorStyle ? "#ca3431" : "#57cc04"}
                progressSize="40"
                progressColor="#57cc04"
                cancelButtonStyle={styles.actionButtons}
                confirmButtonStyle={styles.actionButtons}
                titleStyle={alert.errorStyle ? styles.titleStyleError : styles.titleStyleDefault}
                onDismiss={alert.cancelBtn.callback}
                onCancelPressed={() => {
                    setAlert(prev => prev = {...prev, showAlert: false})
                    alert.cancelBtn.callback()
                }}
                onConfirmPressed={() => {
                    setAlert(prev => prev = {...prev, showAlert: false})
                    alert.confirmBtn.callback()
                }}
            />
        </View>
    );
}

export default Alerts

const styles = StyleSheet.create({
    actionButtons: {
        flex: 1,
        alignItems: 'center',
    },

    titleStyleDefault: {
        textAlign: "center",
    },
    titleStyleError: {
        color: "#ca3431",
        fontWeight: "bold",
        textAlign: "center",
    }
});
