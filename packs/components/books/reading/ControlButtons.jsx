import React from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Image, TouchableOpacity, View, StyleSheet} from "react-native";

export const ControlButtons = React.memo(({
    isPlaying,
    isMuted,
    playSound,
    toggleMute,
    rewindSound
}) => {
    const navigation = useNavigation()
    const {info, data, type} = useRoute().params

    return (
        <View style={styles.audioPlyr}>

            <TouchableOpacity
                style={styles.controlAudioBtn}
                onPress={() => {
                    playSound({stop: true})
                    navigation.navigate("BooksCategory", {type: type, info: info, data: data})
                }}
            >
                <Image
                    source={require('../../../images/other_images/player/list.png')}
                    style={styles.imgPlyrList}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlAudioBtn}
                onPress={() => rewindSound(-10)}
            >
                <Image
                    source={require('../../../images/other_images/player/back.png')}
                    style={styles.imgPlyrNextBack}
                />
            </TouchableOpacity>

            <View style={styles.controlAudioBtn}>
                <TouchableOpacity onPress={() => playSound()}>
                    <Image
                        source={isPlaying ? require('../../../images/other_images/player/pause.png') : require('../../../images/other_images/player/play.png')}
                        style={styles.imgPlyrSettings}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.controlAudioBtn}
                onPress={() => rewindSound(10)}
            >
                <Image
                    source={require('../../../images/other_images/player/next.png')}
                    style={styles.imgPlyrNextBack}
                />
            </TouchableOpacity>

            <View style={styles.controlAudioBtn}>
                <TouchableOpacity onPress={toggleMute}>
                    <Image
                        source={isMuted ? require('../../../images/other_images/player/mute.png') : require('../../../images/other_images/player/volume.png')}
                        style={styles.imgPlyrVolume}
                    />
                </TouchableOpacity>
            </View>

        </View>
    )
})

const styles = StyleSheet.create({
    audioPlyr: {
        position: "absolute",
        flexDirection: "row",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        paddingVertical: "8%",
        paddingHorizontal: "8%",
        alignItems: "center",
    },
    controlAudioBtn: {
        flex: 1,
        alignItems: "center",
    },
    imgPlyrList: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    imgPlyrVolume: {
        width: 35,
        height: 35,
        resizeMode: "contain",
    },
    imgPlyrNextBack: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    imgPlyrSettings: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
})