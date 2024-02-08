import {StatusBar} from "expo-status-bar";
import {Image, Text, View, Animated} from "react-native";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {
    createStackNavigator,
    CardStyleInterpolators,
} from "@react-navigation/stack";
import * as Haptics from "expo-haptics";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import globalCss from "./packs/css/globalCss";
import StartPageScreen from "./packs/screens-start-app/fiorst-page";
import LoginScreen from "./packs/screens-start-app/login";
import ChangePasswordScreen from "./packs/screens-start-app/change-password";
import PasswordScreen from "./packs/screens-start-app/password-request";
import IntroductionScreen from "./packs/screens-start-app/introduction-start";

import CourseScreen from "./packs/course";
import {CourseLesson} from "./packs/CourseLesson/CourseLesson";

import BooksScreen from "./packs/books";
import BooksCategory from "./packs/books_category";
import BooksReading from "./packs/books_reading";

import GamesScreen from "./packs/games";
import GamesQuiz from "./packs/games_quiz";

import FlashCardsScreen from "./packs/flashcards";
import FlashCardsWordsCategory from "./packs/flashcards_category";
import FlashCardsWords from "./packs/flashcards_words";

import MenuScreen from "./packs/menu";
import UserData from "./packs/user-profile/userData";
import UserSettings from "./packs/user-profile/userSettings";
import SubscribeScreen from "./packs/screens/SubscribeScreen";
import UserSubscriptionManage from "./packs/user-profile/userSubscriptionManage";

import {
    AuthProvider,
    isAuthenticated,
    setSuccessCallback,
} from "./packs/providers/AuthProvider";
import Toast, {BaseToast, ErrorToast} from "react-native-toast-message";
import React from "react";
import {FadeNavMenu} from "./packs/components/FadeNavMenu";
import Test_buttons_screen from "./packs/test_buttons_screen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const handleTabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

function UserProfileMenu() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MenuScreen"
                component={MenuScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="UserData"
                component={UserData}
                options={{title: "Профиль", headerBackTitle: "Назад"}}
            />
            <Stack.Screen
                name="UserSettings"
                component={UserSettings}
                options={{title: "Настройки", headerBackTitle: "Назад"}}
            />
            <Stack.Screen
                name="UserSubscriptionManage"
                component={UserSubscriptionManage}
                options={{title: "Управление подпиской", headerBackTitle: "Назад"}}
            />
        </Stack.Navigator>
    );
}

function MenuCourseLesson() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CourseScreen"
                component={CourseScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}

function MenuBooksReading() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BooksScreen"
                component={BooksScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}

function MenuGames() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="GamesScreen"
                component={GamesScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}

function MenuFlasCards() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FlashCardsScreen"
                component={FlashCardsScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}

