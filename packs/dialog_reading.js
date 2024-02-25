// Importuri din React și React Native
import React, {useState, useCallback, useEffect, useRef} from "react";
import {
    Text,
    ScrollView,
    StyleSheet,
    Animated, SafeAreaView
} from "react-native";

// Importuri pentru navigare
import {useRoute} from "@react-navigation/native";

// Importuri pentru gestionarea audio
import {Audio} from "expo-av";

// Import pentru gestionarea gesturilor
import {GestureHandlerRootView} from "react-native-gesture-handler";

// Importuri locale și de utilitare
import {sendDefaultRequest, SERVER_AJAX_URL, SERVER_URL} from "./utils/Requests";

// Componente personalizate
import {useStore} from "./providers/Store";
import {BottomSheetComponent} from "./components/books/reading/BottomSheetComponent";
import {ControlButtons} from "./components/books/reading/ControlButtons";
import {Header} from "./components/books/reading/Header";
import Loader from "./components/Loader";

export default function DialogReading({navigation}) {
    const {setStoredValue} = useStore();
    const route = useRoute();
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [saved, setSaved] = useState(false);
    const bottomSheetRef = useRef(null);
    const [data, setData] = useState({});
    const {id, item, info} = route.params;
    const scrollAnim = useRef(new Animated.Value(0)).current;

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
                setIsPlaying(false)
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

    const playSound = useCallback(async (options = {}) => {
        options = {stop: false, ...options}

        if (sound) {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

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
                } else {
                    await sound.playAsync();
                }

                setIsPlaying(true);
            }
        }
    }, [sound])

    const handleOpenBottomSheetPress = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const handleBookmark = useCallback(() => {
        sendDefaultRequest(
            `${SERVER_AJAX_URL}/dialogues/create_bookmark.php`,
            {id: id},
            navigation,
            {success: false}
        )
            .then(() => {
            })
            .catch(() => {
            });

        if (item) item.saved = !saved;

        const indexSaved = info.saved.indexOf(id);

        if (!saved) {
            if (indexSaved === -1) {
                setStoredValue("needToUpdateBooks", true);
                info.saved.push(id);
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
            `${SERVER_AJAX_URL}/dialogues/finish_dialog.php`,
            {id: id},
            navigation,
            {success: false}
        )
            .then(() => {
            })
            .catch(() => {
            });

        if (item) item.finished = !finished;

        const indexFinish = info.finished.indexOf(id);

        if (!finished) {
            if (indexFinish === -1) {
                setStoredValue("needToUpdateBooks", true);
                info.finished.push(id);
            }
        }

        setStoredValue("needToUpdateBooksCategory", true);

        setFinished(!finished);
    }, [finished])

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
            `${SERVER_AJAX_URL}/dialogues/get_dialog.php`,
            {id: id},
            navigation,
            {success: false}
        )
            .then((data) => {
                setFinished(!!data.data.finished);
                setSaved(!!data.data.saved);
                setData(data.data);

                Audio.Sound.createAsync(
                    {uri: `${SERVER_URL}/ru/ru-en/packs/assest/books/read-dialog/audio/${data.data.audio_file}`}
                )
                    .then(async ({sound}) => {
                        await sound.setVolumeAsync(1);
                        sound.setOnPlaybackStatusUpdate(status => {
                            if (status.didJustFinish) {
                                setIsPlaying(false)
                            }
                        })
                        setSound(sound);
                    })
                    .catch(() => {})
                    .finally(() => setLoading(false))
            })
            .catch((err) => {
                setLoading(false)

                if (typeof err === "object" && !err.tokensError) {
                    navigation.goBack();
                }
            })
    }, [id, navigation]);

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
                        paddingHorizontal: 20,
                    }}
                >
                    <Text style={styles.titleBook}>{data.title}</Text>

                    {data.content && data.content.length !== 0 ? data.content.map((item, index) => (
                        <Text key={`word-${index}`} style={[styles.readingContent, index > 0 && {marginTop: 5}]}>
                            {item}
                        </Text>
                    )) : null}
                </ScrollView>
            </SafeAreaView>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        paddingTop: "12%",
        backgroundColor: '#f7f7f7',
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
    readingContent: {
        fontSize: 19,
        color: "#999",
        fontWeight: '500',
    },
});
