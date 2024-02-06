import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, Text, View, TouchableOpacity, Image} from "react-native";
import {useNavigation} from "@react-navigation/native";

const SCREENS_TO_SHOW_MENU = ["MenuCourseLesson", "MenuBooksReading", "GamesScreen", "FlashCardsScreen", "UserProfileMenu"]

export const MenuBottomFixed = ({setAppStackPadding}) => {
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(true)
    const height = useRef(0)

    useEffect(() => {
        return navigation.addListener('state', (e) => {
            const state = e.data.state

            if (!state) return

            if (SCREENS_TO_SHOW_MENU.indexOf(state.routes[state.index].name) === -1) {
                setIsVisible(false)
                setAppStackPadding(0)
            } else {
                setIsVisible(true)
                setAppStackPadding(height.current)
            }
        });
    }, [navigation]);

    return isVisible ? (
        <View style={styles.menuContainer} onLayout={(e) => height.current = e.nativeEvent.layout.height}>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("MenuCourseLesson")}
            >

                <Image style={styles.icon}  source={require("../images/nav-icon/course.png")}/>
                <Text style={styles.menuText}>Курс</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("MenuBooksReading")}
            >

                <Image style={styles.icon}  source={require("../images/nav-icon/book-open.png")}/>
                <Text style={styles.menuText}>Книги</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("GamesScreen")}
            >

                <Image style={styles.icon}  source={require("../images/nav-icon/game.png")}/>
                <Text style={styles.menuText}>Играть</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("FlashCardsScreen")}
            >

                <Image style={styles.icon}  source={require("../images/nav-icon/flashcards.png")}/>
                <Text style={styles.menuText}>Флеш-карты</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("UserProfileMenu")}
            >

                <Image style={styles.icon}  source={require("../images/nav-icon/more.png")}/>
                <Text style={styles.menuText}>Меню</Text>
            </TouchableOpacity>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: 10,
        paddingHorizontal: 20,
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
        width: 35,
        height: 35,
        alignSelf: "center",
    },
});
