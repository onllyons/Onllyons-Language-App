import {Image, StyleSheet, View, Modal} from "react-native";
import {DotIndicator} from "react-native-indicators";

export const Welcome = ({visible}) => {
    return (
        <>
            <Modal
                animationType="none"
                transparent={true}
                visible={visible}
                statusBarTranslucent={true}
            >
                <WelcomeContent key={"welcome-1"}/>
            </Modal>

            {/* Bug on IOS - navigation flicker. This View is overlaps navigation */}
            {visible && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                        backgroundColor: "#fff"
                    }}
                >
                    <WelcomeContent key={"welcome-2"}/>
                </View>
            )}
        </>

    );
};

const WelcomeContent = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../packs/images/El/logoStart.png")}
                style={styles.logoEl}
            />
            <View style={styles.loaderContainer}>
                <DotIndicator color="#6949FF" size={20} count={3}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logoEl:{
        width: '60%',
        height: '60%',
        resizeMode: 'contain'
    },
    loaderContainer: {
        position: "absolute",
        bottom: "7%",
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
});