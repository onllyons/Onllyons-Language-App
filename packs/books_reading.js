// Importuri din React și React Native
import React, {useState, useCallback, useEffect, useRef} from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Animated
} from "react-native";

// Importuri pentru navigare
import {useNavigation, useRoute} from "@react-navigation/native";

// Iconițe FontAwesome
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes, faGear} from "@fortawesome/free-solid-svg-icons";

// Importuri pentru gestionarea audio
import {Audio} from "expo-av";

// Import pentru gestionarea gesturilor
import {GestureHandlerRootView} from "react-native-gesture-handler";

// Bottom Sheet
import BottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

// Importuri locale și de utilitare
import globalCss from "./css/globalCss";
import {sendDefaultRequest, SERVER_AJAX_URL, SERVER_URL} from "./utils/Requests";

// Componente personalizate
import {Welcome} from "./components/Welcome";
import {useStore} from "./providers/Store";


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

    const playSound = useCallback(async (startMillis = 0, stop = false) => {
        if (sound) {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

            if (startMillis > 0) {
                await sound.setPositionAsync(startMillis);

                if (!status.isPlaying) {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                if (stop) {
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

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/books/test_book.php`,
            {id: bookId},
            navigation,
            {success: false}
        )
            .then((data) => {
                setFinished(!!data.data.finished);
                setSaved(!!data.data.saved);
                setData(data.data);
                const staticWordsArray = data.data.wordsArray;
                wordsArrayLength.current = data.data.wordsArray.length
                setWordsArray(staticWordsArray);

                Audio.Sound.createAsync(
                    {uri: `${SERVER_URL}/ru/ru-en/packs/assest/books/read-books/audio/${data.data.audio_file}`}
                )
                    .then(async ({sound}) => {
                        await sound.setVolumeAsync(1);
                        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
                        setSound(sound);
                    })
                    .catch(() => {})
            })
            .catch((err) => {
                if (typeof err === "object" && !err.tokensError) {
                    navigation.goBack();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [bookId, navigation]);

    useEffect(() => {
        if (intervalCheckWord.current) {
            clearInterval(intervalCheckWord.current)
            intervalCheckWord.current = null
        }

        if (isPlaying && sound) {
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

    const handleOpenPress = useCallback(() => {
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
        // else {
        //     if (indexFinish !== -1) {
        //         setStoredValue("needToUpdateBooks", true);
        //         info.finished.splice(indexFinish, 1);
        //     }
        // }

        setStoredValue("needToUpdateBooksCategory", true);

        setFinished(!finished);
    }, [finished])

    const playFromWord = useCallback(async (startMillis) => playSound(startMillis), [sound])

    return loading ? (
        <Welcome/>
    ) : (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.closeButton}
                >
                    <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.blue}/>
                </TouchableOpacity>

                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: scrollAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                })
                            }
                        ]}
                    />
                </View>

                <TouchableOpacity style={styles.settingsBtn} onPress={handleOpenPress}>
                    <Text>
                        <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue}/>
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: 30,
                    paddingBottom: 160,
                    paddingHorizontal: 20,
                }}
            >
                <View style={styles.contentBooks}>
                    <View key={data.id} style={styles.contentBooksRead}>
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
                    </View>
                </View>
            </ScrollView>

            <ControlButtons
                playSound={playSound}
                toggleMute={toggleMute}
                isPlaying={isPlaying}
                isMuted={isMuted}
                rewindSound={rewindSound}


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
    const hasTiming = word.start !== 0 || word.duration !== 0;

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
                        isFocused ? styles.highlightedText : (isAfterFocused ? styles.readText : styles.normalText)
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
            style={[
                styles.readingContent,
                styles.normalText, // Stil pentru textul simplu
            ]}
        >
            {word.text + " "}
        </Text>
    );
})

const ControlButtons = React.memo(({
    isPlaying,
    isMuted,
    playSound,
    toggleMute,
    rewindSound
}) => {
    const navigation = useNavigation()
    const {info, data, type} = useRoute().params

    return (
        <View style={styles.audioPlyr}>

            <TouchableOpacity
                style={styles.controlAudioBtn}
                onPress={() => {
                    playSound(0, true)
                    navigation.navigate("BooksCategory", {type: type, info: info, data: data})
                }}
            >
                <Image
                    source={require('./images/other_images/player/list.png')}
                    style={styles.imgPlyrList}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlAudioBtn}
                onPress={() => rewindSound(-10)}
            >
                <Image
                    source={require('./images/other_images/player/back.png')}
                    style={styles.imgPlyrNextBack}
                />
            </TouchableOpacity>

            <View style={styles.controlAudioBtn}>
                <TouchableOpacity onPress={() => playSound()}>
                    <Image
                        source={isPlaying ? require('./images/other_images/player/pause.png') : require('./images/other_images/player/play.png')}
                        style={styles.imgPlyrSettings}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.controlAudioBtn}
                onPress={() => rewindSound(10)}
            >
                <Image
                    source={require('./images/other_images/player/next.png')}
                    style={styles.imgPlyrNextBack}
                />
            </TouchableOpacity>

            <View style={styles.controlAudioBtn}>
                <TouchableOpacity onPress={toggleMute}>
                    <Image
                        source={isMuted ? require('./images/other_images/player/mute.png') : require('./images/other_images/player/volume.png')}
                        style={styles.imgPlyrVolume}
                    />
                </TouchableOpacity>
            </View>

        </View>
    )
})

const BottomSheetComponent = React.memo(({bottomSheetRef, finished, saved, handleFinish, handleBookmark}) => {
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={1}
            />
        ),
        []
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["25%", "50%", "90%"]}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            index={-1}
        >
            <BottomSheetView style={styles.contentBottomSheet}>
                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsIPA}>Пометить как прочитанное</Text>

                    <Switch
                        trackColor={{false: "#d1d1d1", true: "#4ADE80"}}
                        thumbColor={finished ? "#ffffff" : "#f4f3f4"}
                        disabled={finished}
                        ios_backgroundColor="#d1d1d1"
                        onValueChange={handleFinish}
                        value={finished}
                    />
                </View>

                <View style={styles.settingsGroup}>
                    <Text style={styles.settingsIPA}>Добавить в закладки</Text>

                    <Switch
                        trackColor={{false: "#d1d1d1", true: "#4ADE80"}}
                        thumbColor={saved ? "#ffffff" : "#f4f3f4"}
                        ios_backgroundColor="#d1d1d1"
                        onValueChange={handleBookmark}
                        value={saved}
                    />
                </View>
            </BottomSheetView>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        paddingTop: "12%",
    },

    settingsGroup: {
        paddingHorizontal: 20,
        marginBottom: "2%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
    settingsIPA: {
        fontSize: 18,
        fontWeight: "500",
        color: "#343541",
        flex: 1,
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
    imgPlyrSettings: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    imgPlyrNextBack: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    imgPlyrVolume: {
        width: 35,
        height: 35,
        resizeMode: "contain",
    },
    imgPlyrList: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },

    audioPlyr: {
        position: "absolute",
        flexDirection: "row",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        paddingVertical: "8%",
        paddingHorizontal: "8%",
        alignItems: "center",
    },
    contentBottomSheet: {
        height: "100%",
        flex: 1,
    },
    controlAudioBtn: {
        flex: 1,
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    closeButton: {
        minWidth: "14%",
        paddingVertical: "3%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
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

    progressBarContainer: {
        height: 25,
        flex: 1,
        backgroundColor: "#3a464e",
        borderRadius: 10,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#ffeb3b",
        borderRadius: 10,
    },
    settingsBtn: {
        width: "14%",
        paddingVertical: "3%",
        alignItems: "center",
        alignContent: "center",
    },
    textContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1,
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
    },
    readText: {
        color: "black",
        fontWeight: '500',
    },


    textTouchableDef: {
        marginBottom: 3,
    },
});
