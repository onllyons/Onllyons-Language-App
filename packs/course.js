import React, {useState, useRef, useMemo} from "react";
import globalCss from "./css/globalCss";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity, Animated
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import Loader from "./components/Loader";

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
    const [isCardPressedCourseDetails, setIsCardPressedCourseDetails] = useState(false);

    const finishedCounter = useRef({})
    const phrasesCompleted = useRef({})

    const [loader, setLoader] = useState(false)

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

                finishedCounter.current = data.finishedCounter
                phrasesCompleted.current = data.phrasesCompleted

                if (initialCategories.length > 0) {
                    setCurrentCategory({
                        name: groupedData[initialCategories[0]].categoryTitle,
                        url: initialCategories[0]
                    });
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

    // Open/close nav menu by id
    const toggleNavTopMenu = (id) => {
        if (openedNavMenu.current !== null && openedNavMenu.current !== id) {
            Animated.parallel([
                Animated.spring(topPositionNavTopMenus[openedNavMenu.current], {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                topPositionNavTopArrows[openedNavMenu.current] && Animated.spring(topPositionNavTopArrows[openedNavMenu.current], {
                    toValue: 10,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(topPositionNavTopMenus[id], {
                    toValue: heightsNav.current.navTopMenu[id],
                    duration: 500,
                    useNativeDriver: true,
                }),
                topPositionNavTopArrows[id] && Animated.spring(topPositionNavTopArrows[id], {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(topPositionNavTopMenus[id], {
                    toValue: openedNavMenu.current === id ? 0 : heightsNav.current.navTopMenu[id],
                    duration: 500,
                    useNativeDriver: true,
                }),
                topPositionNavTopArrows[id] && Animated.spring(topPositionNavTopArrows[id], {
                    toValue: openedNavMenu.current === id ? 10 : 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
        }

        openedNavMenu.current = openedNavMenu.current === id ? null : id
    };

    return (
        <View>
            <Loader visible={loader}/>

            <View style={globalCss.navTabUser}
                  onLayout={event => heightsNav.current.navTop = event.nativeEvent.layout.height}>
                <View style={globalCss.itemNavTabUser}>
                    <Image
                        source={require("./images/other_images/nav-top/english.webp")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>EN</Text>
                </View>
                <View style={globalCss.itemNavTabUser}>
                    <Image
                        source={require("./images/other_images/nav-top/sapphire.webp")}
                        style={globalCss.imageNavTop}
                    />
                    <Text
                        style={globalCss.dataNavTop}>{finishedCounter.current[currentCategory.url] ? finishedCounter.current[currentCategory.url] : 0}</Text>
                </View>
                <TouchableOpacity style={globalCss.itemNavTabUser}
                                  onPress={() => toggleNavTopMenu("test")}>
                    <Image
                        source={require("./images/other_images/nav-top/flame.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>4</Text>

                    <AnimatedNavTopArrow id={"test"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={stylesTest.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser}
                                  onPress={() => toggleNavTopMenu(0)}>
                    <Image
                        source={require("./images/other_images/nav-top/star.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text
                        style={globalCss.dataNavTop}>{phrasesCompleted.current[currentCategory.url] ? phrasesCompleted.current[currentCategory.url] : 0}</Text>

                    <AnimatedNavTopArrow id={0} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={stylesTest.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
            </View>

            {/* First nav menu */}
            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"test"}>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
                <Text style={stylesTest.navTopModalText}>Hello World!</Text>
            </AnimatedNavTopMenu>

            {/* Second nav menu */}
            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={0}>
                <Text style={stylesTest.navTopModalText}>1sadasda</Text>
                <Text style={stylesTest.navTopModalText}>1sadasda</Text>
                <Text style={stylesTest.navTopModalText}>1sadasda</Text>
                <Text style={stylesTest.navTopModalText}>1sadasda</Text>
                <Text style={stylesTest.navTopModalText}>1sadasda</Text>
            </AnimatedNavTopMenu>

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
                <TouchableOpacity
                    style={[styles.infoCourseBtn, isCardPressedCourseDetails ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
                    onPressIn={() => setIsCardPressedCourseDetails(true)}
                    onPressOut={() => setIsCardPressedCourseDetails(false)}
                    activeOpacity={1}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.infoCategoryImg}
                    />
                </TouchableOpacity>
            </View>


            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{paddingTop: 140, paddingBottom: 20}}
                style={styles.bgCourse}
                onScroll={e => handleScroll(e.nativeEvent)}
                onLayout={(e) => startLayoutY.current = e.nativeEvent.layout.y}
            >
                <View style={styles.container}>
                    <View style={styles.contentFlashCards}>
                        {loadedCategories.map((category) => (
                            <View key={category}
                                  onLayout={(event) => categoriesPos.current[category] = event.nativeEvent.layout.y + startLayoutY.current}>

                                {/*<View style={styles.categoryTitleBg}>
                                    <Text style={styles.categoryTitle}>
                                        {data[category].categoryTitle}
                                    </Text>
                                </View>
                                */}
                                {data[category].items.map((item, index) => (
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
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                size={18}
                                                style={styles.iconFlash}
                                            />
                                        </Text>
                                        <Text>{item.title}</Text>

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
                ...stylesTest.navTopArrowView,
                transform: [{translateY: topPositionNavTopArrows[id]}]
            }}
        >
            {children}
        </Animated.View>
    )
})

const AnimatedNavTopMenu = React.memo(({children, id, topPositionNavTopMenus, heightsNav}) => {
    if (!topPositionNavTopMenus[id]) topPositionNavTopMenus[id] = new Animated.Value(0)
    if (!heightsNav.current.navTopMenu[id]) heightsNav.current.navTopMenu[id] = 999

    return (
        <Animated.View
            style={{
                ...stylesTest.navTopModal,
                top: -heightsNav.current.navTopMenu[id] + heightsNav.current.navTop,
                transform: [{translateY: topPositionNavTopMenus[id]}]
            }}
            onLayout={event => heightsNav.current.navTopMenu[id] = Math.ceil(event.nativeEvent.layout.height + 1)}
        >
            <View style={stylesTest.navTopModalIn}>
                {children}
            </View>
        </Animated.View>
    )
})

const stylesTest = StyleSheet.create({
    arrows: {
        position: 'absolute',
        bottom: "100%",
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },

    navTopArrowView: {
        position: 'absolute',
        bottom: 0,
    },

    navTopArrow: {
        width: 10,
        height: 10,
        resizeMode: 'contain'
    },

    navTopModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },

    navTopModalIn: {
        padding: 20,
        width: "100%",
        backgroundColor: "#3a3a3a"
    },

    navTopModalText: {
        textAlign: 'center',
    },
})

const styles = StyleSheet.create({
    container: {},
    bgCourse: {
        backgroundColor: "#ffffff",
    },
    card: {
        width: 70,
        height: 56,
        marginBottom: "5%",
        borderRadius: 300,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },

    infoCourseSubject: {
        position: 'absolute',
        top: '12%',
        left: '5%',
        right: '5%',
        width: '90%',
        height: 95,
        marginTop: "2%",
        flexDirection: 'row',
        zIndex: 1,
    },

    cardPressed: {
        shadowOffset: {width: 0, height: 0},
        transform: [{translateY: 4}],
    },
    bgGry: {
        backgroundColor: "#e5e5e5",
        shadowColor: "#b7b7b7",
    },
    bgGryPressed: {
        backgroundColor: "#f9f9f9",
        borderColor: "#d8d8d8",
    },
    contentFlashCards: {
        flexDirection: "column",
        // flexWrap: "wrap",
        // justifyContent: "center",
        // alignItems: "center",
        // alignContent: "center",
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingTop: 10,
        paddingLeft: 10,
    },
    infoCourseTitle: {
        color: 'white',
        fontSize: 19,
        width: '80%',
        marginLeft: '5%',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    cardCategoryTitle: {
        width: '73%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    infoCourseBtn: {
        width: '27%',
        height: '100%',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    infoCourseTxtSubCat: {
        color: '#d1ffb1',
        fontSize: 15,
        width: '80%',
        marginLeft: '5%',
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    infoCategoryImg: {
        width: '30%',
        height: '30%',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});














