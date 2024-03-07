import React, {useCallback, useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from "react-native";
import globalCss from './css/globalCss';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";
import {useFocusEffect} from "@react-navigation/native";
import {useStore} from "./providers/StoreProvider";
import Loader from "./components/Loader";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export default function FlashCardsCategory({route, navigation}) {
    const {deleteStoredValue, getStoredValue} = useStore()
    const {codeName, codeTitle, finishedInCategory, generalInfo} = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateState, setUpdateState] = useState(false)
    const colors = ['#FF9400', '#7BC70A', '#CE81FF', '#1AB1F6', '#ffcc01', '#FC4849'];

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

    useFocusEffect(
        useCallback(() => {
            const needToUpdateBooksCategory = getStoredValue("needToUpdateFlashcardsCategory")

            if (needToUpdateBooksCategory !== null) {
                deleteStoredValue("needToUpdateFlashcardsCategory")
                setUpdateState(prev => !prev)
            }
        }, [])
    );

    useEffect(() => {
        setLoading(true);

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
                }, 300);
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

    return (
        <View style={styles.containerMain}>
            <Loader visible={loading}/>

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
                                styleButton={[
                                    styles.item,
                                    {
                                        backgroundColor: item.finished ? '#30a5ff' : colors[index % colors.length]
                                    },
                                ]}

                                shadowColor={"gray"}
                                shadowBorderRadius={10}
                                onPress={() => navigation.navigate('FlashCardsWords', {url: item.url, id: item.id, item: item, finishedInCategory: finishedInCategory, generalInfo: generalInfo})}>

                                {item.finished ? 
                                    <Image
                                        source={require('./images/other_images/flash-cards-leeson/check.png')}
                                        style={styles.checkIcon}
                                    />
                                    :
                                    <Image
                                        source={shuffledImages[index % shuffledImages.length]}
                                        style={styles.randomImg}
                                    />
                                }

                                <View style={styles.levelStars}>
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
        borderRadius: 10,
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
    checkIcon: {
        flex: 1,
        resizeMode: 'contain',
        width: '45%',
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
