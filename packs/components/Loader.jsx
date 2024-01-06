import React, {useState, useEffect} from "react";
import {StyleSheet} from "react-native";
import {View, Text, Modal, TextStyle} from "react-native";
import {SkypeIndicator} from "react-native-indicators";

interface SpinnerPropTypes {
    cancelable?: boolean;
    animation?: "none" | "slide" | "fade";
    overlayColor?: string;
    size?: number;
    textContent?: string;
    textStyle?: TextStyle;
    visible?: boolean;
    customIndicator?: React.ReactNode;
    children?: React.ReactNode;
    spinnerKey?: string;
}

const Indicator = ({options}) => {
    return (
        // <ActivityIndicator
        //     color={color}
        //     size={options.size}
        //     style={[styles.activityIndicator, {...options.styles}]}
        // />
        <SkypeIndicator size={options.size} minScale={0.5} color="#57cc04" style={[styles.activityIndicator]}/>
    );
}

const Loader: React.FC<SpinnerPropTypes> = ({
        cancelable = false,
        animation = "fade",
        overlayColor = "rgba(0, 0, 0, 0.5)",
        size = 50,
        textContent = "LOADING...",
        textStyle,
        visible = false,
        customIndicator,
        children,
        spinnerKey,
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
                <View style={[styles.textContainer]}>
                    <View style={[styles.textContainerIn]}>
                        <Text style={[styles.textContent, textStyle]}>{textContent}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderSpinner = () => {
        const spinner = (
            <View
                style={[styles.container, {backgroundColor: overlayColor}]}
                key={spinnerKey || `spinner_${Date.now()}`}
            >
                {children || renderDefaultContent()}
            </View>
        );

        return (
            <Modal
                animationType={animation}
                onRequestClose={handleOnRequestClose}
                supportedOrientations={["landscape", "portrait"]}
                transparent
                visible={spinnerVisible}
                statusBarTranslucent={true}
            >
                {spinner}
            </Modal>
        );
    };

    return renderSpinner();
};

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
    },
    textContainer: {
        alignItems: "center",
        bottom: 0,
        flex: 1,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0
    },
    textContainerIn: {
        padding: 15,
        top: 80,
        borderRadius: 12,
        backgroundColor: "white",
    },
    textContent: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#353535",
    }
});
