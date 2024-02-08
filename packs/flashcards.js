import React, {useState, useRef, useMemo} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Animated, Pressable,} from 'react-native';

// styles
import globalCss from './css/globalCss';
import {stylesnav_dropdown as navDropdown} from "./css/navDropDownTop.styles";

// fonts
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// icons
import {faStar} from '@fortawesome/free-solid-svg-icons';

// for nav top
import {fadeInNav, fadeOutNav} from "./components/FadeNavMenu";

import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import Loader from "./components/Loader";

const FlashCardWords = ({navigation}) => {
    const [pressedCards, setPressedCards] = useState({});
    const [data, setData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollViewRef = useRef(null);

    const navTopData = useRef({
        finished: 0,
        words: 0,
        series: 0
    }).current

    useMemo(() => {
        setIsLoading(true); // Activează loader-ul înainte de solicitarea fetch

        sendDefaultRequest(`${SERVER_AJAX_URL}/flashcards/flashcard_words.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                navTopData.finished = data.finishedCounter
                navTopData.words = data.wordsCounter
                navTopData.series = data.series

                setData(data.data);
                setVisibleData(data.data.slice(0, 20)); // Afișează primele 20 de carduri inițial
            })
            .finally(() => {
                setTimeout(() => setIsLoading(false), 1)
            })
    }, []);

// Nav top Menu
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

    const onPressIn = (id) => {
        setPressedCards(prevState => ({...prevState, [id]: true}));
    };

    const onPressOut = (id) => {
        setPressedCards(prevState => ({...prevState, [id]: false}));
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const screenHeight = event.nativeEvent.layoutMeasurement.height;

        // Verifică dacă utilizatorul a derulat până la sfârșit
        if (visibleData.length !== data.length && offsetY + screenHeight >= contentHeight - 20 && !isLoading) {
            setIsLoading(true);

            // Încarcă următoarele carduri din baza de date
            const nextVisibleData = data.slice(visibleData.length, visibleData.length + 20);

            setTimeout(() => {
                setVisibleData(prevVisibleData => [...prevVisibleData, ...nextVisibleData]);
                setIsLoading(false);
            }, 1000); // Acesta este un delay simulat pentru a demonstra încărcarea treptată
        }
    };

    return (
        <View style={styles.container}>
            <Loader visible={isLoading}/>
            <View style={globalCss.navTabUser}>
                <View style={globalCss.itemNavTabUser}>
                    <Image
                        source={require("./images/other_images/nav-top/english.webp")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>EN</Text>
                </View>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("lessonsLearned")}>
                    <Image
                        source={require("./images/other_images/nav-top/inkwell.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{navTopData.finished}</Text>
                    <AnimatedNavTopArrow id={"lessonsLearned"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUser}>
                    <Image
                        source={require("./images/other_images/nav-top/flame.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{navTopData.series}</Text>
                </View>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("knownWords")}>
                    <Image
                        source={require("./images/other_images/nav-top/flash-card.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{navTopData.words}</Text>
                    <AnimatedNavTopArrow id={"knownWords"} topPositionNavTopArrows={topPositionNavTopArrows}>
                        <Image
                            source={require("./images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
            </View>

            <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"lessonsLearned"}>
            <View style={navDropdown.containerSentences}>

                  <Text style={navDropdown.titleh5}>Пройденные уроки</Text>
                  <Text style={navDropdown.titleh6}>Сколько уроков я прошёл?</Text>

                <View style={navDropdown.containerCourseData}>
                  <View style={navDropdown.cardCourseData}>
                    <View style={navDropdown.iconContainerRead}>
                        <Image
                            source={require('./images/other_images/knowledge.png')}
                            style={navDropdown.booksImgCard}
                        />
                    </View>
                    <View style={navDropdown.dividerCourseData} />
                    <View style={navDropdown.fluencyContainer}>
                      <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                      <Text style={[navDropdown.fluencyText, globalCss.green]}>23 / 557</Text>
                    </View>
                  </View>
                </View>

            </View>
        </AnimatedNavTopMenu>

        <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"knownWords"}>
            <View style={navDropdown.containerSentences}>

                  <Text style={navDropdown.titleh5}>Изученные слова</Text>
                  <Text style={navDropdown.titleh6}>Сколько слов я изучил?</Text>

                <View style={navDropdown.containerCourseData}>
                  <View style={navDropdown.cardCourseData}>
                    <View style={navDropdown.iconContainerRead}>
                        <Image
                            source={require('./images/other_images/tasks.png')}
                            style={navDropdown.booksImgCard}
                        />
                    </View>
                    <View style={navDropdown.dividerCourseData} />
                    <View style={navDropdown.fluencyContainer}>
                      <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                      <Text style={[navDropdown.fluencyText, globalCss.green]}>11 / 5351</Text>
                    </View>
                  </View>
                </View>

            </View>
        </AnimatedNavTopMenu>

            {/* Background for nav menu */}
            <AnimatedNavTopBg navTopBgTranslateX={navTopBgTranslateX.current} navTopBgOpacity={navTopBgOpacity.current} toggleNavTopMenu={toggleNavTopMenu}/>



            <ScrollView
                contentContainerStyle={{paddingTop: 30, paddingBottom: 220}}
                onScroll={handleScroll}
                scrollEventThrottle={400}
                ref={scrollViewRef}
            >
                <View style={styles.contentFlashCards}>
                    {visibleData.map((item, index) => (
                        <View key={item.id}
                              style={[{width: index % 3 === 0 ? '100%' : '50%'}, globalCss.alignItemsCenter]}>
                            <TouchableOpacity
                                style={[
                                    styles.card,
                                    pressedCards[item.id] && styles.cardPressed,
                                    styles.bgGry,
                                    pressedCards[item.id] && styles.bgGryPressed,
                                ]}
                                onPress={() => navigation.navigate('FlashCardsWordsCategory', {
                                    codeName: item.code_name,
                                    codeTitle: item.title_category
                                })}
                                onPressIn={() => onPressIn(item.id)}
                                onPressOut={() => onPressOut(item.id)}
                                activeOpacity={1}
                            >
                                <Text>
                                    <FontAwesomeIcon icon={faStar} size={30} style={styles.iconFlash}/>
                                </Text>
                            </TouchableOpacity>
                            <Text>{item.finished ? "Эта карточка завершена" : ""}</Text>
                            <Text style={styles.titleFlashCards}>{item.title_category}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

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

const AnimatedNavTopMenu = React.memo(({children, id, topPositionNavTopMenus, heightsNav}) => {
    if (!topPositionNavTopMenus[id]) topPositionNavTopMenus[id] = new Animated.Value(0)
    if (!heightsNav.current.navTopMenu[id]) heightsNav.current.navTopMenu[id] = 99999

    return (
        <Animated.View
            style={{
                ...navDropdown.navTopModal,
                top: -heightsNav.current.navTopMenu[id] + heightsNav.current.navTop,
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    titleFlashCards: {
        marginBottom: '15%',
        fontSize: 13,
        maxWidth: '80%',
        alignSelf: 'center',
        textAlign: 'center',
    },
    card: {
        // 110
        width: 100,
        height: 100,
        marginBottom: '6%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    cardPressed: {
        shadowOffset: {width: 0, height: 0},
        transform: [{translateY: 4}],
    },
    bgGry: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8',
        shadowColor: '#d8d8d8',
    },
    bgGryPressed: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8',
    },
    contentFlashCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        zIndex: 2,
    }
});

export default FlashCardWords;
