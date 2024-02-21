import React, {useState, useRef, useEffect, useCallback} from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Animated, Dimensions, FlatList, TouchableOpacity, RefreshControl
} from "react-native";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// icons
import {faStar, faPlay} from "@fortawesome/free-solid-svg-icons";

// styles
import globalCss from "./css/globalCss";
import {stylesCourse_lesson as styles} from "./css/course_main.styles";

import Modal from 'react-native-modal';
import {SubscribeModal} from "./components/SubscribeModal";
import {AnimatedButtonShadow, SHADOW_COLORS} from "./components/buttons/AnimatedButtonShadow";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {
    formatAdventureWord, formatExcitingWord,
    formatHoursWord,
    formatLessonWord,
    formatTrialWord, getFontSize
} from "./utils/Utls";
import {withAnchorPoint} from "react-native-anchor-point";
import * as Haptics from "expo-haptics";
import {NavTop} from "./components/course/NavTop";
import {useStore} from "./providers/Store";

export default function CourseScreen({navigation}) {
    const [data, setData] = useState({});
    const {getStoredValue, setStoredCourseData, deleteStoredValue} = useStore()
    const [currentCategory, setCurrentCategory] = useState({
        name: "",
        url: "",
        subject: 1
    });
    const currentCategoryRef = useRef({})

    const [scrollEnabled, setScrollEnabled] = useState(true)
    const flatListRef = useRef(null);

    const startLayoutY = useRef(0)

    const currentScrollData = useRef({
        x: 0,
        y: 0,
        contentHeight: 0
    })
    const categoriesData = useRef({})
    const seriesData = useRef({})
    const generalInfo = useRef({})

    const [refreshing, setRefreshing] = useState(false);

    const [categories, setCategories] = useState([])

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        setStoredCourseData()
            .then(() => {})
            .catch(() => {})
            .finally(() => setRefreshing(false))
    }, [])

    const onViewableItemsChanged = ({viewableItems}) => {
        if (!viewableItems[0] || !categoriesData.current[viewableItems[0]["item"]]) return

        const category = viewableItems[0]["item"]

        let currCategoryOnScroll = {
            name: categoriesData.current[category]["name"].trim(),
            url: category,
            subject: viewableItems[0]["index"] + 1,
        }

        if (currCategoryOnScroll.name !== currentCategoryRef.current.name) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentCategory(currCategoryOnScroll)
            currentCategoryRef.current = currCategoryOnScroll
        }
    };

    const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}])

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

    useFocusEffect(
        useCallback(() => {
           const lastFinishCourse = getStoredValue("lastFinishCourse")

            if (lastFinishCourse === null || !data[lastFinishCourse.category]) {
                deleteStoredValue("lastFinishCourse")
                return
            }

            let changed = false
            let phrasesToAdd = 0
            let quizzesToAdd = 0
            const items = data[lastFinishCourse.category].items

            for (const [index, value] of items.entries()) {
                if (value.id === lastFinishCourse.id && !value.finished) {
                    phrasesToAdd = value.phrases
                    quizzesToAdd = value.quizzes
                    items[index].finished = true
                    changed = true
                    break
                }
            }

            if (changed) {
                categoriesData.current[lastFinishCourse.category].finished += 1
                categoriesData.current[lastFinishCourse.category].phrasesCompleted += phrasesToAdd
                generalInfo.current.coursesCompleted += 1
                generalInfo.current.quizzesCompleted += quizzesToAdd
                generalInfo.current.phrasesCompleted += phrasesToAdd
                generalInfo.current.coursesCompletedHours += lastFinishCourse.timeLesson / 60 / 60
                deleteStoredValue("lastFinishCourse")

                setData(prev => ({
                    ...prev,
                    [lastFinishCourse.category]: {
                        ...prev[lastFinishCourse.category],
                        items: items
                    }
                }))
            }
        }, [data])
    );


    useEffect(() => {
        if (refreshing) return

        const data = getStoredValue("courseData")

        if (!data) {
            setStoredCourseData(true)
            return;
        }

        const groupedData = groupByCategory(data.data);
        const firstCategory = Object.keys(groupedData)[0];
        const categories = []

        Object.keys(groupedData).forEach(cat => categories.push(cat))

        categoriesData.current = data.categoriesData
        seriesData.current = data.seriesData
        generalInfo.current = data.generalInfo

        currentCategoryRef.current = {
            name: groupedData[firstCategory].categoryTitle.trim(),
            url: firstCategory,
            subject: 1
        }
        setCurrentCategory(currentCategoryRef.current);
        setCategories(categories)
        setData(groupedData);
    }, [refreshing]);

    const [subscriptionModalVisible, setSubscriptionVisible] = useState(false);

    const getCategoryData = useCallback((value, undefinedValue = 0) => {
        return categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url][value] : undefinedValue
    }, [currentCategory])

    const setScrollEnable = useCallback((value) => {
        setScrollEnabled(value)
    }, []);

    // const [currentCategories, setCurrentCategories] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(0);
    //
    // // Подгрузка категорий
    // const fetchCategories = () => {
    //     if (loading || categories.length === 0) return;
    //     setLoading(true);
    //
    //     const nextPage = currentPage + 1;
    //     const startIndex = currentPage * 3;
    //     const endIndex = startIndex + 3;
    //     const newCategories = categories.slice(startIndex, endIndex);
    //
    //     // Обновляем состояние с новыми категориями
    //     setCurrentCategories(prevCategories => [...prevCategories, ...newCategories]);
    //     setCurrentPage(nextPage);
    //     setLoading(false);
    // };
    //
    // useEffect(() => {
    //     fetchCategories(); // Загружаем начальные данные при монтировании
    // }, [categories]);

    return (
        <View style={{backgroundColor: "#fff"}}>
            <NavTop getCategoryData={getCategoryData} seriesData={seriesData.current} generalInfo={generalInfo.current}/>

            <SubscribeModal visible={subscriptionModalVisible} setVisible={setSubscriptionVisible}/>

            <CurrentCategory currentCategory={currentCategory} getCategoryData={getCategoryData}/>

            <FlatList
                // ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                // onEndReached={fetchCategories}
                // onEndReachedThreshold={0.5}
                // data={currentCategories}

                refreshControl={
                    <RefreshControl

                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }

                ref={flatListRef}
                data={categories}
                scrollEnabled={scrollEnabled}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                renderItem={({item, index}) => (
                    <Category data={data[item] ? data[item] : null} category={item} categoryIndex={index} scrollRef={flatListRef} categoriesData={categoriesData} currentScrollData={currentScrollData} setScrollEnable={setScrollEnable}/>
                )}
                contentContainerStyle={{ paddingTop: 35, paddingBottom: 130, minHeight: "100%" }}
                style={styles.bgCourse}
                onScroll={(event) => {
                    currentScrollData.current = {
                        ...currentScrollData.current,
                        x: event.nativeEvent.contentOffset.x,
                        y: event.nativeEvent.contentOffset.y
                    }
                }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    currentScrollData.current.contentHeight = contentHeight
                }}
                ListHeaderComponent={(
                    <View>
                    <TouchableOpacity onPress={() => navigation.navigate("Test_font_size")}>
                        <Text>Test font responsive sizes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Congratulations")}>
                        <Text>Congragulations</Text>
                    </TouchableOpacity>
                    </View>
                )}
                scrollEventThrottle={8}
                onLayout={(e) => (startLayoutY.current = e.nativeEvent.layout.y)}
            />
        </View>
    );
}