function MainTabNavigator() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({size, focused}) => {
                    let iconImage;
                    if (route.name === "MenuCourseLesson") {
                        iconImage = require("./packs/images/nav-icon/course.png");
                    } else if (route.name === "MenuBooksReading") {
                        iconImage = require("./packs/images/nav-icon/book-open.png");
                    } else if (route.name === "MenuGames") {
                        iconImage = require("./packs/images/nav-icon/game.png");
                    } else if (route.name === "MenuFlasCards") {
                        iconImage = require("./packs/images/nav-icon/flashcards.png");
                    } else if (route.name === "UserProfileMenu") {
                        iconImage = require("./packs/images/nav-icon/more.png");
                    }

                    const imageStyle = focused
                        ? {
                            width: size + 10,
                            height: size + 10,
                            // color: '#8ac0e6'
                        }
                        : {
                            width: size + 10,
                            height: size + 10,
                            // color: '#8ac0e6'
                        };
                    return (
                        <Image
                            source={iconImage}
                            style={[imageStyle, globalCss.navImage]}
                        />
                    );
                },
                tabBarActiveTintColor: "#8ac0e6",
                tabBarInactiveTintColor: "red",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 100,
                    paddingTop: 20
                }
            })}
        >
            <Tab.Screen
                name="MenuCourseLesson"
                component={MenuCourseLesson}
                options={{title: "Курс", headerShown: false}}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress();
                        navigation.navigate("MenuCourseLesson");
                    },
                }}
            />

            <Tab.Screen
                name="MenuBooksReading"
                component={MenuBooksReading}
                options={{title: "Книги", headerShown: false}}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress();
                        navigation.navigate("MenuBooksReading");
                    },
                }}
            />

            <Tab.Screen
                name="MenuGames"
                component={MenuGames}
                options={{title: "Игры", headerShown: false}}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress();
                        navigation.navigate("MenuGames");
                    },
                }}
            />

            <Tab.Screen
                name="MenuFlasCards"
                component={MenuFlasCards}
                options={{title: "Флэш-карты", headerShown: false}}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress();
                        navigation.navigate("MenuFlasCards");
                    },
                }}
            />

            <Tab.Screen
                name="UserProfileMenu"
                component={UserProfileMenu}
                options={{title: "Меню", headerShown: false}}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        handleTabPress();
                        navigation.navigate("UserProfileMenu");
                    },
                }}
            />
        </Tab.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                headerStyle: globalCss.NavTopStartApp,
            }}
        >
            {!isAuthenticated() ? (
                <>
                    <Stack.Screen
                        name="StartPageScreen"
                        component={StartPageScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="MainTabNavigator"
                        component={MainTabNavigator}
                        options={{headerShown: false}}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="MainTabNavigator"
                        component={MainTabNavigator}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="StartPageScreen"
                        component={StartPageScreen}
                        options={{headerShown: false}}
                    />
                </>
            )}

            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    title: "Введите данные",
                    headerStyle: {backgroundColor: "#ffffff"},
                }}
            />
            <Stack.Screen
                name="IntroductionScreen"
                component={IntroductionScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="PasswordScreen"
                component={PasswordScreen}
                options={{title: "Забыли пароль?"}}
            />
            <Stack.Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
                options={{
                    title: "Изменить пароли",
                    headerStyle: {backgroundColor: "#ffffff"},
                }}
            />

            {/* Place screen here if you need to hide tab bar navigator */}

            <Stack.Screen
                name="CourseLesson"
                component={CourseLesson}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SubscribeScreen"
                component={SubscribeScreen}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                }}
            />

            <Stack.Screen
                name="FlashCardsWordsCategory"
                component={FlashCardsWordsCategory}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="FlashCardsWords"
                component={FlashCardsWords}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="GamesQuiz"
                component={GamesQuiz}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="BooksCategory"
                component={BooksCategory}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="BooksReading"
                component={BooksReading}
                options={{headerShown: false}}
            />

            {/* -------------------------- */}

            <Stack.Screen
                name="Test_buttons_screen"
                component={Test_buttons_screen}
                options={{title: "Test buttons"}}
            />
        </Stack.Navigator>
    );
}

const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{borderLeftColor: "#57cc04"}}
            text1Style={{
                fontSize: 12,
                color: "#494949",
            }}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={{borderLeftColor: "#ca3431"}}
            text1Style={{
                fontSize: 12,
                color: "#494949",
            }}
        />
    ),

    info: (props) => (
        <ErrorToast
            {...props}
            style={{borderLeftColor: "#1cb0f6"}}
            text1Style={{
                fontSize: 12,
                color: "#494949",
            }}
        />
    ),
};

export default function App() {
    return (
        <>
            <AuthProvider>
                <NavigationContainer>
                    <AppStack/>
                    <StatusBar style="auto"/>
                </NavigationContainer>
            </AuthProvider>
            <Toast
                position="bottom"
                config={toastConfig}
                onPress={() => Toast.hide()}
            />
            <FadeNavMenu/>
        </>
    );
}
