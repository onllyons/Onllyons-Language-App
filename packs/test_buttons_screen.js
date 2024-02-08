import {Image, Text, View, StyleSheet, ScrollView} from "react-native";
import React from "react";
import {AnimatedButtonMove} from "./components/buttons/AnimatedButtonMove";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";

export default function Test_buttons_screen() {
    return (
        <ScrollView>
            <View style={{
                padding: 50
            }}>
                <Text>Animated button move (animation down)</Text>
                <AnimatedButtonMove>
                    <View style={styles.buttonDefault}>
                        <Image
                            source={require('./images/icon/infoCategory.png')}
                            style={styles.buttonDefaultImg}
                        />
                    </View>
                </AnimatedButtonMove>

                <Text>Animated button move (animation up)</Text>
                <AnimatedButtonMove moveBy={-5}>
                    <View style={styles.buttonDefault}>
                        <Image
                            source={require('./images/icon/infoCategory.png')}
                            style={styles.buttonDefaultImg}
                        />
                    </View>
                </AnimatedButtonMove>

                <Text>Animated button move (animation down, with touchable opacity)</Text>
                <AnimatedButtonMove type={"touchable"}>
                    <View style={styles.buttonDefault}>
                        <Image
                            source={require('./images/icon/infoCategory.png')}
                            style={styles.buttonDefaultImg}
                        />
                    </View>
                </AnimatedButtonMove>

                <Text>Animated button with shadow (animation down)</Text>
                <AnimatedButtonShadow styleButton={[styles.buttonDefault2]}>
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <Text>Animated button with shadow (animation down, with touchable opacity)</Text>
                <AnimatedButtonShadow styleButton={[styles.buttonDefault2]} type={"touchable"}>
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <Text>ANIMATED BUTTONS WITH SHADOW CHANGED PROPERTIES</Text>
                <AnimatedButtonShadow
                    styleButton={[styles.buttonDefault2]}
                    moveByX={5}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    styleButton={[styles.buttonDefault2]}
                    moveByX={-5}
                    moveByY={-5}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    styleButton={[styles.buttonDefault2]}
                    shadowHeightAdditional={5}
                    shadowColor={"#395817"}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    styleButton={[styles.buttonDefault2]}
                    moveByY={-5}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    styleButton={[styles.buttonDefault2]}
                    moveByY={0}
                    moveByX={-5}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>

                <AnimatedButtonShadow
                    styleButton={[styles.buttonDefault2]}
                    moveByY={0}
                    moveByX={5}
                    shadowHeightAdditional={10}
                    shadowPositionYAdditional={-5}
                    shadowPositionXAdditional={5}
                >
                    <Image
                        source={require('./images/icon/infoCategory.png')}
                        style={styles.buttonDefaultImg}
                    />
                </AnimatedButtonShadow>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttonDefault: {
        width: 90,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ca8707",
        borderRadius: 14,
        marginVertical: 20
    },
    buttonDefault2: {
        width: 90,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#89df35",
        borderRadius: 14,
        marginVertical: 20
    },
    buttonDefaultImg: {
        width: 20,
        height: 20,
    }
})