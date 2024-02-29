import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native';
import Swiper from 'react-native-swiper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';
import {isAuthenticated, login, useAuth} from "../providers/AuthProvider";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

const ProgressBar = ({currentIndex, totalCount}) => {
    const progress = (currentIndex + 1) / totalCount;
    return (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]}/>
        </View>
    );
};

export default function IntroductionScreen({navigation}) {
    const {setStoredCourseData} = useAuth()
    const swiperRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [isLastSlide, setIsLastSlide] = useState(false);
    const totalSlides = 7;

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) navigation.navigate("MainTabNavigator", {screen: "MenuCourseLesson"})
    }, []);

    const [userData, setUserData] = useState({
        selectedLevel: 0,
        password: "",
        username: "",
        email: "",
        name: ""
    })

    const handleSlideChange = useCallback((newIndex) => {
        if (newIndex < 0) {
            swiperRef.current?.scrollTo(0);
        } else if (newIndex >= totalSlides - 1) {
            setIsLastSlide(true);
        } else {
            setIsLastSlide(false);
        }

        setIndex(newIndex);
    }, []);

    const handleRightButtonPress = useCallback(() => {
        swiperRef.current?.scrollBy(1);
    }, []);

    const handleRegister = () => {
        if (isAuthenticated()) {
            Toast.show({
                type: "error",
                text1: "Вы уже авторизированы"
            });

            navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
        } else {
            setLoader(true)

            sendDefaultRequest(`${SERVER_AJAX_URL}/user/user_signup.php`,
                {...userData},
                navigation,
                {success: false}
            )
                .then(async data => {
                    await login(data.userData, data.tokens)

                    setLoader(false)
                    await new Promise(resolve => setTimeout(resolve, 350))

                    setStoredCourseData(true, () => {
                        navigation.navigate('MainTabNavigator', {screen: "MenuCourseLesson"})
                    })
                })
                .catch(() => {
                    setTimeout(() => setLoader(false), 1)
                })
        }
    }

    return (
        <View style={styles.swiperContent}>

            <Loader visible={loader}/>

            <View style={styles.row}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text><FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.gry}/></Text>
                </TouchableOpacity>
                <ProgressBar currentIndex={index} totalCount={totalSlides}/>
            </View>

            <Swiper
                ref={swiperRef}
                showsButtons={false}
                showsPagination={false}
                loop={false}
                onIndexChanged={handleSlideChange}
            >
                <View style={styles.slide}>
                    <View style={styles.containerText}>
                        <Text style={styles.text}>
                            Добро пожаловать в Onllyons Language.
                        </Text>
                    </View>

                    <Image
                        source={require('../images/El/hello.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.slideLevel}>
                    <ScrollView style={styles.slideFormInp} contentContainerStyle={{paddingTop: 25, paddingBottom: 100}}>
                        <Image
                            source={require('../images/El/regIm.png')}
                            style={styles.imageReg}
                        />

                        <View>
                            <AnimatedButtonShadow
                                styleButton={[
                                    globalCss.buttonRow,
                                    globalCss.buttonGry1,
                                    userData.selectedLevel === 0 && styles.selectedButton
                                ]}
                                permanentlyActive={userData.selectedLevel === 0}
                                shadowColor={"gray1"}
                                onPress={() => setUserData(prev => ({...prev, selectedLevel: 0}))}
                            >
                                <Image
                                    source={require('../images/icon/level1.png')}
                                    style={styles.imageRegLevel}
                                />
                                <Text style={styles.buttonText}>Я знаю некоторые слова и фразы</Text>
                            </AnimatedButtonShadow>
                            <AnimatedButtonShadow
                                styleButton={[
                                    globalCss.buttonRow,
                                    globalCss.buttonGry1,
                                    userData.selectedLevel === 1 && styles.selectedButton
                                ]}
                                permanentlyActive={userData.selectedLevel === 1}
                                shadowColor={"gray1"}
                                onPress={() => setUserData(prev => ({...prev, selectedLevel: 1}))}
                            >
                                <Image
                                    source={require('../images/icon/level2.png')}
                                    style={styles.imageRegLevel}
                                />
                                <Text style={styles.buttonText}>Я могу вести простой разговор</Text>
                            </AnimatedButtonShadow>
                            <AnimatedButtonShadow
                                styleButton={[
                                    globalCss.buttonRow,
                                    globalCss.buttonGry1,
                                    userData.selectedLevel === 2 && styles.selectedButton
                                ]}
                                permanentlyActive={userData.selectedLevel === 2}
                                shadowColor={"gray1"}
                                onPress={() => setUserData(prev => ({...prev, selectedLevel: 2}))}
                            >
                                <Image
                                    source={require('../images/icon/level3.png')}
                                    style={styles.imageRegLevel}
                                />
                                <Text style={styles.buttonText}>У меня средний уровень или выше</Text>
                            </AnimatedButtonShadow>
                        </View>


                    </ScrollView>
                </View>
                <View style={styles.slideLevel}>

                    <Image
                        source={require('../images/El/regName.png')}
                        style={styles.imageRegInp}
                    />

                    <View style={styles.slideFormInp}>
                        <View style={styles.inputView}>
                            <TextInput
                                placeholder="Полное имя и фамилия"
                                placeholderTextColor="#373737"
                                style={globalCss.input}
                                value={userData.name}
                                onChangeText={val => setUserData(prev => ({...prev, name: val}))}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.slideLevel}>

                    <Image
                        source={require('../images/El/regLog.png')}
                        style={styles.imageRegInp}
                    />

                    <View style={styles.slideFormInp}>
                        <View style={styles.inputView}>
                            <TextInput
                                placeholder="Минимум 5 букв в логине"
                                placeholderTextColor="#373737"
                                style={globalCss.input}
                                value={userData.username}
                                onChangeText={val => setUserData(prev => ({...prev, username: val}))}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.slideLevel}>

                    <Image
                        source={require('../images/El/regEmail.png')}
                        style={styles.imageRegInp}
                    />

                    <View style={styles.slideFormInp}>
                        <View style={styles.inputView}>
                            <TextInput
                                placeholder="Не забудьте подтвердить его позже"
                                placeholderTextColor="#373737"
                                style={globalCss.input}
                                value={userData.email}
                                onChangeText={val => setUserData(prev => ({...prev, email: val}))}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.slideLevel}>

                    <Image
                        source={require('../images/El/regPass.png')}
                        style={styles.imageRegInp}
                    />

                    <View style={styles.slideFormInp}>
                        <View style={styles.inputView}>
                            <TextInput
                                placeholder="Создайте пароль для регистрации"
                                placeholderTextColor="#373737"
                                style={globalCss.input}
                                value={userData.password}
                                onChangeText={val => setUserData(prev => ({...prev, password: val}))}
                            />
                        </View>

                    </View>
                </View>

                <View style={styles.slideLevel}>
                    <View style={styles.finishSlided}>
                        <Image
                            source={require("../images/El/regFinish.png")}
                            style={styles.regFinish}
                        />
                        <Text style={styles.finishTxt}>
                            Поздравляем с началом изучения английского! 🎉
                            Создайте профиль и присоединяйтесь к нам в этом увлекательном путешествии.
                            Добро пожаловать! 😊🚀
                        </Text>
                    </View>
                </View>
            </Swiper>
            <SwiperButtonsContainer
                onRightPress={handleRightButtonPress}
                isLastSlide={isLastSlide}
                handleRegister={handleRegister}
            />
        </View>
    );
}

