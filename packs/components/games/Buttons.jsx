import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import globalCss from "../../css/globalCss";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowRightLong, faLightbulb, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";

const Buttons = ({selectedAnswer, isAnswerCorrect, isHelpUsed, showIncorrectStyle, handleHelp, handleNext, handleRepeat}) => {
    const [isPressedRepeatBtn, setIsPressedRepeatBtn] = useState(false);
    const [isPressedHelpBtn, setIsPressedHelpBtn] = useState(false);
    const [isPressedNextBtn, setIsPressedNextBtn] = useState(false);

    return (
        <View style={styles.groupBtnQuiz}>
            {(selectedAnswer || isHelpUsed) && (
                <TouchableOpacity
                    style={[
                        styles.quizBtnCtr,
                        isPressedRepeatBtn
                            ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                            : globalCss.buttonGry,
                        showIncorrectStyle && styles.incorrect // Aplică stilul "incorrect" dacă este necesar
                    ]}
                    onPressIn={() => setIsPressedRepeatBtn(true)}
                    onPressOut={() => setIsPressedRepeatBtn(false)}
                    activeOpacity={1}
                    onPress={handleRepeat}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faRotateLeft}
                            size={18}
                            style={showIncorrectStyle ? styles.correctTxt : globalCss.blueLight}
                        />
                    </Text>
                </TouchableOpacity>
            )}


            {(!selectedAnswer || (selectedAnswer && !isAnswerCorrect)) &&
            !isHelpUsed && (
                <TouchableOpacity
                    style={[
                        styles.quizBtnCtr,
                        isPressedHelpBtn
                            ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                            : globalCss.buttonGry,
                    ]}
                    onPressIn={() => setIsPressedHelpBtn(true)}
                    onPressOut={() => setIsPressedHelpBtn(false)}
                    activeOpacity={1}
                    onPress={handleHelp}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faLightbulb}
                            size={18}
                            style={globalCss.blueLight}
                        />
                    </Text>
                </TouchableOpacity>
            )}

            {(selectedAnswer || isHelpUsed) && (
                <TouchableOpacity
                    style={[
                        styles.quizBtnCtr,
                        isPressedNextBtn
                            ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                            : globalCss.buttonGry,
                        (isAnswerCorrect || isHelpUsed) && styles.correct,
                    ]}
                    onPressIn={() => setIsPressedNextBtn(true)}
                    onPressOut={() => setIsPressedNextBtn(false)}
                    activeOpacity={1}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        <FontAwesomeIcon
                            icon={faArrowRightLong}
                            size={18}
                            style={(isAnswerCorrect || isHelpUsed) ? styles.correctTxt : globalCss.blueLight}
                        />
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Buttons

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
        flex: 1,
        marginHorizontal: "1%",
        paddingTop: "6%",
        paddingBottom: "5%",
        //paddingVertical: 18,
        alignItems: "center",
        borderRadius: 14,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    correct: {
        backgroundColor: "#81b344",
    },
    incorrect: {
        backgroundColor: "#ca3431",
    },
    correctTxt: {
        color: "white",
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
});