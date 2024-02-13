import React, {FunctionComponent, useEffect, useState} from "react";
import {Text, TouchableOpacity} from "react-native";
import {AVPlaybackStatus, Audio} from "expo-av";

// icons
import {faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {faCirclePlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// styles
import {stylesCourse_lesson as styles} from "../../css/course_lesson.styles";
import globalCss from "../../css/globalCss";
import {SERVER_URL} from "../../utils/Requests";

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
    const [AudioQuiz, setAudioQuiz] = useState(false);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
        }
    };

    const playSound = async (name: string) => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
        });

        if (!sound) {
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
        if (isFocused) playSound(name);
        else if (sound) sound.unloadAsync();
    }, [isFocused, name]);

    return (
        <TouchableOpacity
            onPress={() => playSound(name)}
            style={[styles.audioTouchable, AudioQuiz ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry]}
            onPressIn={() => setAudioQuiz(true)}
            onPressOut={() => setAudioQuiz(false)}
            activeOpacity={1}
        >
            <Text style={styles.audioWord}>
                <FontAwesomeIcon
                    icon={isPlaying ? faCirclePause : faCirclePlay}
                    size={60}
                    style={{color: "#1f80ff"}}
                />
            </Text>
        </TouchableOpacity>


    );
})
