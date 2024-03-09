import React, {useCallback, useEffect, useRef, useState} from "react";
import {Animated, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCirclePause, faCirclePlay, faVolumeHigh, faVolumeXmark} from "@fortawesome/free-solid-svg-icons";
import {Video} from "expo-av";

export const CustomVideo = React.memo(({url, isFocused, isQuiz}) => {
    const video = useRef({})
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [didJustFinish, setDidJustFinish] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!video.current || !isLoaded) return

        checkFocus()
            .then(() => {})
            .catch(() => {})
    }, [isFocused, isLoaded])

    const checkFocus = useCallback(async () => {
        if (!isFocused) {
            await video.current.setPositionAsync(0)
            await video.current.pauseAsync()
        } else if (isFocused && !isPlaying) {
            await video.current.playAsync()
        }
    }, [isFocused, isPlaying])

    const handlePlaybackStatusUpdate = async status => {
        setIsMuted(status.isMuted)
        setIsPlaying(status.isPlaying)
        setDidJustFinish(status.didJustFinish)
    }

    return (
        <View style={[styles.videoContainer, isQuiz && {height: "50%"}]}>
            <Video
                rate={1}
                ref={video}
                style={styles.video}
                source={{uri: url}}
                useNativeControls={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                onLoad={() => setIsLoaded(true)}
                resizeMode="cover"
            />
            {isLoaded && (
                <VideoControls
                    video={video.current}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    didJustFinish={didJustFinish}
                />
            )}
        </View>
    )
})

const VideoControls = ({video, isMuted, isPlaying, didJustFinish}) => {
    const opacity = useRef(new Animated.Value(0));
    const hidden = useRef(true)

    useEffect(() => {
        if (didJustFinish) showControls()
        if (isPlaying && !hidden.current) hideControls()
    }, [isPlaying, didJustFinish]);

    const playPauseVideo = async () => {
        if (video.error) return
        if (hidden.current) return showControls()

        const status = await video.getStatusAsync()

        hideControls()

        if (status.isPlaying) {
            await video.pauseAsync();
        } else {
            if (status.durationMillis <= status.positionMillis) {
                await video.replayAsync()
            } else {
                await video.playAsync();
            }
        }
    };

    const muteOnMuteVideo = async () => {
        if (video.error) return
        if (hidden.current) return showControls()

        const status = await video.getStatusAsync()

        await video.setIsMutedAsync(!status.isMuted)
    };

    const hideControls = () => {
        Animated.timing(opacity.current, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();

        hidden.current = true
    }

    const showControls = () => {
        Animated.timing(opacity.current, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();

        hidden.current = false
    }

    return (
        <Animated.View style={{...styles.controls, opacity: opacity.current}}>
            <Pressable style={styles.controlsBg} onPress={() => {
                if (hidden.current) showControls()
            }}/>

            <TouchableOpacity onPress={() => playPauseVideo()}>
                <Text>
                    <FontAwesomeIcon
                        icon={isPlaying ? faCirclePause : faCirclePlay}
                        size={40}
                        style={{color: "#1f80ff"}}
                    />
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => muteOnMuteVideo()}>
                <Text>
                    <FontAwesomeIcon
                        icon={isMuted ? faVolumeXmark : faVolumeHigh}
                        size={40}
                        style={{color: "#1f80ff"}}
                    />
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    controls: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row"
    },

    controlsBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,.25)",
        borderRadius: 12
    },

    videoContainer: {
        position: "relative",
        width: "100%",
        height: "37%",
        borderRadius: 12,
        backgroundColor: "#fff"
    },
    video: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        resizeMode: "cover",
        backgroundColor: "transparent"
    }
})