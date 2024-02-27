import {StyleSheet, Text} from "react-native";
import globalCss from "../../../css/globalCss";
import {AnimatedButtonShadow} from "../../buttons/AnimatedButtonShadow";

const Answer = ({answer, isHelpUsed, isAnswerCorrect, preHelpAnswers, selectedAnswer, handleAnswerSelect}) => {
    return (
        <AnimatedButtonShadow
            disable={isHelpUsed || selectedAnswer !== null}
            shadowColor={isHelpUsed && answer.correct ? "green" : (selectedAnswer === answer.id ? (isAnswerCorrect ? "green" : "red") : (preHelpAnswers.indexOf(answer.id) !== -1 ? "hint" : "gray"))}
            permanentlyActive={selectedAnswer === answer.id || preHelpAnswers.indexOf(answer.id) !== -1 || (isHelpUsed && answer.correct)}
            styleButton={[
                globalCss.button,
                globalCss.buttonGry,
                selectedAnswer === answer.id &&
                (isAnswerCorrect ? globalCss.correct : globalCss.incorrect),
                isHelpUsed && answer.correct && globalCss.correct,
                preHelpAnswers.indexOf(answer.id) !== -1 ? globalCss.hint : ""
            ]}
            onPress={() => handleAnswerSelect(answer.id)}
        >
            <Text style={[
                    styles.buttonTextBlack,
                    // Aplică globalCss.correctTxt dacă condițiile pentru globalCss.hint sunt îndeplinite
                    preHelpAnswers.indexOf(answer.id) !== -1 ? globalCss.correctTxt : "",
                    selectedAnswer === answer.id && isAnswerCorrect ? globalCss.correctTxt :
                        selectedAnswer === answer.id ? globalCss.incorrectTxt : null,
                    isHelpUsed && answer.correct ? globalCss.correctTxt : null
                ]}>
                {answer.text}
            </Text>
        </AnimatedButtonShadow>
    )
}

export default Answer

const styles = StyleSheet.create({
    buttonTextBlack: {
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 18,
        color: "#8895bc",
    },
});