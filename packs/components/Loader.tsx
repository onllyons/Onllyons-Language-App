import React from "react";
import {Modal, StyleSheet} from "react-native";
import {View} from "react-native";
import {MaterialIndicator} from "react-native-indicators";
import {useStore} from "../providers/StoreProvider";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {NAV_HEIGHT} from "../../App";

interface SpinnerPropTypes {
    overlayColor?: string;
    size?: number;
    visible?: boolean;
    notFull?: boolean
}

const Indicator = ({options}) => {
    return (
        <MaterialIndicator size={options.size} color="#57cc04" style={[styles.activityIndicator]}/>
    );
}

const Loader: React.FC<SpinnerPropTypes> = React.memo(({
    overlayColor = "#fff",
    size = 50,
    visible = false,
    notFull = false
}: SpinnerPropTypes) => {
    const {getStoredValue} = useStore()
    const insets = useSafeAreaInsets();

    const navHeight = getStoredValue("heightNav") ? getStoredValue("heightNav") : 90

    const renderSpinner = () => {
        const spinner = (
            <View
                style={[styles.container, {
                    backgroundColor: overlayColor,
                    margin: 0,
                    marginTop: notFull ? navHeight : 0,
                    marginBottom: notFull ? NAV_HEIGHT + insets.bottom : 0
                }]}
                key={`spinner_${Date.now()}`}
            >
                <Indicator options={{size: size}}/>
            </View>
        );

        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={visible}
                statusBarTranslucent={true}
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
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
});
