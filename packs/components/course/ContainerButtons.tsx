import React, {FunctionComponent} from "react";
import {Text, TouchableOpacity, View} from "react-native";

// styles
import globalCss from "../../css/globalCss";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";

type ContainerButtonsProps = {
    disabled?: boolean;
    keyId: string;
    checkKey?: string;
    dataItemV1: string;
    dataItemV2: string;
    dataItemV3: string;
    dataItemV4: string;
    currentQuest: string;
    setCurrentQuest: (
        key: string,
        valueProps: string,
        currentQuest: string
    ) => void;
};

export const ContainerButtons: FunctionComponent<ContainerButtonsProps> = React.memo(({
    disabled,
    keyId,
    checkKey,
    dataItemV1,
    dataItemV2,
    dataItemV3,
    dataItemV4,
    currentQuest,
    setCurrentQuest,
}) => {
    const button = (title: string) => {
        return (
            <AnimatedButtonShadow
                permanentlyActive={disabled}
                styleContainer={{
                    flex: 1,
                }}
                styleButton={{
                    width: "100%",
                    paddingVertical: 20,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(checkKey && title === checkKey
                        ? {
                            ...(title === currentQuest
                                ? globalCss.correct
                                : globalCss.incorrect),
                        }
                        : undefined),
                }}
                shadowColor={"grayWhite"}
                shadowBorderRadius={5}
                moveByY={3}
                onPress={() => {
                    if (!disabled) setCurrentQuest(keyId, title, currentQuest)
                }}
            >
                <Text
                    style={[
                        {
                            color: "#616161",
                            textAlign: "center",
                            fontSize: 16,
                        },
                        {
                            color: checkKey && title === checkKey ? "white" : "black",
                        },
                        {
                            ...(checkKey && title === checkKey
                                ? {
                                    ...(title === currentQuest
                                        ? globalCss.correct
                                        : globalCss.incorrect),
                                }
                                : undefined),
                            overflow: "hidden",
                        },
                    ]}
                >
                    {title}
                </Text>
            </AnimatedButtonShadow>
        );
    };
    return (
        <View style={{marginTop: '10%', justifyContent: "center",}}>
            <View style={{flexDirection: "row", gap: 12, marginBottom: 12}}>
                {button(dataItemV1)}
                {button(dataItemV2)}
            </View>
            <View style={{flexDirection: "row", gap: 12}}>
                {button(dataItemV3)}
                {button(dataItemV4)}
            </View>
        </View>
    );
});