const CurrentCategory = React.memo(({currentCategory, getCategoryData}) => {
    const [isModalVisible, setModalVisible] = useState(false)

    return (
        <>
            <View style={styles.infoCourseSubject}>
                <AnimatedButtonShadow
                    shadowDisplayAnimate={"slide"}
                    styleContainer={styles.cardCategoryTitleContainer}
                    shadowBorderRadius={12}
                    shadowBottomRightBorderRadius={0}
                    shadowColor={getCategoryData("backgroundShadow", SHADOW_COLORS["green"])}
                    styleButton={[styles.cardCategoryTitle, {backgroundColor: getCategoryData("background", "#57cc04")}]}
                >
                    <Text style={{...styles.infoCourseTxtSubCat, fontSize: getFontSize(16)}}>Часть {currentCategory.subject}</Text>
                    <Text style={{...styles.infoCourseTitle, fontSize: getFontSize(18)}}>{currentCategory.name}</Text>
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    shadowDisplayAnimate={"slide"}
                    onPress={() => setModalVisible(true)}

                    styleContainer={styles.infoCourseBtnContainer}
                    shadowBorderRadius={12}
                    shadowBottomLeftBorderRadius={0}
                    shadowColor={getCategoryData("backgroundShadow", SHADOW_COLORS["green"])}
                    styleButton={[styles.infoCourseBtn, {backgroundColor: getCategoryData("background", "#57cc04")}]}
                >
                    <Image
                        source={require('./images/icon/list.png')}
                        style={styles.infoCategoryImg}
                    />
                </AnimatedButtonShadow>
            </View>

            <Modal
                onBackButtonPress={() => setModalVisible(false)}
                isVisible={isModalVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                onBackdropPress={() => setModalVisible(false)}
                style={{justifyContent: 'flex-end', margin: 0}}
            >
                <View style={styles.modal}>
                    <ScrollView
                        contentContainerStyle={{paddingTop: 25, paddingBottom: 80}}
                        style={styles.modalCourseContent}>
                        <View style={styles.infoCatTitle}>
                            <Image
                                source={require("./images/El/inGlasses.png")}
                                style={styles.courseCatImg}
                            />
                            <View style={styles.titleLessonCat}>
                                <Text style={styles.titleLessonCatSubject}>Часть {currentCategory.subject}</Text>
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
                                        style={styles.titleDetLessonCatSubject}>{formatLessonWord(getCategoryData("courses"))}</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>Вперёд навстречу {getCategoryData("courses")} {formatExcitingWord(getCategoryData("courses"))} {formatAdventureWord(getCategoryData("courses"))}!</Text>
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
                                        style={styles.titleDetLessonCatSubject}>{formatTrialWord(getCategoryData("quizzes"))}</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>
                                        Отправляйся в путешествие
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
                                        style={styles.titleDetLessonCatSubject}>Более {formatHoursWord(Math.floor(getCategoryData("coursesHours")))} погружения</Text>
                                    <Text style={styles.titleDetLessonCatTxt}>полного погружения в знания</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </Modal>
        </>
    )
})

const getMarginLeftForCard = (index) => {
    const pattern = [40, 30, 20, 30, 40, 50]; // Modelul pentru marginLeft
    return pattern[index % 6]; // Repetă modelul la fiecare 6 carduri
};

const Category = React.memo(({data, category, categoryIndex, scrollRef, categoriesData, currentScrollData, setScrollEnable}) => {
    if (!data) return null

    const {width: windowWidth} = Dimensions.get("window");

    // анимация для начального верхнего изображения
    const moveAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop( // Repetă animația
            Animated.sequence([ // Creează o secvență de animații
                Animated.timing(moveAnimation, {
                    toValue: 10, // Mișcă în sus cu 10 unități
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

    const imagesAnim = []
    const length = Math.floor(data.items.length / 6)

    const getImageByCategory = useCallback((pos) => {
        switch (categoryIndex) {
            case 0:
                if (pos === "first") return require("./images/El/course/1.png")
                else if (pos === "second") return require("./images/El/course/2.png")
                break

            case 1:
                if (pos === "first") return require("./images/El/course/3.png")
                else if (pos === "second") return require("./images/El/course/4.png")
                break

            case 2:
                if (pos === "first") return require("./images/El/course/5.png")
                else if (pos === "second") return require("./images/El/course/9.png")
                break

            case 3:
                if (pos === "first") return require("./images/El/course/7.png")
                else if (pos === "second") return require("./images/El/course/8.png")
                break

            case 4:
                if (pos === "first") return require("./images/El/course/6.png")
                else if (pos === "second") return require("./images/El/course/10.png")
                break

            case 5:
                if (pos === "first") return require("./images/El/course/11.png")
                else if (pos === "second") return require("./images/El/course/9.png")
                break
            // asd
            case 6:
                if (pos === "first") return require("./images/El/course/13.png")
                else if (pos === "second") return require("./images/El/course/12.png")
                break
            case 7:
                if (pos === "first") return require("./images/El/course/14.png")
                else if (pos === "second") return require("./images/El/course/15.png")
                break
            case 8:
                if (pos === "first") return require("./images/El/course/16.png")
                else if (pos === "second") return require("./images/El/course/17.png")
                break
            
        }
    }, [])

    if (length >= 1) {
        const imageFirst = getImageByCategory("first")

        if (imageFirst) {
            imagesAnim.push({
                top: 3 * (56 + 20) - 110,
                right: 25,
                image: imageFirst
            })
        }

        const imageSecond = getImageByCategory("second")

        if (imageSecond) {
            imagesAnim.push({
                top: (data.items.length - (data.items.length % 6) - (length > 2 ? 6 : 0)) * (56 + 20) - 110, // 110 half image height, 56 + 20 - button height + magrinBottom
                left: 25,
                image: imageSecond
            })
        }
    }

    return (
        <View style={{position: "relative"}}>
            {categoryIndex > 0 && (
                <View style={styles.categoryTitleBg}>
                    <View style={styles.hrLine}></View>
                    <Text style={styles.categoryTitle}>
                        {data.categoryTitle}
                    </Text>
                    <View style={styles.hrLine}></View>
                </View>
            )}

            {imagesAnim.map((value, index) => (
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

            <View style={{paddingTop: 57, zIndex: 2}}>
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: windowWidth / 2 - 38,
                        transform: [
                            {translateY: moveAnimation}
                        ],
                    }}
                >
                    <Image source={require("./images/other_images/start.png")}
                           style={styles.startImg}/>
                </Animated.View>
            </View>


            {data.items.map((item, index) => (
                <Lesson
                    key={index}
                    item={item}
                    index={index}
                    scrollRef={scrollRef}
                    currentScrollData={currentScrollData}
                    setScrollEnable={setScrollEnable}
                    firstLessonColor={index === 0 ? {
                        backgroundColor: categoriesData.current[category].background,
                        shadowColor: categoriesData.current[category].backgroundShadow
                    } : {}}
                    coursesInCategory={categoriesData.current[category].courses}
                />
            ))}

        </View>
    )
})

const Lesson = ({item, index, coursesInCategory, scrollRef, currentScrollData, setScrollEnable, firstLessonColor}) => {
    const navigation = useNavigation()

    const [showModal, setShowModal] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)

    const windowHeight = Dimensions.get("window").height
    const windowWidth = Dimensions.get("window").width

    const buttonRef = useRef(null)
    const positions = useRef({
        arrowX: 0,
        modalY: 0,
        arrowBottom: false
    })

    const scale = useRef(new Animated.Value(0.5))
    const navMenuBottomHeight = windowHeight * .11 > 90 ? windowHeight * .11 : 90

    const showMenu = () => {
        Animated.spring(scale.current, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
            bounciness: 0
        }).start()
    }

    const hideMenu = () => {
        Animated.spring(scale.current, {
            toValue: 0.5,
            duration: 150,
            useNativeDriver: true,
            bounciness: 0
        }).start(() => setVisibleModal(false))
    }

    const handlePressButton = useCallback(() => {
        buttonRef.current.measureInWindow((x, y, w) => {
            const toBeModalPos = y + 200 + 70 + 40 + navMenuBottomHeight // 200 - modal height, 70 + additional posY, 40 - additional value
            let modalY = y + 70

            // Scroll if needed
            if (toBeModalPos > windowHeight) {
                const scrollTo = currentScrollData.current.y + toBeModalPos - windowHeight
                let delay = 100
                let arrowBottom = false

                // If scrolling is too low, display on top
                if (scrollTo + windowHeight > currentScrollData.current.contentHeight) {
                    modalY -= 70 + 200 + 40 // 200 - modal height, 70 + additional posY, 40 - additional value
                    arrowBottom = true
                    delay = 0
                } else {
                    modalY -= toBeModalPos - windowHeight

                    scrollRef.current.scrollToOffset({
                        offset: scrollTo,
                        animated: true
                    })
                }

                setScrollEnable(false)

                setTimeout(() => {
                    positions.current = {
                        arrowBottom: arrowBottom,
                        arrowX: x - (windowWidth * 0.1) + w / 2 - 10, // 10 - half size arrow
                        modalY: modalY
                    }
                    setShowModal(true)
                    setVisibleModal(true)
                }, delay)
            } else {
                positions.current = {
                    arrowBottom: false,
                    arrowX: x - (windowWidth * 0.1) + w / 2 - 10,
                    modalY: modalY
                }
                setShowModal(true)
                setVisibleModal(true)
                setScrollEnable(false)
            }
        })
    }, []);

    const getTransform = () => {
        let transform = {
            transform: [{ scale: scale.current }],
        };

        const x = (positions.current.arrowX + 10) / (windowWidth * .8)
        return withAnchorPoint(transform, { x: x, y: positions.current.arrowBottom ? 1 : 0 }, { width: windowWidth * .9, height: 200 });
    };


    return (
        <>
            {/* carduri buttoane curs */}
            <AnimatedButtonShadow
                refButton={buttonRef}
                shadowColor={firstLessonColor.shadowColor ? firstLessonColor.shadowColor : (item.finished ? "yellow" : "gray2")}
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
                    firstLessonColor.backgroundColor && {backgroundColor: firstLessonColor.backgroundColor}
                ]}
                onPress={handlePressButton}
            >
                <Text style={[{ marginLeft: index === 0 ? 5 : 0 }]}>

                    <FontAwesomeIcon
                      icon={index === 0 ? faPlay : faStar}
                      size={index === 0 ? 30 : 30}
                      style={[
                        styles.iconFlash,
                        item.finished || firstLessonColor.backgroundColor ? styles.finishedCourseLessonIcon : null,
                        { marginLeft: index === 0 ? 0 : 0 }
                      ]}
                    />
                </Text>
            </AnimatedButtonShadow>

            {showModal && (
                <Modal
                    onBackButtonPress={() => setVisibleModal(false)}
                    isVisible={visibleModal}
                    animationIn={"fadeIn"}
                    animationOut={"fadeOut"}
                    backdropOpacity={0}
                    backdropColor={"rgba(0, 0, 0, 0.25)"}
                    onModalWillShow={() => showMenu()}
                    onModalWillHide={() => {
                        setScrollEnable(true)
                        hideMenu()
                    }}
                    onModalHide={() => setShowModal(false)}
                    onBackdropPress={() => setVisibleModal(false)}
                >
                    <Animated.View style={{
                        position: "absolute",
                        top: positions.current.modalY,
                        left: "5%",
                        width: "90%",
                        padding: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "#f9f9f9",
                        // green bg
                        // backgroundColor: "#57cc04",
                        borderRadius: 20,
                        borderColor: "#d8d8d8",
                        borderWidth: 2,

                        ...getTransform()
                    }}>
                        {/* Arrow */}
                        <Image
                            source={require("./images/icon/arrowGrayTopDropdown.png")}
                            style={[
                                {
                                    position: "absolute",
                                    left: positions.current.arrowX,
                                    width: 20,
                                    height: 20,
                                    resizeMode: "contain",
                                },
                                positions.current.arrowBottom ? {
                                    bottom: -18,
                                    transform: [{rotate: "180deg"}],
                                } : {top: -18}
                            ]}
                        />
                        {/* dropdown modal */}
                        <Text style={styles.titleDropDownLesson}>{item.title}</Text>
                        {/*<Text>{item.time_lesson}</Text>*/}
                        <Text style={styles.nrDropDownLesson}>Урок {index + 1} из {coursesInCategory}</Text>
                        <AnimatedButtonShadow
                            styleButton={[
                                globalCss.button,
                                globalCss.buttonGreen,
                                {marginBottom: 0}
                            ]}
                            moveByY={3}
                            shadowColor={"green"}
                            activeOpacity={1}

                            onPress={() => {
                                scale.current.setValue(0.5)
                                setVisibleModal(false)
                                setShowModal(false)
                                setScrollEnable(true)
                                navigation.navigate("CourseLesson", {url: item.url, category: item.category_url, id: item.id})
                            }}
                        >
                            <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
                                Вперёд
                            </Text>
                        </AnimatedButtonShadow>
                    </Animated.View>
                </Modal>
            )}
        </>

    )
}