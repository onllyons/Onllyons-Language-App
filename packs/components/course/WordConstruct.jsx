import React from "react";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import {stylesCourse_lesson as styles} from "../../css/course_lesson.styles";
import globalCss from "../../css/globalCss";
import {Text} from "react-native";

export const WordConstruct = React.memo(({word, indexItem, setValueWordConstruct, check, keyItem}) => {
    return (
        <AnimatedButtonShadow
            onPress={() => {
                setValueWordConstruct(indexItem, word[1], keyItem);
            }}
            permanentlyActive={check && check.indexesPressed[word[1]] && check.indexesPressed[word[1]].changeBg}
            styleButton={[
                styles.btnQuizPositionCa,
                globalCss.bgGry,
                check && check.indexesPressed[word[1]] && check.indexesPressed[word[1]].changeBg
                    ? (check.indexesPressed[word[1]].correct ? {backgroundColor: "#12D18E"} : {backgroundColor: "#FF5A5F"})
                    : null
            ]}
            shadowBorderRadius={10}
            shadowColor={"gray"}
        >
            <Text style={[
                styles.btnQuizStyleCa,
                check && check.indexesPressed[word[1]] && check.indexesPressed[word[1]].changeBg ? {color: "white"} : null
            ]}>{word[0]}</Text>
        </AnimatedButtonShadow>
    )
})