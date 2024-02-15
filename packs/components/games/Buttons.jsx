import {StyleSheet, Text, View} from "react-native";
import globalCss from "../../css/globalCss";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowRightLong, faLightbulb, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";

const Buttons = ({selectedAnswer, isAnswerCorrect, isHelpUsed, showIncorrectStyle, handleHelp, handleNext, handleRepeat}) => {
    const visibleNextOrReload = !!(selectedAnswer || isHelpUsed)
    const visibleHelp = !!((!selectedAnswer || (selectedAnswer && !isAnswerCorrect)) && !isHelpUsed)

    const renewButtons = visibleNextOrReload && visibleHelp

    return (
        <View style={styles.groupBtnQuiz}>
            {visibleNextOrReload && (
                <AnimatedButtonShadow
                    {...(renewButtons ? {key: 0} : {})}
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
                    {...(renewButtons ? {key: 1} : {})}
                    styleContainer={styles.quizBtnCtrContainer}
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
                    {...(renewButtons ? {key: 2} : {})}
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