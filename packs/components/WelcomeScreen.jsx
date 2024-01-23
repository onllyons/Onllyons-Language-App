import {useEffect} from "react";
import {Image, StyleSheet, View} from "react-native";
import {DotIndicator} from "react-native-indicators";

export const WelcomeScreen = () => {
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