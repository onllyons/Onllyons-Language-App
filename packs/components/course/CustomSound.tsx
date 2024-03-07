import React, {FunctionComponent, useEffect, useState} from "react";
import {Text} from "react-native";
import {AVPlaybackStatus, Audio, InterruptionModeIOS, InterruptionModeAndroid} from "expo-av";

// icons
import {faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {faCirclePlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// styles
import {stylesCourse_lesson as styles} from "../../css/course_lesson.styles";
import globalCss from "../../css/globalCss";
import {SERVER_URL} from "../../utils/Requests";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";

type SoundCustomProps = {
    name: string;
    url?: string;
    isFocused: boolean;
};

export const CustomSound: FunctionComponent<SoundCustomProps> = React.memo(({
    name,
    url,
    isFocused,
}) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
        }
    };

    const playSound = async (name: string) => {
        if (!sound) {
            await Audio.setAudioModeAsync({
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                playsInSilentModeIOS: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            });

            const {sound} = await Audio.Sound.createAsync(
                {
                    uri: url
                        ? url
                        : `${SERVER_URL}/ru/ru-en/packs/assest/course/content/audios/${name}`,
                },
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
        <AnimatedButtonShadow
            onPress={() => playSound(name)}
            styleButton={[styles.audioTouchable, globalCss.bgGry]}
            shadowColor={"gray"}
            moveByY={3}
        >
            <Text style={styles.audioWord}>
                <FontAwesomeIcon
                    icon={isPlaying ? faCirclePause : faCirclePlay}
                    size={60}
                    style={{color: "#1f80ff"}}
                />
            </Text>
        </AnimatedButtonShadow>
    );
})
