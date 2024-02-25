import {StyleSheet, Text, View} from "react-native";
import globalCss from "../../css/globalCss";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowRightLong, faLightbulb, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import React, {useRef} from "react";

export const Buttons = ({
    selectedAnswer,
    isAnswerCorrect,
    isHelpUsed,
    showIncorrectStyle,
    handleHelp,
    handleNext,
    handleRepeat
}) => {
    const visibleNextOrReload = !!(selectedAnswer || isHelpUsed)
    const visibleHelp = !!((!selectedAnswer || (selectedAnswer && !isAnswerCorrect)) && !isHelpUsed)

    const first = useRef(true)

    setTimeout(() => first.current = false, 1)

    return (
        <View style={styles.groupBtnQuiz}>
            {visibleNextOrReload && (
                <AnimatedButtonShadow
                    key={visibleHelp ? 0 : 1}
                    styleContainer={styles.quizBtnCtrContainer}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGry,
                        showIncorrectStyle && globalCss.incorrect // Aplică stilul "incorrect" dacă este necesar
                    ]}
                    shadowColor={showIncorrectStyle ? "red" : "gray"}
                    onPress={handleRepeat}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faRotateLeft}
                            size={18}
                            style={showIncorrectStyle ? globalCss.correctTxt : globalCss.blueLight}
                        />
                    </Text>
                </AnimatedButtonShadow>
            )}


            {visibleHelp && (
                <AnimatedButtonShadow
                    key={visibleNextOrReload ? 2 : 3}
                    styleContainer={styles.quizBtnCtrContainer}
                    shadowDisplayAnimate={first.current ? "slide" : "none"}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGry,
                    ]}
                    shadowColor={"gray"}
                    onPress={handleHelp}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faLightbulb}
                            size={18}
                            style={globalCss.blueLight}
                        />
                    </Text>
                </AnimatedButtonShadow>
            )}

            {visibleNextOrReload && (
                <AnimatedButtonShadow
                    key={visibleHelp ? 4 : 5}
                    styleContainer={styles.quizBtnCtrContainer}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGry,
                        (isAnswerCorrect || isHelpUsed) && globalCss.correct,
                    ]}
                    shadowColor={isAnswerCorrect || isHelpUsed ? "green" : "gray"}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faArrowRightLong}
                            size={18}
                            style={(isAnswerCorrect || isHelpUsed) ? globalCss.correctTxt : globalCss.blueLight}
                        />
                    </Text>
                </AnimatedButtonShadow>
            )}
        </View>
    )
}

export const ButtonsForInput = ({
    selectedAnswer,
    isAnswerCorrect,
    isHelpUsed,
    showIncorrectStyle,
    handleAnswerSelect,
    handleHelp,
    handleNext,
    handleRepeat
}) => {
    const visibleNextOrReload = !!(selectedAnswer || isHelpUsed)
    const visibleHelp = !!((!selectedAnswer || (selectedAnswer && !isAnswerCorrect)) && !isHelpUsed)

    const first = useRef(true)

    setTimeout(() => first.current = false, 1)

    return (
        <View style={styles.groupBtnQuiz}>
            {visibleNextOrReload && (
                <AnimatedButtonShadow
                    key={visibleHelp ? 0 : 1}
                    styleContainer={styles.quizBtnCtrContainer}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGry,
                        showIncorrectStyle && globalCss.incorrect // Aplică stilul "incorrect" dacă este necesar
                    ]}
                    shadowColor={showIncorrectStyle ? "red" : "gray"}
                    onPress={handleRepeat}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faRotateLeft}
                            size={18}
                            style={showIncorrectStyle ? globalCss.correctTxt : globalCss.blueLight}
                        />
                    </Text>
                </AnimatedButtonShadow>
            )}

            {visibleHelp && (
                <AnimatedButtonShadow
                    key={visibleNextOrReload ? 2 : 3}
                    styleContainer={styles.quizBtnCtrContainer}
                    shadowDisplayAnimate={first.current ? "slide" : "none"}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGry,
                    ]}
                    shadowColor={"gray"}
                    onPress={handleHelp}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faLightbulb}
                            size={18}
                            style={globalCss.blueLight}
                        />
                    </Text>
                </AnimatedButtonShadow>
            )}

            {visibleHelp && !visibleNextOrReload && (
                <AnimatedButtonShadow
                    styleContainer={styles.quizBtnCtrContainer}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGreen,
                    ]}
                    shadowColor={"green"}
                    onPress={handleAnswerSelect}
                >
                    <Text style={globalCss.buttonText}>Проверить</Text>
                </AnimatedButtonShadow>
            )}

            {visibleNextOrReload && (
                <AnimatedButtonShadow
                    key={visibleHelp ? 4 : 5}
                    styleContainer={styles.quizBtnCtrContainer}
                    styleButton={[
                        styles.quizBtnCtr,
                        globalCss.buttonGry,
                        (isAnswerCorrect || isHelpUsed) && globalCss.correct,
                    ]}
                    shadowColor={isAnswerCorrect || isHelpUsed ? "green" : "gray"}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faArrowRightLong}
                            size={18}
                            style={(isAnswerCorrect || isHelpUsed) ? globalCss.correctTxt : globalCss.blueLight}
                        />
                    </Text>
                </AnimatedButtonShadow>
            )}
        </View>
    )
}

export const isTextAnswerCorrect = (answers, text) => {
    if (text === answers[0]) return true

    let answer = text.replace(/ё/g, "е");
    answer = answer.replace(/["!?.,]/g, "");
    answer = answer.trim().toLowerCase().replace(/\s+/g, " ");

    let correct = false;

    for (let item of answers) {
        let answerToCheck = item.replace(/ё/g, "е");
        answerToCheck = answerToCheck.replace(/["!?.,]/g, "");
        answerToCheck = answerToCheck.trim().toLowerCase().replace(/\s+/g, " ");

        if (!answerToCheck) continue

        if (answer === answerToCheck) {
            correct = true;
            break;
        }
    }

    return correct
}

const styles = StyleSheet.create({
    groupBtnQuiz: {
        maxWidth: "80%",
        marginBottom: "13%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignContent: "center",
    },
    quizBtnCtr: {
        paddingTop: 20,
        paddingBottom: 15,
        //paddingVertical: 18,
        alignItems: "center",
        borderRadius: 14
    },
    quizBtnCtrContainer: {
        flex: 1,
        marginHorizontal: "1%",
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
});