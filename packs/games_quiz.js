import React, {useState, useEffect, useRef} from "react";
import {View, Text, StyleSheet} from "react-native";
import Answer from "./components/games/quiz/Answer";
import {Buttons} from "./components/games/Buttons";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import {Loader} from "./components/games/Loader";
import {SubscribeModal} from "./components/SubscribeModal";
import {calculateAddRating, Header} from "./components/games/Header";

export default function GameQuiz({navigation}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Inițial, loader-ul este activat
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isHelpUsed, setIsHelpUsed] = useState(false);
    const [showIncorrectStyle, setShowIncorrectStyle] = useState(false);
    const [preHelpAnswers, setPreHelpAnswers] = useState([])
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
        sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_default/game.php`,
            {
                method: "start",
                excludedIds: data.map(obj => obj.id)
            },
            navigation,
            {success: false}
        )
            .then(data => {
                stats.current.rating = data.rating
                blocked.current = data.action === "openModalMembership"

                const shuffledData = data.votes.map((item) => ({
                    ...item,
                    answers: shuffleAnswers(item),
                }));
                stats.current.time = 0
                stats.current.additionalRating = 0
                setData(shuffledData);
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
                setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru următoarea întrebare
                setIsHelpUsed(false);
                setPreHelpAnswers([])
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

    const shuffleAnswers = (item) => {
        const correct = Number(item.test.correct)

        let initialAnswers = [
            {text: item.test["1"], correct: correct === 1, id: 1},
            {text: item.test["2"], correct: correct === 2, id: 2},
            {text: item.test["3"], correct: correct === 3, id: 3},
            {text: item.test["4"], correct: correct === 4, id: 4},
        ];

        // Amestecă răspunsurile inițiale
        for (let i = initialAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialAnswers[i], initialAnswers[j]] = [initialAnswers[j], initialAnswers[i]];
        }

        return initialAnswers;
    };

    const handleAnswerSelect = (selected) => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        if (preHelpAnswers.indexOf(selected) !== -1 || isHelpUsed) return

        if (!isAnswerSubmitted) {
            const correctAnswer = data[0].answers.find((answer) => answer.correct).id;
            setSelectedAnswer(selected);
            const isCorrect = selected === correctAnswer;
            setIsAnswerCorrect(isCorrect);
            setShowIncorrectStyle(!isCorrect); // Setează stilul "incorrect" dacă răspunsul este greșit
            setIsHelpUsed(false);
            setIsAnswerSubmitted(true);

            if (restartCount <= 0 && preHelpAnswers.length <= 0 && !isHelpUsed) calculateAddRating(isCorrect, stats.current, data[0])

            sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_default/game.php`,
                {
                    method: "info",
                    answer: selected,
                    id: data[0].id,
                    timer: stats.current.time,
                    tester: restartCount <= 0 && preHelpAnswers.length <= 0 ? 1 : 2,
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

        if (preHelpAnswers.length > 0) {
            setIsHelpUsed(true);
            setShowIncorrectStyle(false); // Resetează stilul "incorrect"
        } else {
            for (let i = 0; i < data[0].answers.length; i++) {
                if (preHelpAnswers.length >= 2) break
                if (data[0].answers[i].id === selectedAnswer) continue

                if (!data[0].answers[i].correct) preHelpAnswers.push(data[0].answers[i].id)
            }

            setPreHelpAnswers(prev => [...prev, preHelpAnswers])

            if (restartCount <= 0 && selectedAnswer === null) {
                calculateAddRating(false, stats.current, data[0])

                sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_default/game.php`,
                    {
                        method: "help",
                        id: data[0].id,
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
        setPreHelpAnswers([])
        setRestartCount(restartCount + 1)
        stats.current.time = 0
    };

    return loading ? (<Loader/>) : (
        <View style={styles.container}>
            <SubscribeModal visible={subscribeModalVisible} setVisible={setSubscribeModalVisible}/>

            <Header
                stats={stats.current}
                timerRun={selectedAnswer === null && preHelpAnswers.length === 0}
            />

            {data.length > 0 && (
                <View style={styles.buttonGroup}>
                    <View style={styles.buttonGroup}>
                        <Text style={styles.headerText}>
                            {data[0].text}
                        </Text>

                        {data[0].answers.map((answer, index) => (
                            <Answer
                                key={index}
                                answer={answer}
                                isHelpUsed={isHelpUsed}
                                isAnswerCorrect={isAnswerCorrect}
                                preHelpAnswers={preHelpAnswers}
                                selectedAnswer={selectedAnswer}
                                handleAnswerSelect={handleAnswerSelect}
                            />
                        ))}
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
