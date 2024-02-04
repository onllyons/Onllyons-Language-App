import React, { FunctionComponent, useEffect, useRef } from "react";
import { AVPlaybackStatusSuccess, Audio, ResizeMode, Video } from "expo-av";

// styles
import { stylesCourse_lesson as styles } from "../../course_lesson.styles";

type VideoCustomProps = {
  index: string | number;
  uri: string;
  isFocused: boolean;
};

export const VideoCustom: FunctionComponent<VideoCustomProps> = ({
  index,
  uri,
  isFocused,
}) => {
  const videoRef = useRef<Video>(null);

  const stopVideo = async () => {
    try {
      await videoRef.current.replayAsync();
      await videoRef.current.stopAsync();
    } catch (error) {}
  };

  const handlePlaybackStatusUpdate = async (
    status: AVPlaybackStatusSuccess
  ) => {
    if (status.didJustFinish) {
      await stopVideo();
    }
  };

  useEffect(() => {
    try {
      if (isFocused)
        (async () => {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
          await videoRef.current.playAsync();
        })();
      else
        (async () => {
          await stopVideo();
        })();
    } catch (error) {}
  }, [isFocused]);

  return (
    <Video
      volume={5}
      ref={videoRef}
      key={`video-${index}`}
      style={styles.video}
      source={{
        uri,
      }}
      useNativeControls
      resizeMode={ResizeMode.COVER}
      onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
    />
  );
};
