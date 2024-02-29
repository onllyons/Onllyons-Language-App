import React, {useState, useEffect} from "react";
import {StyleSheet} from "react-native";
import {View} from "react-native";
import {MaterialIndicator} from "react-native-indicators";
import Modal from "react-native-modal"

interface SpinnerPropTypes {
    cancelable?: boolean;
    animationIn?: string;
    animationOut?: string;
    overlayColor?: string;
    size?: number;
    visible?: boolean;
    customIndicator?: React.ReactNode;
    children?: React.ReactNode;
    spinnerKey?: string;
}

const Indicator = ({options}) => {
    return (
        <MaterialIndicator size={options.size} minScale={0.5} color="#57cc04" style={[styles.activityIndicator]}/>
    );
}

const Loader: React.FC<SpinnerPropTypes> = React.memo(({
        cancelable = false,
        animationIn = "fadeIn",
        animationOut = "fadeOut",
        overlayColor = "rgba(0, 0, 0, 0.5)",
        size = 50,
        visible = false,
        customIndicator,
        children,
    }: SpinnerPropTypes) => {
    const [spinnerVisible, setSpinnerVisibility] = useState(visible);

    const close = () => {
        setSpinnerVisibility(false);
    };

    const handleOnRequestClose = () => {
        if (cancelable) {
            close();
        }
    };

    useEffect(() => {
        setSpinnerVisibility(visible);
    }, [visible]);

    const renderDefaultContent = () => {
        return (
            <View style={styles.background}>
                {customIndicator || (
                    <Indicator options={{size: size}}/>
                )}
            </View>
        );
    };

    const renderSpinner = () => {
        const spinner = (
            <View
                style={[styles.container, {backgroundColor: overlayColor}]}
                key={`spinner_${Date.now()}`}
            >
                {children || renderDefaultContent()}
            </View>
        );

        return (
            <Modal
                animationIn={animationIn}
                animationOut={animationOut}
                animationInTiming={300}
                animationOutTiming={300}
                statusBarTranslucent
                onModalHide={handleOnRequestClose}
                supportedOrientations={["landscape", "portrait"]}
                isVisible={spinnerVisible}
                style={{margin: 0}}
                hasBackdrop={false}
            >
                {spinner}
            </Modal>
        );
    };

    return renderSpinner();
})

export default Loader;

const styles = StyleSheet.create({
    activityIndicator: {
        position: "absolute",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 12
    },
    background: {
        alignItems: "center",
        bottom: 0,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0
    },
    container: {
        backgroundColor: "transparent",
        bottom: 0,
        flex: 1,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0
    }
});
