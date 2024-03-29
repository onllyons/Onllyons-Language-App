import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';

// styles
import globalCss from './css/globalCss';

// fonts
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// icons
import {faStar} from '@fortawesome/free-solid-svg-icons';

import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import Loader from "./components/Loader";
import {NavTop} from "./components/flashcards/NavTop";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";
import {useFocusEffect} from "@react-navigation/native";
import {useStore} from "./providers/StoreProvider";

const FlashCardWords = ({navigation}) => {
    const {deleteStoredValue, setStoredValueAsync, getStoredValue} = useStore()
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [updateState, setUpdateState] = useState(false)

    const navTopData = useRef({
        finished: 0,
        finishedWords: 0,
        allLessons: 0,
        allWords: 0
    })

    useFocusEffect(
        useCallback(() => {
            const needToUpdateBooksCategory = getStoredValue("needToUpdateFlashcards")

            if (needToUpdateBooksCategory !== null) {
                deleteStoredValue("needToUpdateFlashcards")
                setUpdateState(prev => !prev)
            }
        }, [])
    );

    useMemo(() => {
        const data = getStoredValue("flashcardsData", true)

        if (data) {
            navTopData.current = data.navTopData
            setData(data.data)
        }
    }, []);

    useEffect(() => {
        if (!refreshing && data.length !== 0) return;

        setIsLoading(true)

        sendDefaultRequest(`${SERVER_AJAX_URL}/flashcards/flashcard_words.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                navTopData.current = data.cardsInfo

                setData(data.data);

                setStoredValueAsync(`flashcardsData`, {
                    data: data.data,
                    navTopData: data.cardsInfo
                })
                    .then(() => {})
                    .catch(() => {})
            })
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false)
                    setIsLoading(false)
                }, 300)
            }); // Dezactivează Loader-ul
    }, [refreshing]);

    return (
        <View style={styles.container}>
            <Loader notFull={true} visible={isLoading}/>

            <NavTop loading={isLoading} data={navTopData.current}/>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => setRefreshing(true)}
                    />
                }
                contentContainerStyle={{paddingTop: 30}}
            >
                <View style={styles.contentFlashCards}>
                    {data.map((item, index) => (
                        <View key={item.id}
                              style={[{width: index % 3 === 0 ? '100%' : '50%'}, globalCss.alignItemsCenter]}>
                            <AnimatedButtonShadow
                                shadowDisplayAnimate={"slide"}
                                styleButton={[
                                    styles.card,
                                    styles.bgGry,
                                    item.finished.length === item.cards && styles.finishedCourseLesson
                                ]}
                                shadowColor={(item.finished.length === item.cards ? "yellow" : "#adadad")}
                                shadowBorderRadius={60}
                                onPress={() => navigation.navigate('FlashCardsWordsCategory', {
                                    codeName: item.code_name,
                                    codeTitle: item.title_category,
                                    finishedInCategory: item.finished,
                                    generalInfo: navTopData.current
                                })}
                            >
                                <Text>
                                  <FontAwesomeIcon
                                    icon={faStar}
                                    size={30}
                                    style={[
                                      styles.iconFlash,
                                      item.finished.length === item.cards && styles.finishedCourseLessonIcon
                                    ]}
                                  />
                                </Text>

                            </AnimatedButtonShadow>
                            <Text style={styles.titleFlashCards}>{item.title_category}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    titleFlashCards: {
        marginBottom: '15%',
        fontSize: 13,
        maxWidth: '80%',
        alignSelf: 'center',
        textAlign: 'center',
    },
    card: {
        width: 100,
        height: 100,
        marginBottom: '6%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgGry: {
        backgroundColor: '#e5e5e5',
    },
    contentFlashCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        zIndex: 2,
    },
    finishedCourseLesson: {
        backgroundColor: '#ffd700'
    },
    finishedCourseLessonIcon: {
        color: 'white'
    },
    iconFlash:{
        color: "#ababab",
    },
});

export default FlashCardWords;
