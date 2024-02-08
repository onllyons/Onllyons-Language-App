import React, {useState, useRef, useEffect, useMemo} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity, Animated, Dimensions, Pressable
} from "react-native";

// button info category from card top fixed
import {DefaultButtonDown} from "./components/buttons/DefaultButtonDown";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// icons
import {faStar, faFire} from "@fortawesome/free-solid-svg-icons";

// styles
import globalCss from "./css/globalCss";
import {stylesCourse_lesson as styles} from "./css/course_main.styles";

// progress bar
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import Loader from "./components/Loader";
import Modal from 'react-native-modal';
import {SubscribeModal} from "./components/SubscribeModal";
import {fadeInNav, fadeOutNav} from "./components/FadeNavMenu";

export default function CourseScreen({navigation}) {
    const [pressedCards, setPressedCards] = useState({});
    const [data, setData] = useState(null);
    const [loadedCategories, setLoadedCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState({
        name: "",
        url: ""
    });
    const scrollViewRef = useRef(null);

    const startLayoutY = useRef(0)
    const categoriesPos = useRef({})

    const [isCardPressedCourseTitle, setIsCardPressedCourseTitle] = useState(false);

    const categoriesData = useRef({})

    const [loader, setLoader] = useState(false)

    const [isCardPressedSentences, setIsCardSentences] = useState(false);
    const [isCardPressedProcente, setIsCardProgressProcente] = useState(false);

    // анимация для начального верхнего изображения
    const moveAnimation = useRef(new Animated.Value(0)).current;
    const imageYPos = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop( // Repetă animația
            Animated.sequence([ // Creează o secvență de animații
                Animated.timing(moveAnimation, {
                    toValue: -10, // Mișcă în sus cu 10 unități
                    duration: 1000, // Durata animației în milisecunde
                    useNativeDriver: true, // Folosește driverul nativ pentru performanță îmbunătățită
                }),
                Animated.timing(moveAnimation, {
                    toValue: 0, // Mișcă înapoi la poziția inițială
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);
    const startImageAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(imageYPos, {
                    toValue: 10, // Mișcă imaginea în jos cu 10 unități (nu pixeli, deoarece React Native folosește unități de densitate independentă)
                    duration: 1000, // Durata animației în milisecunde
                    useNativeDriver: true, // Folosește driver-ul nativ pentru performanță îmbunătățită
                }),
                Animated.timing(imageYPos, {
                    toValue: -10, // Mișcă imaginea înapoi în sus
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    };
    // etd анимация для начального верхнего изображения

    const handleScroll = (nativeEvent) => {
        let currCategoryOnScroll = currentCategory

        for (const category of Object.keys(categoriesPos.current)) {
            if (nativeEvent.contentOffset.y >= categoriesPos.current[category]) {
                currCategoryOnScroll = {
                    name: data[category].categoryTitle,
                    url: category
                }
            }
        }

        if (currCategoryOnScroll.name !== currentCategory.name) {
            setCurrentCategory(currCategoryOnScroll)
        }

        // Funcție pentru a verifica dacă utilizatorul a ajuns aproape de sfârșitul listei
        if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 150) {
            loadNextCategory();
        }
    };


    useMemo(() => {
        setLoader(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/course/get_categories.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                const groupedData = groupByCategory(data.data);
                setData(groupedData);

                const initialCategories = Object.keys(groupedData).slice(0, 1);
                setLoadedCategories(initialCategories);

                categoriesData.current = data.categoriesData

                if (initialCategories.length > 0) {
                    setCurrentCategory({
                        name: groupedData[initialCategories[0]].categoryTitle,
                        url: initialCategories[0]
                    });
                }
            })
            .catch((err) => {
                if (typeof err === "object") {
                    if (!err.tokensError) {
                        navigation.goBack()
                    }
                }
            })
            .finally(() => {
                setTimeout(() => setLoader(false), 1)
            })
    }, []);


    // Funcție pentru gruparea datelor pe categorii
    const groupByCategory = (data) => {
        return data.reduce((acc, item) => {
            // Crează o nouă categorie dacă nu există
            if (!acc[item.category_url]) {
                acc[item.category_url] = {
                    items: [],
                    categoryTitle: item.categoryTitle, // Stochează var_idtest_1 pentru fiecare categorie
                };
            }

            // Adaugă item-ul la categoria respectivă
            acc[item.category_url].items.push(item);

            return acc;
        }, {});
    };


    // Funcție pentru încărcarea următoarei categorii
    const loadNextCategory = () => {
        const allCategories = Object.keys(data);
        const nextIndex = loadedCategories.length;

        if (nextIndex < allCategories.length) {
            setLoadedCategories([...loadedCategories, allCategories[nextIndex]]);
        }
    }

    const onPressIn = (id) => {
        setPressedCards((prevState) => ({...prevState, [id]: true}));
    };

    const onPressOut = (id) => {
        setPressedCards((prevState) => ({...prevState, [id]: false}));
    };

    const getMarginLeftForCard = (index) => {
        const pattern = [40, 30, 20, 30, 40, 50]; // Modelul pentru marginLeft
        return pattern[index % 6]; // Repetă modelul la fiecare 6 carduri
    };

    const heightsNav = useRef({
        navTop: 100,
        navTopMenu: {}
    });


    // Nav top Menu
    // For animation slide
    const topPositionNavTopMenus = useRef({}).current;

    // For animation arrows
    const topPositionNavTopArrows = useRef({}).current;

    // Current opened menu
    const openedNavMenu = useRef(null)

    // Nav top background
    const {width: windowWidth} = Dimensions.get("window");
    const navTopBgTranslateX = useRef(new Animated.Value(windowWidth))
    const navTopBgOpacity = useRef(new Animated.Value(0))

    // Open/close nav menu by id
    const toggleNavTopMenu = (id = null) => {
        if (id === null) {
            if (openedNavMenu.current !== null) id = openedNavMenu.current
            else return
        }

        if (openedNavMenu.current !== null && openedNavMenu.current !== id) {
            Animated.parallel([
                Animated.spring(topPositionNavTopMenus[openedNavMenu.current], {
                    toValue: 0,
                    duration: 500,
                    bounciness: 0,
                    useNativeDriver: true,
                }),
                topPositionNavTopArrows[openedNavMenu.current] && Animated.spring(topPositionNavTopArrows[openedNavMenu.current], {
                    toValue: 0,
                    duration: 500,
                    bounciness: 0,
                    useNativeDriver: true,
                }),
                Animated.spring(topPositionNavTopMenus[id], {
                    toValue: heightsNav.current.navTopMenu[id] - 1,
                    duration: 500,
                    bounciness: 0,
                    useNativeDriver: true,
                }),
                topPositionNavTopArrows[id] && Animated.spring(topPositionNavTopArrows[id], {
                    toValue: -8,
                    bounciness: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(topPositionNavTopMenus[id], {
                    toValue: openedNavMenu.current === id ? 0 : heightsNav.current.navTopMenu[id] - 1,
                    bounciness: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                topPositionNavTopArrows[id] && Animated.spring(topPositionNavTopArrows[id], {
                    toValue: openedNavMenu.current === id ? 0 : -8,
                    bounciness: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();

            Animated.timing(navTopBgTranslateX.current, {
                toValue: openedNavMenu.current === id ? windowWidth : 0,
                duration: 1,
                delay: openedNavMenu.current === id ? 500 : 0,
                useNativeDriver: true,
            }).start()
            Animated.timing(navTopBgOpacity.current, {
                toValue: openedNavMenu.current === id ? 0 : 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }

        // Fade bottom nav menu
        if (openedNavMenu.current === id) fadeOutNav()
        else if (openedNavMenu.current === null) fadeInNav(() => toggleNavTopMenu())

        openedNavMenu.current = openedNavMenu.current === id ? null : id
    };

    const [isModalVisible, setModalVisible] = useState(false);
    const [subscriptionModalVisible, setSubscriptionVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View>
            <Loader visible={loader}/>

            <View style={globalCss.navTabUser}
                  onLayout={event => heightsNav.current.navTop = event.nativeEvent.layout.height}>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("language")}>
                    <Image
                        source={require("./images/other_images/nav-top/english.webp")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>EN</Text>
                    <AnimatedNavTopArrow id={"language"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={styles.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser}  onPress={() => toggleNavTopMenu("courseLessonAnalytics")}>
                    <Image
                        source={require("./images/other_images/nav-top/insurance.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["finished"] : 0}</Text>
                    <AnimatedNavTopArrow id={"courseLessonAnalytics"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={styles.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("consecutiveDaysSeries")}>
                    <Image
                        source={require("./images/other_images/nav-top/flame.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>4</Text>

                    <AnimatedNavTopArrow id={"consecutiveDaysSeries"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={styles.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu(0)}>
                    <Image
                        source={require("./images/other_images/nav-top/pero.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["phrasesCompleted"] : 0}</Text>
 
                    <AnimatedNavTopArrow id={0} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={styles.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
            </View>

            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"language"}>
                <View style={styles.containerSentences}>
                    <View style={styles.rowContainerLanguageSelect}>
                        <TouchableOpacity style={styles.containerLanguageSelect}>
                            <Image
                                source={require('./images/country-flags/usa.png')}
                                style={styles.flagsLang}
                            />
                            <View style={globalCss.alignSelfCenter}>
                                <Text style={styles.textLangSelect}>English</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.containerLanguageSelect}>
                            <Image
                                source={require('./images/country-flags/addmore.png')}
                                style={styles.flagsLang}
                            />
                            <View style={globalCss.alignSelfCenter}>
                                <Text style={styles.textLangSelect}>Добавить</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </AnimatedNavTopMenu>

            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"courseLessonAnalytics"}>
                <View style={styles.containerSentences}>
                    <Text style={styles.timeframe1}>cite lectii o invatat din totalul existent</Text>
                    <Text style={styles.timeframe1}>ce procentaj</Text>
                    <Text style={styles.timeframe1}>cite minute o invatat sau ore</Text>
                    <Text style={styles.timeframe1}>cite quiz o trecut din existente se poate si procent</Text>
                    <Text style={styles.timeframe1}>Текущая серия</Text>
                    <Text style={styles.timeframe1}>Текущая серия</Text>
                    <Text style={styles.timeframe1}>Текущая серия</Text>
                    <Text style={styles.timeframe1}>Текущая серия</Text>
                    <Text style={styles.timeframe1}>Текущая серия</Text>
                </View>
            </AnimatedNavTopMenu>



            {/* First nav menu */}
            {/* aici */}
            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"consecutiveDaysSeries"}>
                <View style={styles.containerSentences}>

                    

                    
                    <View style={styles.containerResultDataSce1}>
                      <View style={styles.cardDataDayCurrent}>
                          <Image
                              source={require('./images/other_images/fire.png')}
                              style={styles.imageAnalyticsDay}
                          />
                          <Text style={styles.percentage1}>3 дня дней</Text>
                          <Text style={styles.timeframe1}>Текущая серия</Text>
                      </View>

                      <View style={styles.cardDataDayLong}>
                          <Image
                              source={require('./images/other_images/deadline.png')}
                              style={styles.imageAnalyticsDay}
                          />
                          <Text style={styles.percentage1}>3 дня дней</Text>
                          <Text style={styles.timeframe1}>Самая длинная серия</Text>
                      </View>
                    </View>

                    <View style={styles.containerResultDataSce1}>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Пн</Text>
                            <Image
                                source={require('./images/other_images/check.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Вт</Text>
                            <Image
                                source={require('./images/other_images/checkGry.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Ср</Text>
                            <Image
                                source={require('./images/other_images/check.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Чт</Text>
                            <Image
                                source={require('./images/other_images/check.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Пт</Text>
                            <Image
                                source={require('./images/other_images/checkBlue.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Сб</Text>
                            <Image
                                source={require('./images/other_images/checkBlue.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={styles.boxDay}>
                            <Text style={styles.dayW}>Вс</Text>
                            <Image
                                source={require('./images/other_images/checkGry.png')}
                                style={styles.imageAnalyticsDayCheck}
                            />
                        </View>
                    </View>
                    <View style={globalCss.alignItemsCenter}>
                        <Text style={styles.titleh7}>
                            <FontAwesomeIcon icon={faFire} size={20} style={{ color: 'orange', marginRight: 7 }} /> 
                            You're on fire!
                        </Text>
                    </View>
                      

                    {/* way to go! */}
                    {/* Nice work! */}
                    {/* Great job! */}
                    {/* Keep it up! */}
                    {/* Well done! */}
                    {/* Fantastic! */}
                    {/* Keep on shining! */}
                    {/* Brilliant execution! */}
                    {/* You're smashing it! */}
                    {/* Outstanding performance! */}
                    {/* You're killing it! */}

                </View>
            </AnimatedNavTopMenu>

            {/* Second nav menu */}
            <AnimatedNavTopMenu 
              topPositionNavTopMenus={topPositionNavTopMenus} 
              heightsNav={heightsNav} 
              id={0}>

                <View style={styles.containerSentences}>
                  <Text style={styles.titleh5}>Фразы, которые ты освоил</Text>
                  <Text style={styles.titleh6}>Твой Прогресс в Обучении!</Text>

                  <View style={styles.rowBlockSentences}>

                    <AnimatedCircularProgress
                      size={160}
                      width={21}
                      fill={75}
                      tintColor="#ffd100"
                      backgroundColor="#748895"
                      lineCap="round"
                    >
                      {
                        (fill) => (
                          <>
                            <Text style={styles.resultProgressBar}>
                              {`${Math.round(fill)}%`}
                            </Text>
                          </>
                        )
                      }
                    </AnimatedCircularProgress>

                          <View style={styles.containerResultDataSce}>
                            <TouchableOpacity 
                              style={[styles.cardDataSce, isCardPressedSentences ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry]}
                              onPressIn={() => setIsCardSentences(true)}
                              onPressOut={() => setIsCardSentences(false)}
                              activeOpacity={1}
                            >
                                <Text style={styles.percentage}>341</Text>
                                <Text style={styles.timeframe}>Всего изучено из 5888</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={[styles.cardDataSce, isCardPressedProcente ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry]}
                              onPressIn={() => setIsCardProgressProcente(true)}
                              onPressOut={() => setIsCardProgressProcente(false)}
                              activeOpacity={1}
                            >
                                <Text style={styles.percentage}>44%</Text>
                                <Text style={styles.timeframe}>Прогресс курса из 100%</Text>
                            </TouchableOpacity>
                          </View>

                  </View>
                </View>

            </AnimatedNavTopMenu>

            {/* Background for nav menu */}
            <AnimatedNavTopBg navTopBgTranslateX={navTopBgTranslateX.current}
                              navTopBgOpacity={navTopBgOpacity.current} toggleNavTopMenu={toggleNavTopMenu}/>

            <View style={{...styles.infoCourseSubject, top: heightsNav.current.navTop}}>
                <TouchableOpacity
                    style={[styles.cardCategoryTitle, isCardPressedCourseTitle ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
                    onPressIn={() => setIsCardPressedCourseTitle(true)}
                    onPressOut={() => setIsCardPressedCourseTitle(false)}
                    activeOpacity={1}
                >
                    <Text style={styles.infoCourseTxtSubCat}>Subject 1</Text>
                    <Text style={styles.infoCourseTitle}>{currentCategory.name}</Text>
                </TouchableOpacity>

                <DefaultButtonDown style={{...styles.infoCourseBtn, ...globalCss.buttonGreen}}
                                   onPress={toggleModal}>
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.infoCategoryImg}
                    />
                </DefaultButtonDown>
                {/*<TouchableOpacity*/}
                {/*    style={[styles.infoCourseBtn, isCardPressedCourseDetails ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}*/}
                {/*    onPressIn={() => setIsCardPressedCourseDetails(true)}*/}
                {/*    onPressOut={() => setIsCardPressedCourseDetails(false)}*/}
                {/*    onPress={toggleModal}*/}
                {/*    activeOpacity={1}*/}
                {/*>*/}
                {/*    <Image*/}
                {/*        source={require('./images/icon/infoCategory.png')}*/}
                {/*        style={styles.infoCategoryImg}*/}
                {/*    />*/}
                {/*</TouchableOpacity>*/}
            </View>

            <Modal
                isVisible={isModalVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackdropPress={toggleModal}
                style={{justifyContent: 'flex-end', margin: 0}}
            >
                <View style={styles.modal}>

                    {/*<View style={styles.headerModalCat}>
                <TouchableOpacity style={styles.closeModalCourse} onPress={toggleModal}>
                  <Text>
                      <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.link}/>
                  </Text>
                </TouchableOpacity>
                <View style={styles.headerTitleModalCat}>
                  <Text style={styles.headerTitleModalCatTxt}>Обзор категории</Text>
                </View>
            </View> */}

                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{paddingTop: 25, paddingBottom: 80}}
                        style={styles.modalCourseContent}>
                        <View style={styles.infoCatTitle}>
                            <Image
                                source={require("./images/El/inGlasses.png")}
                                style={styles.courseCatImg}
                            />
                            <View style={styles.titleLessonCat}>
                                <Text style={styles.titleLessonCatSubject}>Subject 1</Text>
                                <Text style={styles.titleLessonCatTxt}>{currentCategory.name}</Text>
                            </View>
                        </View>

                        <View style={styles.infoDetExtraCat}>


                            <View style={styles.infoDetCatTitle}>
                                <Image
                                    source={require("./images/icon/book.png")}
                                    style={styles.courseDetCatImg}
                                />
                                <View style={styles.titleDetLessonCat}>
                                    <Text style={styles.titleDetLessonCatSubject}>{categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["courses"] : 0} уроков</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>Вперёд навстречу {categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["courses"] : 0} увлекательным
                                        приключениям!</Text>
                                </View>
                            </View>

                            <View style={styles.horizontalLine}/>

                            <View style={styles.infoDetCatTitle}>
                                <Image
                                    source={require("./images/icon/brain.png")}
                                    style={styles.courseDetCatImg}
                                />
                                <View style={styles.titleDetLessonCat}>
                                    <Text style={styles.titleDetLessonCatSubject}>{categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["quizzes"] : 0} испытаний</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>Отправляйся в путешествие через {categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["quizzes"] : 0} мир возможностей!</Text>
                                </View>
                            </View>

                            <View style={styles.horizontalLine}/>

                            <View style={styles.infoDetCatTitle}>
                                <Image
                                    source={require("./images/icon/hourglass.png")}
                                    style={styles.courseDetCatImg}
                                />
                                <View style={styles.titleDetLessonCat}>
                                    <Text style={styles.titleDetLessonCatSubject}>Более {Math.floor(categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url]["coursesHours"] : 0)} часов погружения</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>полного погружения в знания</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </Modal>

            <SubscribeModal visible={subscriptionModalVisible} setVisible={setSubscriptionVisible}/>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{paddingTop: 140, paddingBottom: 20}}
                style={styles.bgCourse}
                onScroll={e => handleScroll(e.nativeEvent)}
                onLayout={(e) => startLayoutY.current = e.nativeEvent.layout.y}
            >
                <View style={styles.container}>
                    <View style={styles.contentFlashCards}>

                        {/*<TouchableOpacity onPress={() => setSubscriptionVisible(true)} activeOpacity={1}>
                        <Text>subscription modal</Text>
                    </TouchableOpacity>*/}

                        {loadedCategories.map((category, categoryIndex) => (
                            <View key={category}
                                  onLayout={(event) => categoriesPos.current[category] = event.nativeEvent.layout.y + startLayoutY.current}>

                                {categoryIndex > 0 && (
                                    <View style={styles.categoryTitleBg}>
                                        <View style={styles.hrLine}></View>
                                        <Text style={styles.categoryTitle}>
                                            {data[category].categoryTitle}
                                        </Text>
                                        <View style={styles.hrLine}></View>
                                    </View>
                                )}


                                
                            <View>
                                <Image source={require("./images/El/course/Group.png")} style={styles.elCourseImg}/>
                            </View>
                            


                                <View>
                                    <Animated.View
                                        style={{
                                            transform: [{translateY: moveAnimation}],
                                        }}
                                    >
                                        <Image source={require("./images/other_images/start.png")}
                                               style={styles.startImg}/>
                                    </Animated.View>
                                </View>


                                {data[category].items.map((item, index) => (
                                    // <DefaultButtonDown style={[
                                    //     {
                                    //         marginLeft: `${getMarginLeftForCard(index)}%`,
                                    //     },
                                    //     styles.card,
                                    //     pressedCards[item.id]
                                    //         ? [styles.cardPressed, styles.bgGryPressed]
                                    //         : styles.bgGry,
                                    // ]} onPress={() => navigation.navigate("CourseLesson", {url: item.url})}>
                                    //     <Text>
                                    //         <FontAwesomeIcon
                                    //             icon={faStar}
                                    //             size={18}
                                    //             style={styles.iconFlash}
                                    //         />
                                    //     </Text>
                                    //     <Text>{item.title}</Text>
                                    // </DefaultButtonDown>
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            {
                                                marginLeft: `${getMarginLeftForCard(index)}%`,
                                            },
                                            styles.card,
                                            pressedCards[item.id]
                                                ? [styles.cardPressed, styles.bgGryPressed]
                                                : styles.bgGry,
                                        ]}
                                        onPress={() =>
                                            navigation.navigate("CourseLesson", {url: item.url})
                                        }
                                        onPressIn={() => onPressIn(item.id)}
                                        onPressOut={() => onPressOut(item.id)}
                                        activeOpacity={1}
                                    >
                                        <Text>
                                            {item.finished ? "Этот урок завершен" : ""}
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                size={30}
                                                style={styles.iconFlash}
                                            />
                                        </Text>
                                        {/*<Text>{item.title}</Text>*/}

                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const AnimatedNavTopArrow = React.memo(({children, id, topPositionNavTopArrows}) => {
    if (!topPositionNavTopArrows[id]) topPositionNavTopArrows[id] = new Animated.Value(0)

    return (
        <Animated.View
            style={{
                ...styles.navTopArrowView,
                transform: [{translateY: topPositionNavTopArrows[id]}]
            }}
        >
            {children}
        </Animated.View>
    )
})

const AnimatedNavTopMenu = React.memo(({children, id, topPositionNavTopMenus, heightsNav}) => {
    if (!topPositionNavTopMenus[id]) topPositionNavTopMenus[id] = new Animated.Value(0)
    if (!heightsNav.current.navTopMenu[id]) heightsNav.current.navTopMenu[id] = 99999

    return (
        <Animated.View
            style={{
                ...styles.navTopModal,
                top: -heightsNav.current.navTopMenu[id] + heightsNav.current.navTop,
                transform: [{translateY: topPositionNavTopMenus[id]}]
            }}
            onLayout={event => heightsNav.current.navTopMenu[id] = Math.ceil(event.nativeEvent.layout.height + 1)}
        >
            <View style={styles.navTopModalIn}>
                {children}
            </View>
        </Animated.View>
    )
})

const AnimatedNavTopBg = React.memo(({navTopBgTranslateX, navTopBgOpacity, toggleNavTopMenu}) => {
    return (
        <Animated.View
            style={{
                ...styles.navTopBg,
                opacity: navTopBgOpacity,
                transform: [{translateX: navTopBgTranslateX}]
            }}
        >
            <Pressable style={{width: "100%", height: "100%"}} onPress={() => toggleNavTopMenu()}></Pressable>
        </Animated.View>
    )
})













