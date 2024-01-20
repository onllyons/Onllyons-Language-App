import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {DotIndicator} from "react-native-indicators"; // Importați DotIndicator sau alt tip de indicator dorit
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faTrophy,
    faClock,
    faArrowLeft,
    faFire
} from "@fortawesome/free-solid-svg-icons";

import globalCss from "./css/globalCss";
import SelectAnswer from "./components/games/SelectAnswer";
import Buttons from "./components/games/Buttons";
import axios from "axios";
import Toast from "react-native-toast-message";
import {useAuth} from "./providers/AuthProvider";

export default function GameQuiz({navigation}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Inițial, loader-ul este activat
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isHelpUsed, setIsHelpUsed] = useState(false);
    const [showIncorrectStyle, setShowIncorrectStyle] = useState(false);
    const [preHelpAnswers, setPreHelpAnswers] = useState([])
    const [time, setTime] = useState(0)

    const [restartCount, setRestartCount] = useState(0)

    const {checkServerResponse, getTokens} = useAuth()

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };

    const TimerComponent = ({time, setTime}) => {
        useEffect(() => {
            const id = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000);

            return () => clearInterval(id)
        }, [])

        return (
            <View style={[styles.itemNavTop, styles.itemClock]}>
                <FontAwesomeIcon icon={faClock} size={26} style={styles.faTrophy}/>
                <Text style={[styles.itemTxtNavTop, styles.itemClockTxt]}>{formatTime(time)}</Text>
            </View>
        )
    }

    const getQuestions = () => {
        axios.post("https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/games/game_default/game.php", {
            method: "start",
            tokens: getTokens()
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(({data}) => checkServerResponse(data, navigation, false))
            .then(data => {
                const shuffledData = data.votes.map((item) => ({
                    ...item,
                    answers: shuffleAnswers(item),
                }));
                setData(prev => [...prev, ...shuffledData]);

                setTimeout(() => {
                    setLoading(false);
                }, 0);
            })
            .catch(() => {
                // Toast.show({
                //     type: "error",
                //     text1: "Произошла ошибка, попробуйте позже"
                // })
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
        if (preHelpAnswers.indexOf(selected) !== -1 || isHelpUsed) return

        if (!isAnswerSubmitted) {
            const correctAnswer = item.answers.find((answer) => answer.correct).id;
            setSelectedAnswer(selected);
            const isCorrect = selected === correctAnswer;
            setIsAnswerCorrect(isCorrect);
            setShowIncorrectStyle(!isCorrect); // Setează stilul "incorrect" dacă răspunsul este greșit
            setIsHelpUsed(false);
            setIsAnswerSubmitted(true);

            axios.post("https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/games/game_default/game.php", {
                method: "info",
                tokens: getTokens(),
                answer: selected,
                id: data[0].id,
                timer: time,
                tester: restartCount <= 0 && preHelpAnswers.length <= 0 ? 1 : 2,
                restart: restartCount
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
        }
    };

    const handleHelp = () => {
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
                axios.post("https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/games/game_default/game.php", {
                    method: "help",
                    tokens: getTokens(),
                    id: data[0].id,
                    timer: time
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
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

        data.splice(0, 1)

        setData(data)

        if (data.length <= 0) {
            setLoading(true)
        } else if (data.length <= 2) {
            getQuestions()
        }
    };

    const handleRepeat = () => {
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru a permite repetarea întrebării
        setIsHelpUsed(false);
        setPreHelpAnswers([])
        setRestartCount(restartCount + 1)

        for (let i = data[0].answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[0].answers[i], data[0].answers[j]] = [data[0].answers[j], data[0].answers[i]];
        }

        setData(data);
    };

    if (loading) {
        // Dacă datele sunt în proces de încărcare, afișați pagina cu fundal galben și textul corespunzător
        return (
            <LinearGradient
                colors={["#8f69cc", "#8f69cc"]}
                style={styles.startContent}
            >
                <Image
                    source={require("./images/other_images/quiz-logo.png")}
                    style={styles.logoQuiz}
                />
                <Text style={styles.textContainerMess}>Quiz Time</Text>

                <View style={styles.loaderContainer}>
                    <DotIndicator color="white" size={30} count={3}/>
                </View>
            </LinearGradient>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.sectionTop}>

                <TouchableOpacity onPress={() => navigation.navigate('GamesScreen')}
                                  style={[styles.itemNavTop, styles.itemNavBtnBack]}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>

                <View style={[styles.itemNavTop, styles.itemRatingGen]}>
                    <FontAwesomeIcon icon={faTrophy} size={26} style={styles.faTrophy}/>
                    <Text style={styles.itemTxtNavTop}>1124</Text>
                    <Text style={[styles.itemTxtNavTop, styles.itemBonus]}>0</Text>
                </View>

                <View style={[styles.itemNavTop, styles.itemConsecutive]}>
                    <FontAwesomeIcon icon={faFire} size={26} style={styles.faTrophy}/>
                    <Text style={[styles.itemTxtNavTop, styles.answerCons]}>14</Text>
                </View>

                <TimerComponent time={time} setTime={setTime}/>

            </View>
            {data.length > 0 && (
                <SelectAnswer data={data} isHelpUsed={isHelpUsed} isAnswerCorrect={isAnswerCorrect} preHelpAnswers={preHelpAnswers} selectedAnswer={selectedAnswer} handleAnswerSelect={handleAnswerSelect}/>
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
    startContent: {
        flex: 1,
        justifyContent: "center",
    },
    loaderContainer: {
        position: "absolute",
        bottom: "5%",
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainerMess: {
        fontSize: 24,
        textAlign: "center",
        color: "#E4D3FF",
    },
    logoQuiz: {
        width: 140,
        height: 140,
        alignSelf: "center",
        marginBottom: "2.9%",
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

    itemBonus: {
        // color: '#ca3431',
        color: '#81b344',
        fontWeight: '700'
    },
    answerCons: {
        marginLeft: 5,
    }
});
