import React, {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {Audio} from "expo-av";

// icons
import {faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {faCirclePlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import {SERVER_URL} from "../../utils/Requests";

export const AudioComponent = React.memo(({
    name,
    isFocused,
}) => {
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
                {
                    uri: `${SERVER_URL}/ru/ru-en/packs/assest/game-card-word/content/audio/${name}`,
                },
                {shouldPlay: true}
            );
            await sound.setVolumeAsync(1);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

            setSound(sound);
            setIsPlaying(true);
        } else {
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
            }
            : undefined;
    }, [sound]);

    useEffect(() => {
        checkFocus()
    }, [isFocused]);

    const checkFocus = async () => {
        if (!sound) {
            if (isFocused) playSound(name)
            return
        }

        const status = await sound.getStatusAsync()

        if (!isFocused && status.isPlaying) {
            sound.pauseAsync()
            setIsPlaying(false)
        } else if (isFocused && !status.isPlaying) {
            sound.replayAsync({shouldPlay: true})
            setIsPlaying(true)
        }
    }

    return (
        <TouchableOpacity
            onPress={() => playSound()}
        >
            <Text style={styles.audioWord}>
                <FontAwesomeIcon
                    icon={isPlaying ? faCirclePause : faCirclePlay}
                    size={40}
                    style={{color: "#1f80ff"}}
                />
            </Text>
        </TouchableOpacity>
    );
})

const styles = StyleSheet.create({
    audioWord: {
        alignSelf: "center",
        marginBottom: "10%",
    },
});