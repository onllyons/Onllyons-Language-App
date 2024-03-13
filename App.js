import {StatusBar} from "expo-status-bar";
import {Image, LogBox} from "react-native";
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

import AlphabetScreen from "./packs/alphabet";
import AlphabetPagesScreen from "./packs/alphabetPages";
import AboutTheWordScreen from "./packs/about-the-word";

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
import SubscribeScreen from "./packs/screens/SubscribeScreen";
import UserSubscriptionManage from "./packs/user-profile/userSubscriptionManage";

import {AuthProvider} from "./packs/providers/AuthProvider";
import Toast, {BaseToast, ErrorToast} from "react-native-toast-message";
import {FadeNavMenu} from "./packs/components/FadeNavMenu";
import {Analytics} from "./packs/components/analytics/Analytics";
import {StoreProvider} from "./packs/providers/StoreProvider";

import * as Linking from 'expo-linking';
import {StripeProvider} from "@stripe/stripe-react-native";
import {Congratulations} from "./packs/screens/Congragulations";
import PoetryReading from "./packs/poetry_reading";
import DialogReading from "./packs/dialog_reading";
import GamesDecodeAudio from "./packs/games_deode_audio";
import GamesTranslate from "./packs/games_translate";
import GamesTranslateAudio from "./packs/game_translate_audio";
import GamesTrueFalse from "./packs/games_true_false";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import {useEffect} from "react";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const handleTabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export const NAV_HEIGHT = 65

function UserProfileMenu() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MenuScreen"
                component={MenuScreen}
                options={{headerShown: false}}
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
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            initialRouteName="MenuCourseLesson"
            screenOptions={({route}) => ({
                tabBarIcon: ({size, focused}) => {
                    let iconImage;
                    if (route.name === "MenuCourseLesson") {
                        iconImage = require("./packs/images/nav-icon/graduation-cap.png");
                    } else if (route.name === "MenuBooksReading") {
                        iconImage = require("./packs/images/nav-icon/open-book.png");
                    } else if (route.name === "MenuGames") {
                        iconImage = require("./packs/images/nav-icon/game-controller.png");
                    } else if (route.name === "MenuFlasCards") {
                        iconImage = require("./packs/images/nav-icon/flashcards.png");
                    } else if (route.name === "UserProfileMenu") {
                        iconImage = require("./packs/images/nav-icon/menu.png");
                    }

                    const imageStyle = focused
                        ? {
                            width: size + 10,
                            height: size + 10,
                            marginBottom: 0,
                            // color: '#8ac0e6'
                        }
                        : {
                            width: size + 10,
                            height: size + 10,
                            marginBottom: 0,
                            // color: '#8ac0e6'
                        };
                    return (
                        <Image
                            source={iconImage}
                            style={[imageStyle, globalCss.navImage]}
                        />
                    );
                },
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#7b7b7b",
                tabBarStyle: {
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 5,

                    borderTopWidth: 0,
                    height: NAV_HEIGHT + insets.bottom
                },
                tabBarItemStyle: {
                    paddingVertical: 5
                },
                tabBarIconStyle: {
                    paddingTop: 0
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
            <Stack.Screen
                name="StartPageScreen"
                component={StartPageScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="MainTabNavigator"
                component={MainTabNavigator}
                options={{animationEnabled: false, headerShown: false}}
            />

            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{headerShown: false}}
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
                name="GamesDecodeAudio"
                component={GamesDecodeAudio}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="GamesTranslate"
                component={GamesTranslate}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="GamesTranslateAudio"
                component={GamesTranslateAudio}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="GamesTrueFalse"
                component={GamesTrueFalse}
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
            <Stack.Screen
                name="PoetryReading"
                component={PoetryReading}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="DialogReading"
                component={DialogReading}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="UserData"
                component={UserData}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="Congratulations"
                component={Congratulations}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="UserSubscriptionManage"
                component={UserSubscriptionManage}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                }}
            />

            <Stack.Screen
                name="AlphabetScreen"
                component={AlphabetScreen}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                }}
            />

            <Stack.Screen
                name="AlphabetPagesScreen"
                component={AlphabetPagesScreen}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="AboutTheWordScreen"
                component={AboutTheWordScreen}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                }}
            />


        </Stack.Navigator>
    );
}

const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{borderLeftColor: "#57cc04", width: "90%"}}
            text1Style={{
                fontSize: 12,
                color: "#494949",
            }}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={{borderLeftColor: "#ca3431", width: "90%"}}
            text1Style={{
                fontSize: 12,
                color: "#494949",
            }}
        />
    ),

    info: (props) => (
        <ErrorToast
            {...props}
            style={{borderLeftColor: "#1cb0f6", width: "90%"}}
            text1Style={{
                fontSize: 12,
                color: "#494949",
            }}
        />
    ),
};

export default function App() {
    // Deep linking
    useEffect(() => {
        const subscription = Linking.addEventListener("url", ({url}) => handleUrl(url))

        const handleUrl = url => {
            const parsed = Linking.parse(url)

            if (parsed.path === "message" || parsed.hostname === "message") {
                Toast.show({
                    type: parsed.queryParams.type,
                    text1: parsed.queryParams.message
                });
            }
        }

        return () => subscription.remove();
    }, []);

    LogBox.ignoreLogs(["Require cycle"]);

    const prefix = Linking.createURL("/");

    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                Congratulations: "congratulations",
            },
        },
    };

    return (
        <SafeAreaProvider>
            <StripeProvider
                publishableKey="pk_live_51Ndx65Ey5CVgEBCPwAZSDMrjWb1LXVLaF5qL39Uhdy2iy3eJF0Az3qbQfXLD6cJuETjPyjxltHHD1MAYCr53Zrcy00Quf711dA"
                urlScheme="language" // required for 3D Secure and bank redirects
                merchantIdentifier="merchant.com.language" // required for Apple Pay
            >
                <NavigationContainer linking={linking}>
                    <AuthProvider>
                        <StoreProvider>
                            <Analytics/>
                            <AppStack/>
                            <StatusBar style="auto"/>
                        </StoreProvider>
                    </AuthProvider>
                </NavigationContainer>
            </StripeProvider>
            <Toast
                position="bottom"
                config={toastConfig}
                onPress={() => Toast.hide()}
            />
            <FadeNavMenu/>
        </SafeAreaProvider>
    );
}
