import {Image, StyleSheet, Text, View} from "react-native";
import {DotIndicator} from "react-native-indicators";
import {LinearGradient} from "expo-linear-gradient";
import React from "react";

export const Loader = () => {
    return (
        <LinearGradient
            colors={["#8f69cc", "#8f69cc"]}
            style={styles.startContent}
        >
            <Image
                source={require("../../images/other_images/quiz-logo.png")}
                style={styles.logoQuiz}
            />
            <Text style={styles.textContainerMess}>Quiz Time</Text>

            <View style={styles.loaderContainer}>
                <DotIndicator color="white" size={30} count={3}/>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    startContent: {
        flex: 1,
        justifyContent: "center",
    },
    logoQuiz: {
        width: 140,
        height: 140,
        alignSelf: "center",
        marginBottom: "2.9%",
    },
    textContainerMess: {
        fontSize: 24,
        textAlign: "center",
        color: "#E4D3FF",
    },
    loaderContainer: {
        position: "absolute",
        bottom: "5%",
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    }
});