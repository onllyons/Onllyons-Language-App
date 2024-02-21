import {Animated, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faGear, faTimes} from "@fortawesome/free-solid-svg-icons";
import globalCss from "../../../css/globalCss";
import React from "react";
import {useNavigation} from "@react-navigation/native";

export const Header = ({scrollAnim, handleOpenBottomSheetPress}) => {
    const navigation = useNavigation()

    return (
        <View style={styles.row}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.closeButton}
            >
                <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.blue}/>
            </TouchableOpacity>

            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: scrollAnim.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            })
                        }
                    ]}
                />
            </View>

            <TouchableOpacity style={styles.settingsBtn} onPress={handleOpenBottomSheetPress}>
                <Text>
                    <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue}/>
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    closeButton: {
        minWidth: "14%",
        paddingVertical: "3%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
    progressBarContainer: {
        height: 25,
        flex: 1,
        backgroundColor: "#3a464e",
        borderRadius: 10,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#ffeb3b",
        borderRadius: 10,
    },
    settingsBtn: {
        width: "14%",
        paddingVertical: "3%",
        alignItems: "center",
        alignContent: "center",
    }
})