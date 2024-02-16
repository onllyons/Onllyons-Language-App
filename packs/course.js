import React, {useState, useRef, useEffect, useMemo, useCallback} from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Animated, Dimensions, FlatList, TouchableOpacity
} from "react-native";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// icons
import {faStar, faPlay} from "@fortawesome/free-solid-svg-icons";

// styles
import globalCss from "./css/globalCss";
import {stylesCourse_lesson as styles} from "./css/course_main.styles";

import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import Modal from 'react-native-modal';
import {SubscribeModal} from "./components/SubscribeModal";
import {AnimatedButtonShadow, SHADOW_COLORS} from "./components/buttons/AnimatedButtonShadow";
import {useNavigation} from "@react-navigation/native";
import {
    formatAdventureWord, formatExcitingWord,
    formatHoursWord,
    formatLessonWord,
    formatTrialWord, getFontSize
} from "./utils/Utls";
import {withAnchorPoint} from "react-native-anchor-point";
import * as Haptics from "expo-haptics";
import {NavTop} from "./components/course/NavTop";
import ContentLoader from "react-native-easy-content-loader";

export default function CourseScreen({navigation}) {
    const [data, setData] = useState({});
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

    const [loading, setLoading] = useState(false)

    const [categories, setCategories] = useState([])

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

    useMemo(() => {
        setLoading(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/course/get_categories.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
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
            })
            .catch(() => {})
            .finally(() => {
                setTimeout(() => setLoading(false), 1)
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

    const [subscriptionModalVisible, setSubscriptionVisible] = useState(false);

    const getCategoryData = useCallback((value, undefinedValue = 0) => {
        return categoriesData.current[currentCategory.url] ? categoriesData.current[currentCategory.url][value] : undefinedValue
    }, [])

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

    const [heightNav, setHeightNav] = useState(100)

    return (
        <View>
            <NavTop loading={loading} getCategoryData={getCategoryData} seriesData={seriesData.current} generalInfo={generalInfo.current} onLayout={event => setHeightNav(event.nativeEvent.layout.height)}/>

            <SubscribeModal visible={subscriptionModalVisible} setVisible={setSubscriptionVisible}/>

            <CurrentCategory currentCategory={currentCategory} heightNav={heightNav} getCategoryData={getCategoryData} loading={loading}/>

            <FlatList
                // ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                // onEndReached={fetchCategories}
                // onEndReachedThreshold={0.5}
                // data={currentCategories}

                ref={flatListRef}
                data={loading ? ["loadingData"] : categories}
                scrollEnabled={scrollEnabled && !loading}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                renderItem={({item, index}) => loading ? (<CategoryLoader/>) : (
                    <Category data={data[item] ? data[item] : null} category={item} categoryIndex={index} scrollRef={flatListRef} categoriesData={categoriesData} currentScrollData={currentScrollData} setScrollEnable={setScrollEnable}/>
                )}
                contentContainerStyle={{ paddingTop: 140, paddingBottom: 130, minHeight: "100%" }}
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
                    <TouchableOpacity onPress={() => navigation.navigate("Test_font_size")}>
                        <Text>Test font responsive sizes</Text>
                    </TouchableOpacity>
                )}
                scrollEventThrottle={8}
                onLayout={(e) => (startLayoutY.current = e.nativeEvent.layout.y)}
                ListFooterComponent={
                    !loading && categories.length > 0 ? (
                        <View>
                            <View style={styles.imgEndCourseView}>
                                <Image style={styles.imgEndCourse} source={require("./images/El/course/end.png")} />
                            </View>

                            {/*<View style={styles.imgEndCourseView1}>
                                <Text>
                                    Поздравляем с завершением курса по английскому! Теперь у вас есть прочная основа для выражения и достижений. Успехов!
                                </Text>
                            </View>*/}
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const CurrentCategory = React.memo(({heightNav, currentCategory, getCategoryData, loading}) => {
    const [isModalVisible, setModalVisible] = useState(false)

    return (
        <>
            <View style={{...styles.infoCourseSubject, top: heightNav}}>
                <AnimatedButtonShadow
                    disable={loading}
                    styleContainer={styles.cardCategoryTitleContainer}
                    shadowBorderRadius={12}
                    shadowBottomRightBorderRadius={0}
                    shadowColor={getCategoryData("backgroundShadow", SHADOW_COLORS["green"])}
                    styleButton={[styles.cardCategoryTitle, {backgroundColor: getCategoryData("background", "#57cc04")}]}
                >
                    {loading ? (<CurrentCategoryLoader/>) : (
                        <>
                            <Text style={{...styles.infoCourseTxtSubCat, fontSize: getFontSize(16)}}>Часть {currentCategory.subject}</Text>
                            <Text style={{...styles.infoCourseTitle, fontSize: getFontSize(18)}}>{currentCategory.name}</Text>
                        </>
                    )}
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    disable={loading}
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

const CurrentCategoryLoader = () => {
    return (
        <View>
            <ContentLoader active pRows={1} tHeight={20} titleStyles={{width: "40%", marginBottom: 2}} pHeight={30} primaryColor={"#d1ffb1"} secondaryColor={"#a5f46d"} title={true}/>
        </View>
    )
}

const CategoryLoader = () => {
    const {width: windowWidth} = Dimensions.get("window");

    const lessons = new Array(15).fill("");

    return (
        <View style={{position: "relative", paddingTop: 57}}>
            <View>
                <Image
                    source={require("./images/El/course/1.png")}
                    style={[
                        styles.elCourseImg,
                        {top: 3 * (56 + 20) - 167, width: windowWidth / 3},
                        {right: 25}
                    ]}
                />
            </View>

            {lessons.map((item, index) => (
                <LessonLoader key={index} index={index}/>
            ))}
        </View>
    )
}

const LessonLoader = ({index}) => {
    return (
        <ContentLoader active pRows={0} title={false} avatar={true} avatarStyles={{
            marginLeft: `${getMarginLeftForCard(index)}%`,
            marginBottom: 20,
            width: 70,
            height: 56,
            borderRadius: 300,
        }} />
    )
}

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
                <Lesson key={index} item={item} index={index} scrollRef={scrollRef} currentScrollData={currentScrollData} setScrollEnable={setScrollEnable} coursesInCategory={categoriesData.current[category].courses}/>
            ))}

        </View>
    )
})

const Lesson = ({item, index, coursesInCategory, scrollRef, currentScrollData, setScrollEnable}) => {
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
            <AnimatedButtonShadow
                refButton={buttonRef}
                shadowColor={item.finished ? "yellow" : "gray2"}
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
                onPress={handlePressButton}
            >
                <Text style={[{ marginLeft: index === 0 ? 5 : 0 }]}>

                    <FontAwesomeIcon
                      icon={index === 0 ? faPlay : faStar}
                      size={index === 0 ? 30 : 30}
                      style={[
                        styles.iconFlash,
                        item.finished ? styles.finishedCourseLessonIcon : null,
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
                        height: 200,
                        left: "5%",
                        width: "90%",
                        padding: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "#f9f9f9",
                        // green bg
                        // backgroundColor: "#57cc04",
                        borderRadius: 25,
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

                        <Text style={styles.bold}>Lesson name: {item.title}</Text>
                        <Text style={styles.bold}>Tile Lesson: {item.time_lesson}</Text>
                        <Text style={styles.bold}>Lessons: {index + 1} / {coursesInCategory}</Text>
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
                                navigation.navigate("CourseLesson", {url: item.url})
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