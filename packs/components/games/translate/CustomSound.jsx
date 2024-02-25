import React, {useEffect, useState} from "react";
import {StyleSheet, Text} from "react-native";
import {Audio} from "expo-av";

// icons
import {faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {faCirclePlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import globalCss from "../../../css/globalCss";
import {AnimatedButtonShadow} from "../../buttons/AnimatedButtonShadow";

export const CustomSound = React.memo(({uri}) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
        }
    };

    const playSound = async () => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
        });

        if (!sound) {
            const {sound} = await Audio.Sound.createAsync(
                {uri: uri},
                {shouldPlay: true}
            );
            await sound.setVolumeAsync(1);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

            setSound(sound);
            setIsPlaying(true);
        } else {
            const status = await sound.getStatusAsync()

            if (!status.isLoaded) return

            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    };

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
