import {StyleSheet, Text, View} from "react-native";
import globalCss from "../../css/globalCss";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";

const Answers = ({data, isHelpUsed, isAnswerCorrect, preHelpAnswers, selectedAnswer, handleAnswerSelect}) => {
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
                    <AnimatedButtonShadow
                        key={answer.id}
                        shadowDisplayAnimate={"slide"}
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
                        onPress={() => handleAnswerSelect(answer.id, data[0])}
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
                ))}
            </View>
        </View>
    )
}

export default Answers

const styles = StyleSheet.create({
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
    buttonTextBlack: {
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 18,
        color: "#8895bc",
    },
});