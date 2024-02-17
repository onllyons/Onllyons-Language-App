import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from "react-native";
import globalCss from './css/globalCss';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";
import {Welcome} from "./components/Welcome";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export default function FlashCardsCategory({route, navigation}) {
    const {codeName, codeTitle} = route.params;
    const [data, setData] = useState([]);
    // const [pressedCards, setPressedCards] = useState({});
    const [loading, setLoading] = useState(false);
    const colors = ['#FF9400', '#7BC70A', '#CE81FF', '#1AB1F6', '#ffcc01', '#FC4849'];
    // const colorsPressed = ['#ffb14c', '#92ea0e', '#deadff', '#59c7f7', '#f9d243', '#f97575'];

    const images = [
        require('./images/other_images/flash-cards-leeson/kitty.png'),
        require('./images/other_images/flash-cards-leeson/house.png'),
        require('./images/other_images/flash-cards-leeson/dog.png'),
        require('./images/other_images/flash-cards-leeson/astronomy.png'),
        require('./images/other_images/flash-cards-leeson/paper-lantern.png'),
        require('./images/other_images/flash-cards-leeson/snowflake.png'),
        require('./images/other_images/flash-cards-leeson/night.png'),
        require('./images/other_images/flash-cards-leeson/swords.png'),
        require('./images/other_images/flash-cards-leeson/dragon.png'),
        require('./images/other_images/flash-cards-leeson/crown.png'),
        require('./images/other_images/flash-cards-leeson/circle.png'),
        require('./images/other_images/flash-cards-leeson/sea-waves.png'),
        require('./images/other_images/flash-cards-leeson/fire.png'),
        require('./images/other_images/flash-cards-leeson/star.png'),
        require('./images/other_images/flash-cards-leeson/groundhog.png'),
        require('./images/other_images/flash-cards-leeson/groundhog1.png'),
        require('./images/other_images/flash-cards-leeson/groundhog2.png'),
        require('./images/other_images/flash-cards-leeson/glasses.png'),
        require('./images/other_images/flash-cards-leeson/cupcake.png'),
        require('./images/other_images/flash-cards-leeson/camera.png'),
        require('./images/other_images/flash-cards-leeson/wedding-planner.png'),
        require('./images/other_images/flash-cards-leeson/fireworks.png'),
    ];
    const [shuffledImages, setShuffledImages] = useState([]);

    useEffect(() => {
        setShuffledImages(shuffleArray([...images]));
    }, []);


    useEffect(() => {
        setLoading(true); // Activează loader-ul înainte de solicitarea fetch

        sendDefaultRequest(`${SERVER_AJAX_URL}/flashcards/flashcard_words_category.php`,
            {category: codeName},
            navigation,
            {success: false}
        )
            .then(({data}) => {
                setData(data);
            })
            .catch((err) => {
                if (typeof err === "object") {
                    if (!err.tokensError) {
                        navigation.goBack()
                    }
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 0);
            })
    }, [codeName]); // Dependența pentru useEffect


    const getCategoryImageAndText = (categoryValue) => {
        switch (Number(categoryValue)) {
            case 1:
                return {
                    imageSource: require('./images/icon/1-star.png')
                };
            case 2:
                return {
                    imageSource: require('./images/icon/2-star.png')
                };
            case 3:
                return {
                    imageSource: require('./images/icon/3-star.png')
                };
            default:
                return {
                    imageSource: null
                };
        }
    };

    // const onPressIn = (id) => {
    //     setPressedCards(prevState => ({...prevState, [id]: true}));
    // };
    //
    // const onPressOut = (id) => {
    //     setPressedCards(prevState => ({...prevState, [id]: false}));
    // };

    return loading ? (<Welcome/>) : (
        <View style={styles.containerMain}>
            <View style={globalCss.navTabUser}>
                <TouchableOpacity style={globalCss.itemNavTabUserBtnBack}
                                  onPress={() => navigation.navigate('FlashCardsScreen')}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>{codeTitle}</Text>
                </View>
            </View>

            <ScrollView>
                <View style={styles.container}>
                    {data.map((item, index) => (
                        <View style={styles.cardLesson} key={item.id}>
                            <AnimatedButtonShadow
                                shadowDisplayAnimate={"slide"}
                                styleButton={[
                                    styles.item,
                                    {
                                        // backgroundColor: pressedCards[item.id] ? colorsPressed[index % colorsPressed.length] : colors[index % colors.length],
                                        backgroundColor: colors[index % colors.length],
                                        borderColor: '#d8d8d8',
                                    },
                                ]}
                                shadowColor={"gray"}
                                shadowBorderRadius={10}
                                onPress={() => navigation.navigate('FlashCardsWords', {url: item.url})}>

                                <Image
                                    source={shuffledImages[index % shuffledImages.length]}
                                    style={styles.randomImg}
                                />

                                <View style={styles.levelStars}>
                                    <Text>{item.finished ? "Эта карточка пройдена" : ""}</Text>
                                    <Image
                                        source={getCategoryImageAndText(item.category).imageSource}
                                        style={styles.levelIcon}
                                    />
                                </View>
                            </AnimatedButtonShadow>
                        </View>
                    ))}
                </View>

                <AnimatedButtonShadow
                    disable={true}
                    shadowDisplayAnimate={"slide"}
                    styleButton={[styles.containerMessage,  globalCss.buttonGry1]}
                    shadowColor={"grayWhite"}
                    shadowBorderRadius={14}
                >
                    <Text style={styles.buttonText}>
                        В каждом уроке представлены не более 10 слов, чтобы облегчить изучение и запоминание.
                        Это позволяет более эффективно усваивать материал, сосредотачиваясь на небольшом количестве слов
                        за один раз.
                    </Text>
                </AnimatedButtonShadow>


            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    containerMain: {
        backgroundColor: 'white',
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: '2%',
    },
    containerMessage: {
        marginHorizontal: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 14,
        marginBottom: 20
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
    cardLesson: {
        width: '33%',
        marginBottom: 20,
        paddingHorizontal: '2.5%',

    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    item: {
        width: '100%',
        height: 140,
        paddingTop: 10,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderRadius: 10,
        borderColor: '#d8d8d8'
    },
    title: {
        fontSize: 17,
        marginTop: '2%',
        fontWeight: "bold",
    },
    author: {
        fontSize: 14,
        marginTop: '2%',
        color: "gray",
    },
    levelHard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%',
        alignContent: 'flex-start',
    },
    levelStars: {
        flex: 1,
        resizeMode: 'contain',
        width: '80%',
        alignSelf: 'center',
    },
    levelIcon: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        alignSelf: 'center',
    },
    randomImg: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        alignSelf: 'center',
    },
    levelHardTxt: {
        marginLeft: '3%'
    },
});
