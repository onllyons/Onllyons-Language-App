import React, {useCallback} from "react";
import globalCss from '../css/globalCss';
import {View, Text, StyleSheet} from "react-native";
import {isAuthenticated} from "../providers/AuthProvider";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {useFocusEffect} from "@react-navigation/native";

export default function StartPageScreen({navigation}) {
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated()) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabNavigator' }],
                });
            }
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.heading}>Уже есть аккаунт?</Text>
                <Text style={styles.subheading}>
                    Начните с того, на чем остановились.
                </Text>
            </View>

            <AnimatedButtonShadow
                styleButton={[globalCss.button, globalCss.buttonGreen]}
                size={"full"}
                shadowColor={"green"}
                onPress={() => navigation.navigate("LoginScreen")}
            >
                <Text style={globalCss.buttonText}>ВХОД</Text>
            </AnimatedButtonShadow>


            <View style={styles.signupContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.subheading}>Впервые на Onllyons Language?</Text>
                </View>
                <AnimatedButtonShadow
                    styleButton={[
                        globalCss.button,
                        globalCss.buttonBlue,
                    ]}
                    size={"full"}
                    shadowColor={"blue"}
                    onPress={() => navigation.navigate("IntroductionScreen")}
                >
                    <Text style={globalCss.buttonText}>НАЧАТЬ</Text>
                </AnimatedButtonShadow>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    textContainer: {
        marginBottom: 8,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 0,
    },
    subheading: {
        fontSize: 18,
        color: "#666",
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    signupContainer: {
        width: "100%",
    },
});
