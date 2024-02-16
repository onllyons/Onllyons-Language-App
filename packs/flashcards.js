import React, {useState, useRef, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

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

const FlashCardWords = ({navigation}) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollViewRef = useRef(null);

    const navTopData = useRef({
        finished: 0,
        finishedWords: 0,
        allLessons: 0,
        allWords: 0
    })

    useMemo(() => {
        setIsLoading(true); // Activează loader-ul înainte de solicitarea fetch

        sendDefaultRequest(`${SERVER_AJAX_URL}/flashcards/flashcard_words.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                navTopData.current = data.cardsInfo

                setData(data.data);
            })
            .finally(() => {
                setTimeout(() => setIsLoading(false), 1)
            })
    }, []);

    return (
        <View style={styles.container}>
            <Loader visible={isLoading}/>

            <NavTop data={navTopData.current}/>

            <ScrollView
                contentContainerStyle={{paddingTop: 30, paddingBottom: 80, minHeight: "100%"}}
                scrollEventThrottle={400}
                ref={scrollViewRef}
            >
                <View style={styles.contentFlashCards}>
                    {data.map((item, index) => (
                        <View key={item.id}
                              style={[{width: index % 3 === 0 ? '100%' : '50%'}, globalCss.alignItemsCenter]}>
                            <AnimatedButtonShadow
                                styleButton={[
                                    styles.card,
                                    styles.bgGry
                                ]}
                                shadowColor={"gray"}
                                shadowBorderRadius={60}
                                onPress={() => navigation.navigate('FlashCardsWordsCategory', {
                                    codeName: item.code_name,
                                    codeTitle: item.title_category
                                })}
                            >
                                <Text>
                                    <FontAwesomeIcon icon={faStar} size={30} style={styles.iconFlash}/>
                                </Text>
                            </AnimatedButtonShadow>
                            <Text>{item.finished ? "Эта карточка завершена" : ""}</Text>
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
        borderRightWidth: 2
    },
    bgGry: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8'
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
