import React, {useEffect, useRef, useState} from "react";
import {Animated, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCirclePause, faCirclePlay, faVolumeHigh, faVolumeXmark} from "@fortawesome/free-solid-svg-icons";
import {Video} from "expo-av";

export const CustomVideo = React.memo(({url, isFocused}) => {
    const [status, setStatus] = useState({})
    const video = useRef(null)

    useEffect(() => {
        if (!video.current) return

        if (!isFocused && status.isPlaying) video.current.pauseAsync()
        else if (isFocused && !status.isPlaying) video.current.replayAsync({shouldPlay: true})
    }, [isFocused])

    const handlePlaybackStatusUpdate = status => {
        setStatus(status)
    }

    return (
        <View style={styles.videoContainer}>
            <Video
                ref={video}
                style={styles.video}
                source={{uri: url}}
                useNativeControls={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                resizeMode="cover"
            />
            <VideoControls video={video.current} status={status}/>
        </View>
    )
})

const VideoControls = ({video, status}) => {
    const opacity = useRef(new Animated.Value(1));
    const hidden = useRef(false)

    useEffect(() => {
        if (status.didJustFinish) showControls()
        if (status.isPlaying && hidden.current) hideControls()
    }, [status]);

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
                console.log("asdasd")
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
                        icon={status.isPlaying ? faCirclePause : faCirclePlay}
                        size={40}
                        style={{color: "#1f80ff"}}
                    />
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => muteOnMuteVideo()}>
                <Text>
                    <FontAwesomeIcon
                        icon={status.isMuted ? faVolumeXmark : faVolumeHigh}
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
        backgroundColor: "rgba(0,0,0,.25)"
    },

    videoContainer: {
        width: "100%",
        height: "37%",
        borderRadius: 12,
    },

    video: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        resizeMode: "cover",
    }
})