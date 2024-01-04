import {StatusBar} from 'expo-status-bar';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGraduationCap, faGamepad, faDiamond, faBars, faBook} from '@fortawesome/free-solid-svg-icons';

import globalCss from './packs/css/globalCss';
import StartPageScreen from './packs/screens-start-app/fiorst-page';
import LoginScreen from './packs/screens-start-app/login';
import ChangePasswordScreen from './packs/screens-start-app/change-password';
import PasswordScreen from './packs/screens-start-app/password-request';
import IntroductionScreen from './packs/screens-start-app/introduction-start';

import CourseScreen from './packs/course';
import CourseLesson from './packs/course_lesson';

import BooksScreen from './packs/books';
import BooksReading from './packs/books_reading';

import GamesScreen from './packs/games';
import GamesQuiz from './packs/games_quiz';

import FlashCardsScreen from './packs/flashcards';
import FlashCardsWords from './packs/flashcards_words';

import MenuScreen from './packs/menu';
import FirstMenu from './packs/screens/FirstMenuScreen';
import SecondMenuScreen from './packs/screens/SecondMenuScreen';
import {AuthProvider} from "./packs/screens/ui/AuthProvider";
import {AlertLoadingProvider} from "./packs/screens/ui/AlertLoadingProvider";
import {AlertConfirmProvider} from "./packs/screens/ui/AlertConfirmPrivider";
import {AlertBaseProvider} from "./packs/screens/ui/AlertBasePrivider";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MenuStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Menu" component={MenuScreen}/>
            <Stack.Screen name="First Menu" component={FirstMenu}/>
            <Stack.Screen name="Second Menu" component={SecondMenuScreen}/>
        </Stack.Navigator>
    );
}

function MenuCourseLesson() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Курс" component={CourseScreen} options={{headerShown: false}}/>
            <Stack.Screen name="course_lesson" component={CourseLesson} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

function MenuBooksReading() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Книги" component={BooksScreen} options={{headerShown: false}}/>
            <Stack.Screen name="books_reading" component={BooksReading} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

function MenuGames() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Играть" component={GamesScreen} options={{headerShown: false}}/>
            <Stack.Screen name="GamesQuiz" component={GamesQuiz}/>
        </Stack.Navigator>
    );
}

function MenuFlasCards() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Флэш-карты" component={FlashCardsScreen} options={{headerShown: false}}/>
            <Stack.Screen name="FlashCardsWords" component={FlashCardsWords}/>
        </Stack.Navigator>
    );
}

function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === 'Курс') {
                        iconName = faGraduationCap;
                    } else if (route.name === 'Книги') {
                        iconName = faBook;
                    } else if (route.name === 'Играть') {
                        iconName = faGamepad;
                    } else if (route.name === 'Флэш-карты') {
                        iconName = faDiamond;
                    } else if (route.name === 'Меню') {
                        iconName = faBars;
                    }
                    return <FontAwesomeIcon icon={iconName} size={size} color={color}/>;
                },
            })}
        >
            <Tab.Screen name="Курс" component={MenuCourseLesson} options={{headerShown: false}}/>
            <Tab.Screen name="Книги" component={MenuBooksReading} options={{headerShown: false}}/>
            <Tab.Screen name="Играть" component={MenuGames} options={{headerShown: false}}/>
            <Tab.Screen name="Флэш-карты" component={MenuFlasCards} options={{headerShown: false}}/>
            <Tab.Screen name="Меню" component={MenuStack} options={{headerShown: false}}/>
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
            <Stack.Screen name="StartPageScreen" component={StartPageScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Введите данные" component={LoginScreen} options={{headerStyle: {backgroundColor: '#ffffff'}}}/>
            <Stack.Screen name="Introduction" component={IntroductionScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Забыли пароль?" component={PasswordScreen}/>
            <Stack.Screen name="Изменить пароли" component={ChangePasswordScreen} options={{headerStyle: {backgroundColor: '#ffffff'}}}/>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}


export default function App() {
    /* Alerts: loading, confirm (1 button) and base (2 buttons) */
    return (
        <AlertLoadingProvider>
            <AlertConfirmProvider>
                <AlertBaseProvider>
                    <AuthProvider>
                        <NavigationContainer>
                            <AppStack/>
                            <StatusBar style="auto"/>
                        </NavigationContainer>
                    </AuthProvider>
                </AlertBaseProvider>
            </AlertConfirmProvider>
        </AlertLoadingProvider>
    );
}
