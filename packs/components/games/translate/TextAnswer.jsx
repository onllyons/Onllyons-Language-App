import React, {useState} from "react";
import {TextInput as Input, Text} from "react-native";
import {AnimatedButtonShadow} from "../../buttons/AnimatedButtonShadow";
import globalCss from "../../../css/globalCss";
import Toast from "react-native-toast-message";

export const TextAnswer = ({
    showIncorrectStyle,
    selectedAnswer,
    answers,
    handleAnswerSelect
}) => {
    const [text, setText] = useState("")

    const handleCheckAnswer = () => {
        if (!text) {
            Toast.show({
                type: "error",
                text1: "Заполните поле"
            });
            return
        }

        if (text === answers[0]) {
            handleAnswerSelect(text, true)
            setText("")
            return;
        }

        let answer = text.replace(/ё/g, "е");
        answer = answer.replace(/["!?.,]/g, "");
        answer = answer.trim().toLowerCase().replace(/\s+/g, " ");

        let correct = false;

        for (let item of answers) {
            let answerToCheck = item.replace(/ё/g, "е");
            answerToCheck = answerToCheck.replace(/["!?.,]/g, "");
            answerToCheck = answerToCheck.trim().toLowerCase().replace(/\s+/g, " ");

            if (answer === answerToCheck) {
                correct = true;
                break
            }
        }

        handleAnswerSelect(text, correct)
        setText("")
    }

    return (
        <>
            <Input
                value={selectedAnswer === null ? text : selectedAnswer}
                editable={selectedAnswer === null}
                placeholder={"Введите ответ"}
                onChangeText={value => setText(value)}
            />

            <AnimatedButtonShadow
                styleButton={[globalCss.button, globalCss.buttonGreen, showIncorrectStyle &&  globalCss.incorrect]}
                shadowColor={showIncorrectStyle ? "red" : "green"}
                permanentlyActive={selectedAnswer !== null || showIncorrectStyle}
                permanentlyActiveOpacity={.5}
                disable={selectedAnswer !== null || showIncorrectStyle}
                onPress={handleCheckAnswer}
            >
                <Text style={globalCss.buttonText}>Проверить</Text>
            </AnimatedButtonShadow>
        </>
    )
}