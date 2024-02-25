// Importuri din React și React Native
import React, {useState, useCallback, useEffect, useRef} from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated, SafeAreaView
} from "react-native";

// Importuri pentru navigare
import {useRoute} from "@react-navigation/native";

// Importuri pentru gestionarea audio
import {Audio} from "expo-av";

// Import pentru gestionarea gesturilor
import {GestureHandlerRootView} from "react-native-gesture-handler";

import {sendDefaultRequest, SERVER_AJAX_URL, SERVER_URL} from "./utils/Requests";

// Componente personalizate
import {useStore} from "./providers/Store";
import {BottomSheetComponent} from "./components/books/reading/BottomSheetComponent";
import {ControlButtons} from "./components/books/reading/ControlButtons";
import {Header} from "./components/books/reading/Header";
import Loader from "./components/Loader";
import globalCss from "./css/globalCss";

export default function BooksScreen({navigation}) {
    const {setStoredValue} = useStore();
    const route = useRoute();
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [saved, setSaved] = useState(false);
    const bottomSheetRef = useRef(null);
    const [data, setData] = useState([]);
    const [wordsArray, setWordsArray] = useState([]);
    const {id: bookId, item, info} = route.params;
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const intervalCheckWord = useRef(null);
    const lastActuallyWordIndex = useRef(0)
    const wordsArrayLength = useRef(0)
    const allowSubtitles = useRef(true)

    // butoane pentru mute si volum
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = useCallback(async () => {
        if (sound) {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

            if (status.isMuted) {
                await sound.setIsMutedAsync(false); // Setează volumul la normal dacă este pe mute
                setIsMuted(false);
            } else {
                await sound.setIsMutedAsync(true); // Pune pe mute
                setIsMuted(true);
            }
        }
    }, [sound])

    const rewindSound = useCallback(async (seconds) => {
        if (sound) {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

            const nextPosition = status.positionMillis + seconds * 1000

            if (nextPosition >= status.durationMillis) {
                await sound.pauseAsync()
                await sound.setPositionAsync(0);
                lastActuallyWordIndex.current = wordsArrayLength.current
                setIsPlaying(false)
                setCurrentWordIndex(wordsArrayLength.current)
            } else {
                await sound.setPositionAsync(nextPosition);
            }
        }
    }, [sound])

    const handleScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const height = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;

        // Calculați procentajul de scroll (0 - 100)
        let scrollPercentage = (y / (contentHeight - height)) * 100;
        scrollPercentage = isNaN(scrollPercentage) ? 0 : scrollPercentage;

        // Asigurați-vă că procentajul nu depășește 100
        scrollPercentage = Math.min(100, Math.max(0, scrollPercentage));

        // Actualizați animația progresului cu noul procentaj
        scrollAnim.setValue(scrollPercentage); // Folosiți 'setValue' pentru a actualiza valoarea animației
    };

    const onPlaybackStatusUpdate = useCallback(status => {
        if (status.didJustFinish) {
            lastActuallyWordIndex.current = wordsArrayLength.current
            setIsPlaying(false)
            setCurrentWordIndex(wordsArrayLength.current)
        }
    }, [])

    const playSound = useCallback(async (options = {}) => {
        options = {stop: false, startMillis: 0, ...options}

        if (sound) {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

            if (options.startMillis > 0) {
                await sound.setPositionAsync(options.startMillis);

                if (!status.isPlaying) {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                if (options.stop) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                    return
                }

                if (status.isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    if (status.positionMillis >= status.durationMillis) {
                        await sound.replayAsync();
                        lastActuallyWordIndex.current = 0
                        setCurrentWordIndex(0)
                    } else {
                        await sound.playAsync();
                    }

                    setIsPlaying(true);
                }
            }
        }
    }, [sound])

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
                setSound(null)
            }
            : undefined;
    }, [sound]);

    useEffect(() => {
        setLoading(true);
        allowSubtitles.current = true
        setFinished(false);
        setSaved(false);
        setData([]);
        wordsArrayLength.current = 0
        setWordsArray([]);

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/books/test_book.php`,
            {id: bookId},
            navigation,
            {success: false}
        )
            .then(async (data) => {
                allowSubtitles.current = data.allowSubtitles
                setFinished(!!data.data.finished);
                setSaved(!!data.data.saved);
                setData(data.data);
                const staticWordsArray = data.data.wordsArray;
                wordsArrayLength.current = data.data.wordsArray.length
                setWordsArray(staticWordsArray);

                if (sound) {
                    await sound.unloadAsync()
                    setSound(null)
                }

                Audio.Sound.createAsync(
                    {uri: `${SERVER_URL}/ru/ru-en/packs/assest/books/read-books/audio/${data.data.audio_file}`}
                )
                    .then(async ({sound}) => {
                        await sound.setVolumeAsync(1);
                        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
                        setSound(sound);
                    })
                    .catch(() => {})
                    .finally(() => setLoading(false))
            })
            .catch((err) => {
                setLoading(false);

                if (typeof err === "object" && !err.tokensError) {
                    navigation.goBack();
                }
            })
    }, [bookId]);

    useEffect(() => {
        if (intervalCheckWord.current) {
            clearInterval(intervalCheckWord.current)
            intervalCheckWord.current = null
        }

        if (isPlaying && sound && allowSubtitles.current) {
            intervalCheckWord.current = setInterval(async () => {
                const status = await sound.getStatusAsync();

                if (status.isPlaying) {
                    const currentTime = status.positionMillis;
                    let wordIndex = wordsArray.findIndex(
                        (word) =>
                            currentTime >= word.start &&
                            currentTime < word.start + word.duration
                    );

                    if (wordIndex === -1) {
                        wordIndex = lastActuallyWordIndex.current
                    } else {
                        lastActuallyWordIndex.current = wordIndex
                    }

                    setCurrentWordIndex(wordIndex); // Actualizează cuvântul curent pe baza timpului de redare
                }
            }, 100); // Verifică la fiecare 100 ms
        }

        return () => intervalCheckWord.current && clearInterval(intervalCheckWord.current);
    }, [isPlaying, sound]);

    const unloadSound = useCallback(() => {
        return sound
            ? () => {
                sound.unloadAsync();
                setSound(null)
            }
            : undefined;
    }, [sound])

    const handleOpenBottomSheetPress = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const handleBookmark = useCallback(() => {
        sendDefaultRequest(
            `${SERVER_AJAX_URL}/books/create_bookmark.php`,
            {id: bookId},
            navigation,
            {success: false}
        )
            .then(() => {
            })
            .catch(() => {
            });

        if (item) item.saved = !saved;

        const indexSaved = info.saved.indexOf(bookId);

        if (!saved) {
            if (indexSaved === -1) {
                setStoredValue("needToUpdateBooks", true);
                info.saved.push(bookId);
            }
        } else {
            if (indexSaved !== -1) {
                setStoredValue("needToUpdateBooks", true);
                info.saved.splice(indexSaved, 1);
            }
        }

        setSaved(!saved);
    }, [saved])

    const handleFinish = useCallback(() => {
        sendDefaultRequest(
            `${SERVER_AJAX_URL}/books/finish_book.php`,
            {id: bookId},
            navigation,
            {success: false}
        )
            .then(() => {
            })
            .catch(() => {
            });

        if (item) item.finished = !finished;

        const indexFinish = info.finished.indexOf(bookId);

        if (!finished) {
            if (indexFinish === -1) {
                setStoredValue("needToUpdateBooks", true);
                info.finished.push(bookId);
            }
        }

        setStoredValue("needToUpdateBooksCategory", true);

        setFinished(!finished);
    }, [finished])

    const playFromWord = useCallback(async (startMillis) => playSound({startMillis: startMillis}), [sound])

    return (
        <GestureHandlerRootView style={styles.container}>
            <Loader visible={loading}/>

            <Header handleOpenBottomSheetPress={handleOpenBottomSheetPress} scrollAnim={scrollAnim}/>

            <SafeAreaView>
                <ScrollView
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{
                        paddingTop: 30,
                        paddingBottom: 160,
                        paddingHorizontal: 20
                    }}
                >
                    {!allowSubtitles.current && (
                        <Text style={globalCss.incorrect}>Функция субтитров доступна только пользователям PRO подписки</Text>
                    )}

                    <Text style={styles.titleBook}>{data.title}</Text>
                    <Text style={styles.titleAuthor}>{data.author}</Text>

                    <View style={styles.textContainer}>
                        {wordsArray.length > 0 && wordsArray.map((word, index) => (
                            <Word
                                key={index}
                                word={word}
                                isFocused={index === currentWordIndex}
                                isAfterFocused={index < currentWordIndex}
                                playFromWord={playFromWord}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <ControlButtons
                playSound={playSound}
                toggleMute={toggleMute}
                isPlaying={isPlaying}
                isMuted={isMuted}
                rewindSound={rewindSound}
                unloadSound={unloadSound}
            />

            <BottomSheetComponent
                bottomSheetRef={bottomSheetRef}
                finished={finished}
                saved={saved}
                handleFinish={handleFinish}
                handleBookmark={handleBookmark}
            />
        </GestureHandlerRootView>
    );
}

const Word = React.memo(({
    word,
    isFocused,
    isAfterFocused,
    playFromWord
}) => {
    // Dacă elementul este o imagine
    if (word.text === "IMAGE") {
        return (
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: word.src}}
                    style={styles.sourceImgBook}
                />
            </View>
        );
    }

    // Pentru elementele cu timp asociat, afișăm ca butoane
    const hasTiming = word.start || word.duration;

    if (hasTiming) {
        return (
            <TouchableOpacity
                onPress={() => playFromWord(word.start)}
                style={[
                    styles.textTouchableDef,
                    isFocused &&
                    styles.highlightedTextBtn,
                ]}
            >
                <Text
                    style={[
                        styles.readingContent,
                        isFocused ? styles.highlightedText : (isAfterFocused && styles.readText)
                    ]}
                >
                    {word.text + " "}
                </Text>
            </TouchableOpacity>
        );
    }

    // Pentru text simplu, fără timp asociat
    return (
        <Text
            style={styles.readingContent}
        >
            {word.text + " "}
        </Text>
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        paddingTop: "12%",
        backgroundColor: '#f7f7f7',
    },
    imageContainer: {
        width: "100%",
        height: "100%",
    },
    sourceImgBook: {
        width: 300,
        height: 300,
        resizeMode: "cover",
        alignSelf: "center",
        marginTop: "8%",
        borderRadius: 10,
    },
    titleBook: {
        fontSize: 21,
        fontWeight: "600",
        color: "#343541",
        alignSelf: "center",
        marginBottom: 10,
    },
    titleAuthor: {
        color: "#343541",
        fontSize: 16,
        alignSelf: "center",
        marginBottom: 30,
    },
    textContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1,
        width: "100%"
    },

    highlightedText: {
        color: "#ff3a3a",
        fontWeight: '500',
    },
    highlightedTextBtn: {
        borderRadius: 5,
    },
    readingContent: {
        fontSize: 19,
        color: "#999",
        fontWeight: '500',
    },
    readText: {
        color: "black",
        fontWeight: '500',
    },
    textTouchableDef: {
        // marginBottom: 3,
    },
});