const SwiperButtonsContainer = ({onRightPress, isLastSlide, handleRegister}) => (
    <View style={styles.swiperButtonsContainer}>
        <AnimatedButtonShadow
            styleButton={[globalCss.button, globalCss.buttonPurple]}
            onPress={() => {
                if (isLastSlide) handleRegister()
                else onRightPress()
            }}
            size={"full"}
            shadowColor={"purple"}
        >
            <Text style={[globalCss.buttonText, globalCss.textUpercase]}>{isLastSlide ? "Зарегистрироваться" : "Продолжить"}</Text>
        </AnimatedButtonShadow>
    </View>
);


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginTop: '20%',
        height: '3%',
    },
    swiperContent: {
        height: '100%',
        paddingBottom: '10%',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slideLevel: {
        flex: 1,
    },
    containerText: {
        width: '80%',
    },
    text: {
        color: '#212121',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    progressBarContainer: {
        flex: 1,
        backgroundColor: '#3a464e',
        borderRadius: 10,
        marginRight: '5%'
    },
    progressBar: {
        flex: 1,
        backgroundColor: '#ffeb3b',
        borderRadius: 10,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '14%',
        paddingLeft: '2%',
        paddingRight: '1%',
        textAlign: 'center',
        alignSelf: 'center'
    },
    image: {
        width: '90%',
        height: '60%',
        marginTop: 20,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    slideFormInp: {
        width: '100%',
        paddingHorizontal: 20,
    },
    titleInput: {
        color: '#373737',
        fontWeight: '700',
        fontSize: 23,
        marginBottom: 10,
    },
    inputView: {
        borderBottomWidth: 2.1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        borderLeftWidth: 2.1,
        backgroundColor: '#f3f3f3',
        borderRightWidth: 2.1,
        paddingLeft: 12,
        borderTopWidth: 2.1,
        borderRadius: 14,
        paddingBottom: 17,
        paddingTop: 17,
    },
    imageRegInp: {
        width: '90%',
        height: '27%',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 40,
        resizeMode: 'contain'
    },
    swiperButtonsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    imageReg: {
        width: '97%',
        height: '27%',
        marginTop: 10,
        marginBottom: 40,
        resizeMode: 'contain'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 14,
    },
    selectedButton: {
        backgroundColor: '#d6d6d6',
    },
    buttonText: {
        width: '80%',
        marginLeft: 18,
        color: '#333',
        fontSize: 19,
    },
    imageRegLevel: {
        width: '15%',
        resizeMode: 'contain'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logoEl: {
        width: '60%',
        height: '60%',
        resizeMode: 'contain'
    },
    regFinish: {
        width: '100%',
        height: '70%',
        resizeMode: 'contain'
    },
    finishSlided: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    finishTxt: {
        color: '#333',
        fontSize: 19,
        marginTop: 30,
        alignSelf: 'center',
        textAlign: 'center',
    },


});
