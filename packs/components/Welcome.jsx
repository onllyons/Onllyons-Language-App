import {Image, StyleSheet, View} from "react-native";
import {DotIndicator} from "react-native-indicators";
import Modal from "react-native-modal";

export const Welcome = ({visible}) => {
    return (
        <Modal
            isVisible={visible}
            animationInTiming={1}
            animationOutTiming={150}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            statusBarTranslucent
            useNativeDriver={true}
            hasBackdrop={false}
            style={{margin: 0}}
        >
            <View style={styles.container}>
                <Image
                    source={require("../../packs/images/El/logoStart.png")}
                    style={styles.logoEl}
                />
                <View style={styles.loaderContainer}>
                    <DotIndicator color="#6949FF" size={20} count={3}/>
                </View>
            </View>
        </Modal>
    );
};

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