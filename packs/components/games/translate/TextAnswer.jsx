import React, {useEffect, useState} from "react";
import {TextInput as Input, View} from "react-native"; // Importă Keyboard
import globalCss from "../../../css/globalCss";

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
                    onSubmitEditing={handleAnswerSelect}
                    style={globalCss.inputBoxView}
                />
            </View>
        </>
    );
};
