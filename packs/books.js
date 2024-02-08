import React, {useState, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Pressable, Image, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import Carousel from 'react-native-new-snap-carousel';
import Loader from "./components/Loader";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";


// fonts
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// icons
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';

// styles
import {stylesnav_dropdown as navDropdown} from "./css/navDropDownTop.styles";
import globalCss from './css/globalCss';

// for nav top
import {fadeInNav, fadeOutNav} from "./components/FadeNavMenu";

export default function BooksScreen({navigation}) {
    const [pressedCards, setPressedCards] = useState({});
    const [data, setData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const finishedBooks = useRef(0)

    useMemo(() => {
        console.log(data)
        setLoading(true);

        sendDefaultRequest(`${SERVER_AJAX_URL}/books/get_books.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                finishedBooks.current = data.finishedBooks

                setData(data.data);

                const uniqueCategories = [...new Set(data.data.map(item => item.type_category))];
                setCategories(uniqueCategories);
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 1)
            }); // Dezactivează Loader-ul
    }, []);


    const onPressIn = (id) => {
        setPressedCards(prevState => ({...prevState, [id]: true}));
    };

    const onPressOut = (id) => {
        setPressedCards(prevState => ({...prevState, [id]: false}));
    };

    const getCategoryBooks = (category) => {
        return data.filter(item => item.type_category === category);
    };

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

    return (
        <View style={styles.container}>

        <View style={globalCss.navTabUser}>
          <View style={globalCss.itemNavTabUser}>
            <Image
              source={require("./images/other_images/nav-top/english.webp")}
              style={globalCss.imageNavTop}
            />
            <Text style={globalCss.dataNavTop}>EN</Text>
          </View>
          <TouchableOpacity style={globalCss.itemNavTabUser}  onPress={() => toggleNavTopMenu("booksReadedAnalytics")}>
            <Image
              source={require("./images/other_images/nav-top/book.png")}
              style={globalCss.imageNavTop}
            />
            <Text style={globalCss.dataNavTop}>{finishedBooks.current}</Text>
            <AnimatedNavTopArrow id={"booksReadedAnalytics"} topPositionNavTopArrows={topPositionNavTopArrows}>
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
            <Text style={globalCss.dataNavTop}>4</Text>
          </View>
          <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("booksSavedAnalytics")}>
            <Image
              source={require("./images/other_images/nav-top/bookmark.png")}
              style={globalCss.imageNavTop}
            />
            <Text style={globalCss.dataNavTop}>4</Text>
            <AnimatedNavTopArrow id={"booksSavedAnalytics"} topPositionNavTopArrows={topPositionNavTopArrows}>
                <Image
                    source={require("./images/icon/arrowTop.png")}
                    style={navDropdown.navTopArrow}
                />
            </AnimatedNavTopArrow>
          </TouchableOpacity>
        </View>

        <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"booksReadedAnalytics"}>
            <View style={navDropdown.containerSentences}>

                  <Text style={navDropdown.titleh5}>Прочитанные книги</Text>
                  <Text style={navDropdown.titleh6}>Сколько книг я уже прочитал?</Text>

                <View style={navDropdown.containerCourseData}>
                  <View style={navDropdown.cardCourseData}>
                    <View style={navDropdown.iconContainerRead}>
                        <Image
                            source={require('./images/other_images/educationReading.png')}
                            style={navDropdown.booksImgCard}
                        />
                    </View>
                    <View style={navDropdown.dividerCourseData} />
                    <View style={navDropdown.fluencyContainer}>
                      <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                      <Text style={[navDropdown.fluencyText, globalCss.green]}>23 / 327</Text>
                    </View>
                  </View>
                </View>

            </View>
        </AnimatedNavTopMenu>

        <AnimatedNavTopMenu topPositionNavTopMenus={topPositionNavTopMenus} heightsNav={heightsNav} id={"booksSavedAnalytics"}>
            <View style={navDropdown.containerSentences}>

                  <Text style={navDropdown.titleh5}>Сохранённые книги</Text>
                  <Text style={navDropdown.titleh6}>Общее количество закладок</Text>

                <View style={navDropdown.containerCourseData}>
                  <View style={navDropdown.cardCourseData}>
                    <View style={navDropdown.iconContainerRead}>
                        <Image
                            source={require('./images/other_images/bookmarks.png')}
                            style={navDropdown.booksImgCard}
                        />
                    </View>
                    <View style={navDropdown.dividerCourseData} />
                    <View style={navDropdown.fluencyContainer}>
                      <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                      <Text style={[navDropdown.fluencyText, globalCss.green]}>11 / 327</Text>
                    </View>
                  </View>
                </View>

            </View>
        </AnimatedNavTopMenu>

            {/* Background for nav menu */}
            <AnimatedNavTopBg navTopBgTranslateX={navTopBgTranslateX.current} navTopBgOpacity={navTopBgOpacity.current} toggleNavTopMenu={toggleNavTopMenu}/>

        <ScrollView contentContainerStyle={{ paddingTop: 20, paddingBottom: 0, paddingRight: 20, paddingLeft: 20 }}>
            <Loader visible={loading}/>
            {categories.map((category, index) => (
                <View key={index}>
                    <View style={[globalCss.row, globalCss.mb3]}>
                        <View>
                            <Text style={styles.titleCategory}>
                                {category}
                            </Text>
                            <Text style={styles.totalBooks}>
                                {getCategoryBooks(category).length} книг
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.openCategory}
                            onPress={() => navigation.navigate('BooksCategory', {category: category})} // Trimite denumirea categoriei la pagina următoare
                            activeOpacity={1}
                        >
                            <View style={styles.openCatTxt}>
                                <Text style={styles.catTxt}>
                                    см. все
                                </Text>
                                <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.faChevronRight}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={globalCss.mb11}>
                        <Carousel
                            data={getCategoryBooks(category).slice(0, 10)}
                            renderItem={({item}) => (
                                <View style={styles.cell}>
                                    <TouchableOpacity
                                        style={[styles.card, pressedCards[item.id] ? [styles.cardPressed, styles.bgGryPressed] : styles.bgGry]}
                                        onPress={() => navigation.navigate('BooksReading', {id: item.id})}
                                        onPressIn={() => onPressIn(item.id)}
                                        onPressOut={() => onPressOut(item.id)}
                                        activeOpacity={1}
                                    >
                                        <Image
                                            source={{
                                                uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/${item.image}`,
                                            }}
                                            style={styles.image}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.author}>{item.author}</Text>
                                </View>
                            )}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={140}
                            loop={false}
                            autoplay={false}
                            inactiveSlideScale={1}
                            firstItem={0}
                            enableSnap={false}
                            contentContainerCustomStyle={{paddingLeft: -10}}
                        />
                    </View>
                </View>
            ))}
        </ScrollView>
        </View>
    );
}


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
        flex: 1, 
        backgroundColor: 'white',
    },
    cell: {
        marginRight: '8%',
    },
    card: {
        width: '100%',
        marginBottom: '0%',
        borderRadius: 12,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 0,
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
    contentBooks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: '100%',
        height: 205,
        resizeMode: 'cover',
        borderRadius: 7,
    },
    titleCategory: {
        fontSize: 19,
        fontWeight: '600',
    },
    totalBooks: {
        fontSize: 14,
    },
    title: {
        fontSize: 15,
        marginTop: '4%',
        fontWeight: 'bold',
        color: 'black',
    },
    author: {
        fontSize: 12,
        color: 'black',
    },
    openCategory: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    openCatTxt: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    catTxt: {
        fontSize: 18,
        color: '#008eff',
    },
    faChevronRight: {
        color: '#008eff',
        fontWeight: '400',
        marginTop: 2.5,
    },



});
