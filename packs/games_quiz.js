import React, {useState, useEffect, useRef} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faTrophy,
    faClock,
    faArrowLeft,
    faFire
} from "@fortawesome/free-solid-svg-icons";

import globalCss from "./css/globalCss";
import Answers from "./components/games/Answers";
import Buttons from "./components/games/Buttons";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import {Loader} from "./components/games/Loader";
import {SubscribeModal} from "./components/SubscribeModal";

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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };

    const TimerComponent = () => {
        const [timer, setTimer] = useState(stats.current.time)

        useEffect(() => {
            const id = setInterval(() => {
                if (selectedAnswer !== null || preHelpAnswers.length > 0) {
                    clearInterval(id)
                    return
                }

                setTimer(prev => prev += 1)
                stats.current.time += 1
            }, 1000);

            return () => clearInterval(id)
        }, [])

        return (
            <View style={[styles.itemNavTop, styles.itemClock]}>
                <FontAwesomeIcon icon={faClock} size={26} style={styles.faTrophy}/>
                <Text style={[styles.itemTxtNavTop, styles.itemClockTxt]}>{formatTime(timer)}</Text>
            </View>
        )
    }

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
                setData(shuffledData);
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

    const handleAnswerSelect = (selected, item) => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        if (preHelpAnswers.indexOf(selected) !== -1 || isHelpUsed) return

        if (!isAnswerSubmitted) {
            const correctAnswer = item.answers.find((answer) => answer.correct).id;
            setSelectedAnswer(selected);
            const isCorrect = selected === correctAnswer;
            setIsAnswerCorrect(isCorrect);
            setShowIncorrectStyle(!isCorrect); // Setează stilul "incorrect" dacă răspunsul este greșit
            setIsHelpUsed(false);
            setIsAnswerSubmitted(true);

            if (restartCount <= 0 && preHelpAnswers.length <= 0 && !isHelpUsed) {
                if (isCorrect) {
                    const timePercent = stats.current.time / data[0].time * 100;
                    let bonusRating = 0

                    if (timePercent <= 33) bonusRating = 3;
                    else if (timePercent <= 66) bonusRating = 2;
                    else if (timePercent <= 100) bonusRating = 1;

                    stats.current.additionalRating = data[0].rating_add + bonusRating
                    stats.current.rating += data[0].rating_add + bonusRating
                    stats.current.series++
                } else {
                    const lastRating = stats.current.rating
                    stats.current.rating -= data[0].rating_minus
                    stats.current.series = 0

                    if (stats.current.rating < 300) stats.current.rating = 300

                    stats.current.additionalRating = -(lastRating - stats.current.rating)
                }
            }

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
                {success: false}
            )
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

            if (restartCount <= 0) {
                const lastRating = stats.current.rating
                stats.current.rating -= data[0].rating_minus
                stats.current.series = 0

                if (stats.current.rating < 300) stats.current.rating = 300

                stats.current.additionalRating = -(lastRating - stats.current.rating)

                sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_default/game.php`,
                    {
                        method: "help",
                        id: data[0].id,
                        timer: stats.current.time
                    },
                    navigation,
                    {success: false}
                )
            }
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru următoarea întrebare
        setIsHelpUsed(false);
        setPreHelpAnswers([])
        setRestartCount(0)
        stats.current.time = 0
        stats.current.additionalRating = 0

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

    if (loading) {
        // Dacă datele sunt în proces de încărcare, afișați pagina cu fundal galben și textul corespunzător
        return (<Loader/>);
    }

    return (
        <View style={styles.container}>
            <SubscribeModal visible={subscribeModalVisible} setVisible={setSubscribeModalVisible}/>
            <View style={styles.sectionTop}>

                <TouchableOpacity onPress={() => navigation.navigate('GamesScreen')}
                                  style={[styles.itemNavTop, styles.itemNavBtnBack]}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>

                <View style={[styles.itemNavTop, styles.itemRatingGen]}>
                    <FontAwesomeIcon icon={faTrophy} size={26} style={styles.faTrophy}/>
                    <Text style={styles.itemTxtNavTop}>{stats.current.rating}</Text>
                    {stats.current.additionalRating !== 0 &&
                        <Text style={[
                            styles.itemTxtNavTop,
                            stats.current.additionalRating > 0 ? styles.ratingPlus : styles.ratingMinus
                        ]}>{stats.current.additionalRating > 0 ? "+" : ""}{stats.current.additionalRating}</Text>
                    }
                </View>

                <View style={[styles.itemNavTop, styles.itemConsecutive]}>
                    <FontAwesomeIcon icon={faFire} size={26} style={styles.faTrophy}/>
                    <Text style={[styles.itemTxtNavTop, styles.answerCons]}>{stats.current.series}</Text>
                </View>

                <TimerComponent/>

            </View>
            {data.length > 0 && (
                <Answers data={data} isHelpUsed={isHelpUsed} isAnswerCorrect={isAnswerCorrect} preHelpAnswers={preHelpAnswers} selectedAnswer={selectedAnswer} handleAnswerSelect={handleAnswerSelect}/>
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
    sectionTop: {
        width: "100%",
        paddingTop: "10%",
        backgroundColor: "#eeeff0",
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
    },
    itemNavTop: {
        flexDirection: "row",
        paddingTop: '5%',
        paddingBottom: '5%',
        alignItems: "center",
        flex: 1
    },
    faTrophy: {
        color: '#5e5e5e',
    },

    itemTxtNavTop: {
        fontSize: 19,
        color: '#5e5e5e',
        fontWeight: '500',
        marginLeft: '3%',
    },

    itemNavBtnBack: {
        paddingLeft: '5%',
        maxWidth: '16%',
    },
    itemRatingGen: {
        maxWidth: '39%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemConsecutive: {
        maxWidth: '22%',
        paddingLeft: '1%'
    },
    itemClock: {
        maxWidth: '23%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemClockTxt: {
        minWidth: '15%',
    },

    ratingPlus: {
        color: '#81b344',
        fontWeight: '700'
    },
    ratingMinus: {
        color: '#ca3431',
        fontWeight: '700'
    },
    answerCons: {
        marginLeft: 5,
    }
});
