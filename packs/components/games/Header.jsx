import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faClock, faFire, faTrophy} from "@fortawesome/free-solid-svg-icons";
import globalCss from "../../css/globalCss";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";

export const Header = ({timerRun, stats}) => {
    const navigation = useNavigation()

    const formatTime = useCallback((time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }, [])

    const Timer = () => {
        const [timer, setTimer] = useState(stats.time)

        useEffect(() => {
            const id = setInterval(() => {
                if (!timerRun) {
                    clearInterval(id)
                    return
                }

                setTimer(prev => prev += 1)
                stats.time += 1
            }, 1000);

            return () => clearInterval(id)
        }, [])

        return (
            <View style={[styles.itemNavTop, styles.itemClock]}>
                <FontAwesomeIcon icon={faClock} size={26} style={styles.faTrophy}/>
                <Text style={[styles.itemTxtNavTop, styles.itemClockTxt]}>{formatTime(timer)}</Text>
            </View>
        )
    }
    
    return (
        <View style={styles.sectionTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}
                              style={[styles.itemNavTop, styles.itemNavBtnBack]}>
                <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
            </TouchableOpacity>

            <View style={[styles.itemNavTop, styles.itemRatingGen]}>
                <FontAwesomeIcon icon={faTrophy} size={26} style={styles.faTrophy}/>
                <Text style={styles.itemTxtNavTop}>{stats.rating}</Text>
                {stats.additionalRating !== 0 &&
                <Text style={[
                    styles.itemTxtNavTop,
                    stats.additionalRating > 0 ? styles.ratingPlus : styles.ratingMinus
                ]}>{stats.additionalRating > 0 ? "+" : ""}{stats.additionalRating}</Text>
                }
            </View>

            <View style={[styles.itemNavTop, styles.itemConsecutive]}>
                <FontAwesomeIcon icon={faFire} size={26} style={styles.faTrophy}/>
                <Text style={[styles.itemTxtNavTop, styles.answerCons]}>{stats.series}</Text>
            </View>

            <Timer/>
        </View>
    )
}

export const calculateAddRating = (isCorrect, stats, data) => {
    if (isCorrect) {
        const timePercent = stats.time / data.time * 100;
        let bonusRating = 0

        if (timePercent <= 33) bonusRating = 3;
        else if (timePercent <= 66) bonusRating = 2;
        else if (timePercent <= 100) bonusRating = 1;

        stats.additionalRating = data.rating_add + bonusRating
        stats.rating += data.rating_add + bonusRating
        stats.series++
    } else {
        const lastRating = stats.rating
        stats.rating -= data.rating_minus
        stats.series = 0

        if (stats.rating < 300) stats.rating = 300

        stats.additionalRating = -(lastRating - stats.rating)
    }
}

const styles = StyleSheet.create({
    sectionTop: {
        width: "100%",
        paddingTop: "10%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemNavTop: {
        flexDirection: "row",
        paddingTop: '5%',
        paddingBottom: '5%',
        alignItems: "center",
    },
    itemNavBtnBack: {
        paddingLeft: '5%',
    },
    itemRatingGen: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    faTrophy: {
        color: '#5e5e5e',
    },
    itemTxtNavTop: {
        fontSize: 19,
        color: '#5e5e5e',
        fontWeight: '500',
        marginLeft: '3%',
    },
    ratingPlus: {
        color: '#81b344',
        fontWeight: '700'
    },
    ratingMinus: {
        color: '#ca3431',
        fontWeight: '700'
    },
    itemConsecutive: {
        paddingLeft: '1%'
    },
    answerCons: {
        marginLeft: 5,
    },
    itemClockTxt: {
        minWidth: '15%',
    },
    itemClock: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})