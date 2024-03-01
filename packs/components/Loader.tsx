import React from "react";
import {StyleSheet} from "react-native";
import {View} from "react-native";
import {MaterialIndicator} from "react-native-indicators";
import Modal from "react-native-modal"

interface SpinnerPropTypes {
    animationIn?: string;
    animationOut?: string;
    overlayColor?: string;
    size?: number;
    visible?: boolean
}

const Indicator = ({options}) => {
    return (
        <MaterialIndicator size={options.size} color="#57cc04" style={[styles.activityIndicator]}/>
    );
}

const Loader: React.FC<SpinnerPropTypes> = React.memo(({
        animationIn = "fadeIn",
        animationOut = "fadeOut",
        overlayColor = "rgba(0, 0, 0, 0.5)",
        size = 50,
        visible = false
    }: SpinnerPropTypes) => {

    const renderSpinner = () => {
        const spinner = (
            <View
                style={[styles.container]}
                // key={`spinner_${Date.now()}`}
            >
                <Indicator options={{size: size}}/>
            </View>
        );

        return (
            <Modal
                animationIn={animationIn}
                animationOut={animationOut}
                animationInTiming={1}
                animationOutTiming={1}
                statusBarTranslucent
                supportedOrientations={["landscape", "portrait"]}
                isVisible={visible}
                style={{margin: 0}}
                useNativeDriver={true}
                useNativeDriverForBackdrop={true}
                backdropColor={overlayColor}
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
    container: {
        backgroundColor: "transparent",
        bottom: 0,
        flex: 1,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        right: 0,
        top: 0
    }
});
