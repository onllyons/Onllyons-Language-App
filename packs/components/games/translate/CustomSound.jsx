import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet, Text} from "react-native";
import {Audio} from "expo-av";

// icons
import {faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {faCirclePlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import globalCss from "../../../css/globalCss";
import {AnimatedButtonShadow} from "../../buttons/AnimatedButtonShadow";

export const CustomSound = React.memo(({uri, onLoad}) => {
    const lastUri = useRef(null)
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioIsLoaded = useRef(false);

    useEffect(() => {
        initSound()
    }, [uri])

    const initSound = async () => {
        if (lastUri.current !== uri && sound) {
            const status = await sound.getStatusAsync()

            if (status.uri === uri) return

            await sound.unloadAsync()
            setSound(null)
            setIsPlaying(false)

            audioIsLoaded.current = false

            console.log("destroy")

            setTimeout(() => {
                if (audioIsLoaded.current) return

                setIsLoading(false)
            }, 200)
        }

        console.log("new")

        const {sound: newSound} = await Audio.Sound.createAsync({uri: uri});
        await newSound.setVolumeAsync(1);
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        lastUri.current = uri
        audioIsLoaded.current = true
        setSound(newSound);
        setIsLoading(true)

        if (onLoad) setTimeout(() => onLoad(), 300)
    }

    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
        }
    };

    const playSound = useCallback(async () => {
        if (sound) {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                if (status.positionMillis >= status.durationMillis) {
                    await sound.replayAsync();
                } else {
                    await sound.playAsync();
                }

                setIsPlaying(true);
            }
        }
    }, [sound])

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
                setSound(null)
            }
            : undefined;
    }, [sound]);

    return (
        <AnimatedButtonShadow
            onPress={() => playSound()}
            styleButton={[styles.audioTouchable, globalCss.bgGry]}
            shadowColor={"gray"}
            permanentlyActiveOpacity={.5}
            disable={!isLoading}
            permanentlyActive={!isLoading}
            moveByY={3}
        >
            <Text>
                <FontAwesomeIcon
                    icon={isPlaying ? faCirclePause : faCirclePlay}
                    size={60}
                    style={{color: "#1f80ff"}}
                />
            </Text>
        </AnimatedButtonShadow>
    );
})

const styles = StyleSheet.create({
    audioTouchable: {
        width: "100%",
        paddingVertical: "8%",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center',
        marginBottom: '10%',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2
    },
})
