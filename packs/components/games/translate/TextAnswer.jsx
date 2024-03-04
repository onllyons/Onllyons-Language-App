import React, {useEffect, useState} from "react";
import {Platform, TextInput as Input, View} from "react-native"; // Importă Keyboard
import globalCss from "../../../css/globalCss";
import Toast from "react-native-toast-message";

export const TextAnswer = ({
    isAnswerSubmitted,
    selectedAnswer,
    handleAnswerSelect,
    textRef,
}) => {
    const [text, setText] = useState("");

    useEffect(() => {
        if (isAnswerSubmitted) {
            textRef.current = ""
            setText("")
        }
    }, [isAnswerSubmitted])

    return (
        <>
            <View style={[globalCss.boxInputView, globalCss.mb3]}>
                <Input
                    value={selectedAnswer === null ? text : selectedAnswer}
                    editable={selectedAnswer === null}
                    placeholder={"Введите ответ"}
                    onChangeText={value => {
                        textRef.current = value
                        setText(value)
                    }}
                    onSubmitEditing={() => {
                        setTimeout(() => handleAnswerSelect(), Platform.OS === "ios" ? 500 : 1)
                    }}
                    onFocus={() => {
                        if (Platform.OS === "ios") Toast.hide()
                    }}
                    style={globalCss.inputBoxView}
                />
            </View>
        </>
    );
};
