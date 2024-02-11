import React, {useState, useRef, useEffect, useMemo} from "react";
import {
    View,
    Text,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity, Animated, Dimensions, Pressable
} from "react-native";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// icons
import {faStar, faFire} from "@fortawesome/free-solid-svg-icons";

// styles
import globalCss from "./css/globalCss";
import {stylesCourse_lesson as styles} from "./css/course_main.styles";
import {stylesnav_dropdown as navDropdown} from "./css/navDropDownTop.styles";

// progress bar
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import Loader from "./components/Loader";
import Modal from 'react-native-modal';
import {SubscribeModal} from "./components/SubscribeModal";
import {fadeInNav, fadeOutNav} from "./components/FadeNavMenu";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";
import {useNavigation} from "@react-navigation/native";
import {getDayWord, getHourWord} from "./utils/Utls";

export default function CourseScreen({navigation}) {
    const [data, setData] = useState(null);
    const [showDataToIndex, setShowDataToIndex] = useState(3)
    const [currentCategory, setCurrentCategory] = useState({
        name: "",
        url: "",
        subject: 1
    });
    const [phrasesPercent, setPhrasesPercent] = useState({
        category: "",
        percent: 0
    })
    const scrollViewRef = useRef(null);

    const startLayoutY = useRef(0)
    const categoriesPos = useRef([])

    const categoriesData = useRef({})
    const seriesData = useRef({})
    const generalInfo = useRef({})

    const [loader, setLoader] = useState(false)

    const skipLoaded = useRef(true)

    const handleScroll = (nativeEvent) => {
        let currCategoryOnScroll = currentCategory
        let currShowToDataIndex = 0

        for (const value of categoriesPos.current) {
            if (nativeEvent.contentOffset.y >= value[1]) {
                currCategoryOnScroll = {
                    name: data[value[0]].categoryTitle.trim(),
                    url: value[0],
                    subject: value[2]
                }

                currShowToDataIndex = value[2]

                break
            }
        }

        if (currCategoryOnScroll.name !== currentCategory.name) setCurrentCategory(currCategoryOnScroll)
        if (currShowToDataIndex >= showDataToIndex) {
            if (!skipLoaded.current) {
                setShowDataToIndex(Math.min(Object.keys(data).length, currShowToDataIndex + 3))
                skipLoaded.current = true
            } else {
                skipLoaded.current = false
            }
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

                const firstCategory = Object.keys(groupedData)[0];

                categoriesData.current = data.categoriesData
                seriesData.current = data.seriesData
                generalInfo.current = data.generalInfo

                setCurrentCategory({
                    name: groupedData[firstCategory].categoryTitle.trim(),
                    url: firstCategory,
                    subject: 1
                });
            })
            .catch(() => {})
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

    // Nav top Menu

    const navTopMenuCallbacks = useRef({}).current

    const heightsNav = useRef({
        navTop: 100,
        navTopMenu: {}
    });

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

    // Bug on android
    const [firstOpenMenu, setFirstOpenMenu] = useState(false)

    // Open/close nav menu by id
    const toggleNavTopMenu = (id = null) => {
        if (!firstOpenMenu) setFirstOpenMenu(true)

        if (id === null) {
            if (openedNavMenu.current !== null) id = openedNavMenu.current
            else return
        }

        if (openedNavMenu.current !== null && openedNavMenu.current !== id) {
            navTopMenuCallbacks[openedNavMenu.current].onClose()
            navTopMenuCallbacks[id].onOpen()

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
                    toValue: heightsNav.current.navTopMenu[id] - 1 + heightsNav.current.navTop,
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
            if (openedNavMenu.current === id) navTopMenuCallbacks[id].onClose()
            else navTopMenuCallbacks[id].onOpen()

            Animated.parallel([
                Animated.spring(topPositionNavTopMenus[id], {
                    toValue: openedNavMenu.current === id ? 0 : heightsNav.current.navTopMenu[id] - 1 + heightsNav.current.navTop,
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

    const handleButtonPress = () => {
        // Afiseaza alerta cu mesajul dorit în limba rusă
        Alert.alert(
            "Новые языки скоро будут добавлены",
            "В скором времени будут добавлены новые языки",
            [
                {text: "OK"}
            ],
            {cancelable: false}
        );

    };

    const getCategoryData = (value, undefinedValue = 0) => {
        return categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url][value] : undefinedValue
    }

    const getImgByVisit = day => {
        if (!seriesData.current["daysVisited"]) return require("./images/other_images/checkGry.png")

        return seriesData.current["daysVisited"][day]["visited"] ? (seriesData.current["daysVisited"][day]["visitedMore"] ? require("./images/other_images/checkBlue.png") : require("./images/other_images/check.png")) : require("./images/other_images/checkGry.png")
    }

    const SyllableGroup = () => {
        switch (seriesData.current["syllableGroup"]) {
            case 3:
                return (
                    <Text>Группа 3</Text>
                )

            case 2:
                return (
                    <Text>Группа 2</Text>
                )

            case 1:
            default:
                return (
                    <Text>Группа 1</Text>
                )
        }
    }

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
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser}
                                  onPress={() => toggleNavTopMenu("courseLessonAnalytics")}>
                    <Image
                        source={require("./images/other_images/nav-top/mortarboard.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text
                        style={globalCss.dataNavTop}>{getCategoryData("finished")}</Text>
                    <AnimatedNavTopArrow id={"courseLessonAnalytics"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser}
                                  onPress={() => toggleNavTopMenu("consecutiveDaysSeries")}>
                    <Image
                        source={require("./images/other_images/nav-top/flame.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{seriesData.current.currentSeries ? seriesData.current.currentSeries : 0}</Text>

                    <AnimatedNavTopArrow id={"consecutiveDaysSeries"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("phrasesModal")}>
                    <Image
                        source={require("./images/other_images/nav-top/feather.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text
                        style={globalCss.dataNavTop}>{getCategoryData("phrasesCompleted")}</Text>

                    <AnimatedNavTopArrow id={"phrasesModal"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
            </View>

            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"language"} navTopMenuCallbacks={navTopMenuCallbacks}>
                <View style={navDropdown.containerSentences}>
                    <View style={navDropdown.rowContainerLanguageSelect}>
                        <TouchableOpacity style={navDropdown.containerLanguageSelect}>
                            <Image
                                source={require('./images/country-flags/usa.png')}
                                style={navDropdown.flagsLang}
                            />
                            <View style={globalCss.alignSelfCenter}>
                                <Text style={navDropdown.textLangSelect}>English</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={navDropdown.containerLanguageSelect} onPress={handleButtonPress}>
                            <Image
                                source={require('./images/country-flags/addmore.png')}
                                style={navDropdown.flagsLang}
                            />
                            <View style={globalCss.alignSelfCenter}>
                                <Text style={navDropdown.textLangSelect}>Добавить</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </AnimatedNavTopMenu>

            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav}
                                id={"courseLessonAnalytics"} navTopMenuCallbacks={navTopMenuCallbacks}>
                <View style={navDropdown.containerSentences}>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainer}>

                                <View style={navDropdown.cardMiddleProcenteCourse}>
                                    <View style={navDropdown.cardMiddleProcenteRow}>
                                        <Text style={navDropdown.textProcenteCourse}>{generalInfo.current.courses ? Math.floor(generalInfo.current.coursesCompleted / generalInfo.current.courses * 100) : 0}</Text>
                                        <Text style={navDropdown.textProcenteCourse1}>%</Text>
                                    </View>
                                </View>
                                <Image
                                    source={require('./images/other_images/sheet1.png')}
                                    style={navDropdown.courseSheet}
                                />

                            </View>
                            <View style={navDropdown.dividerCourseData}/>
                            <View style={navDropdown.fluencyContainer}>
                                <Text style={navDropdown.iconSubText}>УРОВЕНЬ</Text>
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{generalInfo.current.level ? generalInfo.current.level : "Beginner"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={navDropdown.containerSheet}>
                        <View style={navDropdown.cardSheet}>

                            <View style={navDropdown.sectionSheet2}>
                                <Text style={navDropdown.header}>ВСЕГО УРОКОВ</Text>
                                <Text style={navDropdown.numberSheetTxt}>{generalInfo.current.courses ? `${generalInfo.current.coursesCompleted} / ${generalInfo.current.courses}` : "0 / 0"}</Text>
                            </View>

                            <View style={navDropdown.sectionSheetBorder}>
                                <View style={navDropdown.sectionSheet1}>
                                    <Text style={navDropdown.headerSheet}>ВИКТОРИНЫ</Text>
                                    <Text style={[navDropdown.numberSheetTxt, globalCss.green]}>{generalInfo.current.quizzes ? `${generalInfo.current.quizzesCompleted} / ${generalInfo.current.quizzes}` : "0 / 0"}</Text>
                                </View>
                                <View style={navDropdown.sectionSheet}>
                                    <Text style={navDropdown.headerSheet}>ОБЩЕЕ ВРЕМЯ</Text>
                                    <Text style={[navDropdown.numberSheetTxt, globalCss.green]}>
                                        {generalInfo.current.coursesCompletedHours ? Math.floor(generalInfo.current.coursesCompletedHours) : 0} {getHourWord(generalInfo.current.coursesCompletedHours)}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>


            {/* First nav menu */}
            {/* aici */}
            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav}
                                id={"consecutiveDaysSeries"} navTopMenuCallbacks={navTopMenuCallbacks}>
                <View style={navDropdown.containerSentences}>


                    <View style={navDropdown.containerResultDataSce1}>
                        <View style={navDropdown.cardDataDayCurrent}>
                            <Image
                                source={require('./images/other_images/fire.png')}
                                style={navDropdown.imageAnalyticsDay}
                            />
                            <Text style={navDropdown.percentage1}>{seriesData.current.currentSeries ? seriesData.current.currentSeries : 0} {getDayWord(seriesData.current.currentSeries)}</Text>
                            <Text style={navDropdown.timeframe1}>Текущая серия</Text>
                        </View>

                        <View style={navDropdown.cardDataDayLong}>
                            <Image
                                source={require('./images/other_images/deadline.png')}
                                style={navDropdown.imageAnalyticsDay}
                            />
                            <Text style={navDropdown.percentage1}>{seriesData.current.maxSeries ? seriesData.current.maxSeries : 0} {getDayWord(seriesData.current.maxSeries)}</Text>
                            <Text style={navDropdown.timeframe1}>Самая длинная серия</Text>
                        </View>
                    </View>

                    <View style={navDropdown.containerResultDataSce1}>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Пн</Text>
                            <Image
                                source={getImgByVisit("Mon")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Вт</Text>
                            <Image
                                source={getImgByVisit("Tue")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Ср</Text>
                            <Image
                                source={getImgByVisit("Wed")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Чт</Text>
                            <Image
                                source={getImgByVisit("Thu")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Пт</Text>
                            <Image
                                source={getImgByVisit("Fri")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Сб</Text>
                            <Image
                                source={getImgByVisit("Sat")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                        <View style={navDropdown.boxDay}>
                            <Text style={navDropdown.dayW}>Вс</Text>
                            <Image
                                source={getImgByVisit("Sun")}
                                style={navDropdown.imageAnalyticsDayCheck}
                            />
                        </View>
                    </View>
                    <View style={globalCss.alignItemsCenter}>
                        <Text style={navDropdown.titleh7}>
                            <FontAwesomeIcon icon={faFire} size={20} style={{color: 'orange', marginRight: 7}}/>
                            <SyllableGroup/>
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
                id={"phrasesModal"}
                navTopMenuCallbacks={navTopMenuCallbacks}
                onOpen={() => {
                    if (phrasesPercent.category !== currentCategory.url) {
                        setPhrasesPercent({
                            category: currentCategory.url,
                            percent: getCategoryData("phrasesCompleted") > 0 ? Math.floor(getCategoryData("phrasesCompleted") / getCategoryData("allPhrases") * 100) : 0
                        })
                    }
                }}
            >

                <View style={navDropdown.containerSentences}>
                    <Text style={navDropdown.titleh5}>Фразы, которые ты освоил</Text>
                    <Text style={navDropdown.titleh6}>Твой Прогресс в Обучении!</Text>

                    <View style={navDropdown.rowBlockSentences}>
                        <AnimatedCircularProgress
                            size={160}
                            width={21}
                            fill={phrasesPercent.category === currentCategory.url ? phrasesPercent.percent : 0}
                            tintColor="#ffd100"
                            backgroundColor="#748895"
                            lineCap="round"
                        >
                            {
                                (fill) => (
                                    <>
                                        <Text style={navDropdown.resultProgressBar}>
                                            {`${Math.round(fill)}%`}
                                        </Text>
                                    </>
                                )
                            }
                        </AnimatedCircularProgress>

                        <View style={navDropdown.containerResultDataSce}>
                            <AnimatedButtonShadow
                                styleContainer={navDropdown.cardDataSceContainer}
                                styleButton={[navDropdown.cardDataSce, globalCss.bgGry]}
                                shadowColor={"#d8d8d8"}
                                moveByY={3}
                            >
                                <Text style={navDropdown.percentage}>{getCategoryData("phrasesCompleted")}</Text>
                                <Text style={navDropdown.timeframe}>Всего изучено из {getCategoryData("allPhrases")}</Text>
                            </AnimatedButtonShadow>

                            <AnimatedButtonShadow
                                styleContainer={navDropdown.cardDataSceContainer}
                                styleButton={[navDropdown.cardDataSce, globalCss.bgGry]}
                                shadowColor={"#d8d8d8"}
                                moveByY={3}
                            >
                                <Text style={navDropdown.percentage}>{phrasesPercent.percent}%</Text>
                                <Text style={navDropdown.timeframe}>Прогресс курса из 100%</Text>
                            </AnimatedButtonShadow>
                        </View>

                    </View>
                </View>

            </AnimatedNavTopMenu>

            {/* Background for nav menu */}
            <AnimatedNavTopBg navTopBgTranslateX={navTopBgTranslateX.current} navTopBgOpacity={navTopBgOpacity.current}
                              toggleNavTopMenu={toggleNavTopMenu}/>

            <View style={{...styles.infoCourseSubject, top: heightsNav.current.navTop}}>
                <AnimatedButtonShadow
                    styleContainer={styles.cardCategoryTitleContainer}
                    shadowBorderRadius={12}
                    shadowBottomRightBorderRadius={0}
                    shadowColor={"#398205"}
                    styleButton={[styles.cardCategoryTitle, globalCss.buttonGreen]}
                >
                    <Text style={styles.infoCourseTxtSubCat}>Subject {currentCategory.subject}</Text>
                    <Text style={styles.infoCourseTitle}>{currentCategory.name}</Text>
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    onPress={toggleModal}

                    styleContainer={styles.infoCourseBtnContainer}
                    shadowBorderRadius={12}
                    shadowBottomLeftBorderRadius={0}
                    shadowColor={"#398205"}
                    styleButton={[styles.infoCourseBtn, globalCss.buttonGreen]}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.infoCategoryImg}
                    />
                </AnimatedButtonShadow>
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
                                <Text style={styles.titleLessonCatSubject}>Subject {currentCategory.subject}</Text>
                                <Text style={styles.titleLessonCatTxt}>{currentCategory.name}</Text>
                            </View>
                        </View>

                        <View style={styles.infoDetExtraCat}>


                            <View style={styles.infoDetCatTitle}>
                                <Image
                                    source={require("./images/icon/online-education.png")}
                                    style={styles.courseDetCatImg}
                                />
                                <View style={styles.titleDetLessonCat}>
                                    <Text
                                        style={styles.titleDetLessonCatSubject}>{getCategoryData("courses")} уроков</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>Вперёд
                                        навстречу {getCategoryData("courses")} увлекательным
                                        приключениям!</Text>
                                </View>
                            </View>

                            <View style={styles.horizontalLine}/>

                            <View style={styles.infoDetCatTitle}>
                                <Image
                                    source={require("./images/icon/decision-making.png")}
                                    style={styles.courseDetCatImg}
                                />
                                <View style={styles.titleDetLessonCat}>
                                    <Text
                                        style={styles.titleDetLessonCatSubject}>{getCategoryData("quizzes")} испытаний</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>Отправляйся в путешествие
                                        через {getCategoryData("quizzes")} мир
                                        возможностей!</Text>
                                </View>
                            </View>

                            <View style={styles.horizontalLine}/>

                            <View style={styles.infoDetCatTitle}>
                                <Image
                                    source={require("./images/icon/limited-time.png")}
                                    style={styles.courseDetCatImg}
                                />
                                <View style={styles.titleDetLessonCat}>
                                    <Text
                                        style={styles.titleDetLessonCatSubject}>Более {Math.floor(getCategoryData("coursesHours"))} часов
                                        погружения</Text>
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
                contentContainerStyle={{paddingTop: 140, paddingBottom: 130, minHeight: "100%"}}
                style={styles.bgCourse}
                onScroll={e => handleScroll(e.nativeEvent)}
                scrollEventThrottle={8}
                onLayout={(e) => startLayoutY.current = e.nativeEvent.layout.y}
            >
                <View style={styles.container}>
                    <View style={styles.contentFlashCards}>

                        <Categories data={data} categoriesPos={categoriesPos}
                                    startLayoutY={startLayoutY} showDataToIndex={showDataToIndex}/>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const Categories = React.memo(({data, categoriesPos, startLayoutY, showDataToIndex}) => {
    if (!data) return null

    const {width: windowWidth} = Dimensions.get("window");
    const navigation = useNavigation()

    const getMarginLeftForCard = (index) => {
        const pattern = [40, 30, 20, 30, 40, 50]; // Modelul pentru marginLeft
        return pattern[index % 6]; // Repetă modelul la fiecare 6 carduri
    };

    // анимация для начального верхнего изображения
    const moveAnimation = useRef(new Animated.Value(0)).current;

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

    const arrayData = Object.keys(data).slice(0, showDataToIndex)
    const imagesAnim = {}

    arrayData.forEach(category => {
        const length = Math.floor(data[category].items.length / 6)

        imagesAnim[category] = []

        if (length >= 1) {
            imagesAnim[category].push({
                top: 3 * (56 + 20) - 110,
                right: 25,
                image: require("./images/El/course/Group.png")
            })

            imagesAnim[category].push({
                top: (data[category].items.length - (data[category].items.length % 6) - (length > 2 ? 6 : 0)) * (56 + 20) - 110, // 110 half image height, 56 + 20 - button height + magrinBottom
                left: 25,
                image: require("./images/El/course/Group.png")
            })
        }
    })

    return arrayData.map((category, categoryIndex) => (
        <View key={category}
              style={{position: "relative"}}
              onLayout={(event) => {
                  if (categoriesPos.current.length >= showDataToIndex) return

                  categoriesPos.current.push([category, event.nativeEvent.layout.y + startLayoutY.current, categoryIndex + 1])

                  if (showDataToIndex <= categoriesPos.current.length) categoriesPos.current.sort((a, b) => b[1] - a[1]);
              }}>

            {categoryIndex > 0 && (
                <View style={styles.categoryTitleBg}>
                    <View style={styles.hrLine}></View>
                    <Text style={styles.categoryTitle}>
                        {data[category].categoryTitle}
                    </Text>
                    <View style={styles.hrLine}></View>
                </View>
            )}

            {imagesAnim[category].map((value, index) => (
                <View key={index}>
                    <Image
                        source={value.image}
                        style={[
                            styles.elCourseImg,
                            {top: value.top, width: windowWidth / 3},
                            value.right && {right: value.right},
                            value.left && {left: value.left}
                        ]}
                    />
                </View>
            ))}

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
                <AnimatedButtonShadow
                    key={item.id}
                    shadowColor={item.finished ? "#a08511" : "#828080"}
                    shadowBorderRadius={300}
                    shadowDisplayAnimate={"slide"}
                    moveByY={10}
                    styleButton={[
                        {
                            marginLeft: `${getMarginLeftForCard(index)}%`,
                        },
                        styles.card,
                        styles.bgGry,
                        item.finished ? styles.finishedCourseLesson : null,
                    ]}
                    onPress={() =>
                        navigation.navigate("CourseLesson", {url: item.url})
                    }
                >
                    <Text>
                        <FontAwesomeIcon
                            icon={faStar}
                            size={30}
                            style={[styles.iconFlash, item.finished ? styles.finishedCourseLessonIcon : null]}
                        />
                    </Text>
                </AnimatedButtonShadow>
            ))}

        </View>
    ))
})

const AnimatedNavTopArrow = React.memo(({children, id, topPositionNavTopArrows}) => {
    if (!topPositionNavTopArrows[id]) topPositionNavTopArrows[id] = new Animated.Value(0)

    return (
        <Animated.View
            style={{
                ...navDropdown.navTopArrowView,
                transform: [{translateY: topPositionNavTopArrows[id]}]
            }}
        >
            {children}
        </Animated.View>
    )
})

const AnimatedNavTopMenu = React.memo(({children, id, topPositionNavTopMenus, heightsNav, navTopMenuCallbacks, onOpen, onClose}) => {
    if (!topPositionNavTopMenus[id]) topPositionNavTopMenus[id] = new Animated.Value(0)
    if (!heightsNav.current.navTopMenu[id]) heightsNav.current.navTopMenu[id] = 99999

    navTopMenuCallbacks[id] = {
        onOpen: onOpen ? onOpen : () => {},
        onClose: onClose ? onClose : () => {}
    }

    return (
        <Animated.View
            style={{
                ...navDropdown.navTopModal,
                top: -heightsNav.current.navTopMenu[id],
                transform: [{translateY: topPositionNavTopMenus[id]}]
            }}
            onLayout={event => heightsNav.current.navTopMenu[id] = Math.ceil(event.nativeEvent.layout.height + 1)}
        >
            <View style={navDropdown.navTopModalIn}>
                {children}
            </View>
        </Animated.View>
    )
})

const AnimatedNavTopBg = React.memo(({navTopBgTranslateX, navTopBgOpacity, toggleNavTopMenu}) => {
    return (
        <Animated.View
            style={{
                ...navDropdown.navTopBg,
                opacity: navTopBgOpacity,
                transform: [{translateX: navTopBgTranslateX}]
            }}
        >
            <Pressable style={{width: "100%", height: "100%"}} onPress={() => toggleNavTopMenu()}></Pressable>
        </Animated.View>
    )
})