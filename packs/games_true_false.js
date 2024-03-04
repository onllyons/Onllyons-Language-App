import React, {useState, useEffect, useRef} from "react";
import {View, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions} from "react-native";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";
import {Loader} from "./components/games/Loader";
import {SubscribeModal} from "./components/SubscribeModal";
import {calculateAddRating, Header} from "./components/games/Header";
import {AnswerButton} from "./components/games/true-false/AnswerButton";

export default function GamesTrueFalse({navigation}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // Inițial, loader-ul este activat
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [subscribeModalVisible, setSubscribeModalVisible] = useState(false)
    const stats = useRef({
        time: 0,
        series: 0,
        rating: 0,
        additionalRating: 0
    })
    const blocked = useRef(false)

    const checkBlocked = () => {
        if (blocked.current) setSubscribeModalVisible(true)
    }

    const getQuestions = (timeout = 0) => {
        const startDate = Date.now()

        sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_true_false/game.php`,
            {method: "start"},
            navigation,
            {success: false}
        )
            .then(async data => {
                if (timeout > 0 && Date.now() - startDate < timeout) {
                    await new Promise(resolve => setTimeout(resolve, timeout - (Date.now() - startDate)))
                }

                stats.current.rating = data.rating
                blocked.current = data.action === "openModalMembership"

                stats.current.time = 0
                stats.current.additionalRating = 0
                setData(data.question);
                setIsAnswerCorrect(null);
                setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru următoarea întrebare
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
                }, 300);
            })
    }

    useEffect(() => {
        setLoading(true);

        getQuestions()
    }, []);

    const handleAnswerSelect = (answer) => {
        if (blocked.current) {
            checkBlocked()
            return
        }

        if (!isAnswerSubmitted) {
            calculateAddRating(answer === data.correct, stats.current, data)

            setIsAnswerCorrect(answer === data.correct);
            setIsAnswerSubmitted(true);

            const startTime = Date.now()

            sendDefaultRequest(`${SERVER_AJAX_URL}/games/game_true_false/game.php`,
                {
                    method: "info",
                    correct: answer ? 1 : 0,
                    id: data.id,
                    timer: stats.current.time,
                    tester: 1,
                    restart: 0
                },
                navigation,
                {success: false, error: false}
            )
                .then(() => {})
                .catch(() => {})
                .finally(() => {
                    getQuestions(1000 - (Date.now() - startTime))
                })
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Loader visible={loading}/>

                <SubscribeModal visible={subscribeModalVisible} setVisible={setSubscribeModalVisible}/>

                <Header
                    stats={stats.current}
                    timerRun={!isAnswerSubmitted}
                />

                {data && (
                    <AnswerButton
                        text={data.text}
                        isBlocked={blocked.current}
                        checkBlocked={checkBlocked}
                        isAnswerSubmitted={isAnswerSubmitted}
                        isAnswerCorrect={isAnswerCorrect}
                        handleAnswerSelect={handleAnswerSelect}
                    />
                )}
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
