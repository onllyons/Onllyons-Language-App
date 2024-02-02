import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import globalCss from "../../css/globalCss";
import React, {useEffect, useState} from "react";

const SelectAnswer = ({data, isHelpUsed, isAnswerCorrect, preHelpAnswers, selectedAnswer, handleAnswerSelect}) => {
    const [isPressedAnswer, setIsPressedAnswer] = useState([]);

    useEffect(() => {
        const initialPressedAnswerState = Array(
            data[0].answers.length
        ).fill(false);

        setIsPressedAnswer(initialPressedAnswerState);
    }, [])

    const handlePressIn = (answerIndex) => {
        if (selectedAnswer || preHelpAnswers.indexOf(answerIndex) !== -1) return

        const newIsPressedAnswer = [...isPressedAnswer];
        newIsPressedAnswer[answerIndex] = true;
        setIsPressedAnswer(newIsPressedAnswer);
    };


    const handlePressOut = (answerIndex) => {
        const newIsPressedAnswer = [...isPressedAnswer];
        newIsPressedAnswer[answerIndex] = false;
        setIsPressedAnswer(newIsPressedAnswer);
    };

    return (
        <View style={styles.buttonGroup} key={data[0].id}>
            <View
                style={styles.buttonGroup}
                key={data[0].id}
            >
                <Text style={styles.headerText}>
                    {data[0].text}
                </Text>
                {data[0].answers.map((answer) => (
                    <TouchableOpacity
                        key={answer.id}
                        style={[
                            globalCss.button,
                            isPressedAnswer[answer.id]
                                ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                                : globalCss.buttonGry,

                            selectedAnswer === answer.id &&
                            (isAnswerCorrect ? styles.correct : globalCss.incorrect),
                            // Verifică dacă butonul help a fost apăsat și răspunsul este corect
                            isHelpUsed && answer.correct && globalCss.correct,
                            preHelpAnswers.indexOf(answer.id) !== -1 ? styles.hint : ""
                        ]}
                        onPressIn={() => handlePressIn(answer.id)}
                        onPressOut={() => handlePressOut(answer.id)}
                        onPress={() =>
                            handleAnswerSelect(answer.id, data[0])
                        }
                        activeOpacity={1}
                    >
                        <Text style={[
                            styles.buttonTextBlack,
                            selectedAnswer === answer.id && isAnswerCorrect ? styles.correctTxt :
                                selectedAnswer === answer.id ? globalCss.incorrectTxt : null,
                            isHelpUsed && answer.correct ? globalCss.correctTxt : null // Adăugați condiția pentru starea "Help" și corectitudinea răspunsului
                        ]}>
                            {answer.text}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default SelectAnswer

const styles = StyleSheet.create({
    buttonGroup: {
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: "6%",
        flex: 1,
    },
    hint: {
        backgroundColor: "#373737",
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
        margin: 10
    },
    buttonTextBlack: {
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 18,
        color: "#8895bc",
    },
});