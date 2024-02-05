import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faSearch, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

export const MenuBottomFixed = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} />
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesomeIcon icon={faSearch} size={24} style={styles.icon} />
                    <Text style={styles.menuText}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesomeIcon icon={faBell} size={24} style={styles.icon} />
                    <Text style={styles.menuText}>Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesomeIcon icon={faUser} size={24} style={styles.icon} />
                    <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: 10,
        position: 'absolute', // Poziționarea absolută a meniului
        bottom: 0, // Plasat la partea de jos a ecranului
        left: 0,
        right: 0,
    },
    menuItem: {
        alignItems: "center",
    },
    menuText: {
        marginTop: 4,
        fontSize: 12,
    },
    icon: {
        marginBottom: 3,
    },
});
