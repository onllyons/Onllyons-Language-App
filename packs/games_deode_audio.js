import React, {useState, useEffect, useRef} from "react";
import {View, Text, StyleSheet} from "react-native";
import Buttons from "./components/games/Buttons";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import {Loader} from "./components/games/Loader";
import {SubscribeModal} from "./components/SubscribeModal";
import {Header} from "./components/games/Header";
import {TextAnswer} from "./components/games/translate/TextAnswer";
import {CustomSound} from "./components/games/translate/CustomSound";

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
                stats.current.rating = data.question.rating
                blocked.current = data.action === "openModalMembership"
                
                stats.current.time = 0
                stats.current.additionalRating = 0
                setData(data.question);
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
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

    const handleAnswerSelect = (selected, isCorrect) => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        if (isHelpUsed) return

        if (!isAnswerSubmitted) {
            setSelectedAnswer(selected)
            setIsAnswerCorrect(isCorrect);
            setShowIncorrectStyle(!isCorrect); // Setează stilul "incorrect" dacă răspunsul este greșit
            setIsHelpUsed(false);
            setIsAnswerSubmitted(true);

            if (restartCount <= 0) {
                if (isCorrect) {
                    const timePercent = stats.current.time / data.time * 100;
                    let bonusRating = 0

                    if (timePercent <= 33) bonusRating = 3;
                    else if (timePercent <= 66) bonusRating = 2;
                    else if (timePercent <= 100) bonusRating = 1;

                    stats.current.additionalRating = data.rating_add + bonusRating
                    stats.current.rating += data.rating_add + bonusRating
                    stats.current.series++
                } else {
                    const lastRating = stats.current.rating
                    stats.current.rating -= data.rating_minus
                    stats.current.series = 0

                    if (stats.current.rating < 300) stats.current.rating = 300

                    stats.current.additionalRating = -(lastRating - stats.current.rating)
                }
            }

            sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_decode_audio/game.php`,
                {
                    method: "info",
                    answer: selected,
                    id: data.id,
                    timer: stats.current.time,
                    tester: restartCount <= 0 ? 1 : 2,
                    restart: restartCount
                },
                navigation,
                {success: false}
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

            if (restartCount <= 0) {
                const lastRating = stats.current.rating
                stats.current.rating -= data.rating_minus
                stats.current.series = 0

                if (stats.current.rating < 300) stats.current.rating = 300

                stats.current.additionalRating = -(lastRating - stats.current.rating)

                sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_decode_audio/game.php`,
                    {
                        method: "help",
                        id: data.id,
                        timer: stats.current.time
                    },
                    navigation,
                    {success: false}
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

    console.log(data)

    return loading ? (<Loader/>) : (
        <View style={styles.container}>
            <SubscribeModal visible={subscribeModalVisible} setVisible={setSubscribeModalVisible}/>

            <Header
                stats={stats.current}
                timerRun={selectedAnswer === null}
            />

            {data && (
                <View style={styles.buttonGroup} key={data.id}>
                    <View style={styles.buttonGroup}>
                        <Text style={styles.headerText}>
                            {data.text}
                        </Text>

                        <CustomSound name={data.audio}/>

                        <TextAnswer
                            showIncorrectStyle={showIncorrectStyle}
                            selectedAnswer={selectedAnswer}
                            handleAnswerSelect={handleAnswerSelect}
                            answers={data.answers}
                        />
                    </View>
                </View>
            )}

            <Buttons selectedAnswer={selectedAnswer} isAnswerCorrect={isAnswerCorrect} showIncorrectStyle={showIncorrectStyle} isHelpUsed={isHelpUsed} handleHelp={handleHelp} handleRepeat={handleRepeat} handleNext={handleNext}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
