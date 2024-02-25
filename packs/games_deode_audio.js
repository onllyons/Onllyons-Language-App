import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Dimensions
} from "react-native";
import {ButtonsForInput, isTextAnswerCorrect} from "./components/games/Buttons";
import {sendDefaultRequest, SERVER_AJAX_URL, SERVER_URL} from "./utils/Requests";
import {Loader} from "./components/games/Loader";
import {SubscribeModal} from "./components/SubscribeModal";
import {calculateAddRating, Header} from "./components/games/Header";
import {TextAnswer} from "./components/games/translate/TextAnswer";
import {CustomSound} from "./components/games/translate/CustomSound";
import Toast from "react-native-toast-message";

export default function GamesDecodeAudio({navigation}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // Inițial, loader-ul este activat
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isHelpUsed, setIsHelpUsed] = useState(false);
    const [showIncorrectStyle, setShowIncorrectStyle] = useState(false);
    const [subscribeModalVisible, setSubscribeModalVisible] = useState(false)
    const stats = useRef({
        time: 0,
        series: 0,
        rating: 0,
        additionalRating: 0
    })
    const blocked = useRef(false)
    const textRef = useRef("")

    const [restartCount, setRestartCount] = useState(0)

    const checkBlocked = () => {
        if (blocked.current) setSubscribeModalVisible(true)
    }

    const getQuestions = () => {
        sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_decode_audio/game.php`,
            {method: "start"},
            navigation,
            {success: false}
        )
            .then(data => {
                stats.current.rating = data.rating
                blocked.current = data.action === "openModalMembership"
                
                stats.current.time = 0
                stats.current.additionalRating = 0
                setData(data.question);
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
                setShowIncorrectStyle(false)
                setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru următoarea întrebare
                setIsHelpUsed(false);
                setRestartCount(0)
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
    }

    useEffect(() => {
        setLoading(true);

        getQuestions()
    }, []);

    const handleAnswerSelect = () => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        if (isHelpUsed) return

        if (!isAnswerSubmitted) {
            Keyboard.dismiss()

            if (!textRef.current) {
                Toast.show({
                    type: "error",
                    text1: "Заполните поле"
                });

                return
            }

            const isCorrect = isTextAnswerCorrect(data.answers, textRef.current)

            setSelectedAnswer(textRef.current)
            setIsAnswerCorrect(isCorrect);
            setShowIncorrectStyle(!isCorrect); // Setează stilul "incorrect" dacă răspunsul este greșit
            setIsHelpUsed(false);
            setIsAnswerSubmitted(true);

            if (restartCount <= 0 && !isHelpUsed) calculateAddRating(isCorrect, stats.current, data)

            sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_decode_audio/game.php`,
                {
                    method: "info",
                    answer: textRef.current,
                    correct: isCorrect,
                    id: data.id,
                    timer: stats.current.time,
                    tester: restartCount <= 0 ? 1 : 2,
                    restart: restartCount
                },
                navigation,
                {success: false, error: false}
            )
                .then(() => {})
                .catch(() => {})
        }
    };

    const handleHelp = () => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        if (!isHelpUsed) {
            setSelectedAnswer(data.answers[0])
            setIsHelpUsed(true);
            setShowIncorrectStyle(false); // Resetează stilul "incorrect"

            if (restartCount <= 0 && selectedAnswer === null) {
                calculateAddRating(false, stats.current, data)

                sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_decode_audio/game.php`,
                    {
                        method: "help",
                        id: data.id,
                        timer: stats.current.time
                    },
                    navigation,
                    {success: false, error: false}
                )
                    .then(() => {})
                    .catch(() => {})
            }
        }
    };

    const handleNext = () => {
        getQuestions()
    };

    const handleRepeat = () => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru a permite repetarea întrebării
        setIsHelpUsed(false);
        setRestartCount(restartCount + 1)
        stats.current.time = 0
    };

    return loading ? (<Loader/>) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <SubscribeModal visible={subscribeModalVisible} setVisible={setSubscribeModalVisible}/>

                <Header
                    stats={stats.current}
                    timerRun={selectedAnswer === null}
                />

                {data && (
                    <KeyboardAvoidingView
                        behavior={"padding"}
                        style={{ flex: 1, width: "100%" }}
                    >
                        <View style={styles.buttonGroup}>
                            <View style={styles.buttonGroup}>
                                <View>
                                    <Text style={styles.headerText}>
                                        {data.text}
                                    </Text>
                                </View>

                                <CustomSound uri={`${SERVER_URL}/ru/ru-en/packs/assest/audio-general/${data.audio}`}/>

                                <TextAnswer
                                    isAnswerSubmitted={isAnswerSubmitted}
                                    selectedAnswer={selectedAnswer}
                                    handleAnswerSelect={handleAnswerSelect}
                                    textRef={textRef}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                )}

                <ButtonsForInput
                    selectedAnswer={selectedAnswer}
                    isAnswerCorrect={isAnswerCorrect}
                    showIncorrectStyle={showIncorrectStyle}
                    isHelpUsed={isHelpUsed}
                    handleHelp={handleHelp}
                    handleRepeat={handleRepeat}
                    handleNext={handleNext}
                    handleAnswerSelect={handleAnswerSelect}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get("screen").height,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    buttonGroup: {
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: "6%",
        flex: 1,
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
        margin: 15
    },
});
