import React, { FunctionComponent, useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Audio } from "expo-av";

// icons
import { faCirclePause, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// styles
import { stylesCourse_lesson as styles } from "../../course_lesson.styles";

type SoundCustomProps = {
  name: string;
  isFocused: boolean;
};

export const SoundCustom: FunctionComponent<SoundCustomProps> = ({
  name,
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
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/content/audios/${name}`,
        },
        { shouldPlay: true }
      );
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
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={() => playSound(name)}>
      <Text style={styles.audioWord}>
        <FontAwesomeIcon
          icon={isPlaying ? faCirclePause : faCirclePlay}
          size={40}
          style={{ color: "#1f80ff" }}
        />
      </Text>
    </TouchableOpacity>
  );
};
