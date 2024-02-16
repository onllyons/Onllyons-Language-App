import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";
import globalCss from "../../css/globalCss";
import {AnimatedNavTopMenu} from "./AnimatedNavTopMenu";
import React, {useEffect, useState} from "react";
import {formatDayWord} from "../../utils/Utls";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faFire} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NavTopItemLanguageMenu = () => {
    const handleButtonPress = () => {
        // Afiseaza alerta cu mesajul dorit în limba rusă
        Alert.alert(
            "Новые языки скоро будут добавлены",
            "В скором времени будут добавлены новые языки",
            [
                {text: "OK"}
            ],
            {cancelable: false}
        );

    };

    return (
        <AnimatedNavTopMenu id={"language"}>
            <View style={navDropdown.containerSentences}>
                <View style={navDropdown.rowContainerLanguageSelect}>
                    <TouchableOpacity style={navDropdown.containerLanguageSelect}>
                        <Image
                            source={require('../../images/country-flags/usa.png')}
                            style={navDropdown.flagsLang}
                        />
                        <View style={globalCss.alignSelfCenter}>
                            <Text style={navDropdown.textLangSelect}>English</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={navDropdown.containerLanguageSelect} onPress={handleButtonPress}>
                        <Image
                            source={require('../../images/country-flags/addmore.png')}
                            style={navDropdown.flagsLang}
                        />
                        <View style={globalCss.alignSelfCenter}>
                            <Text style={navDropdown.textLangSelect}>Добавить</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </AnimatedNavTopMenu>
    )
}

export const NavTopItemSeriesMenu = React.memo(({seriesData: data}) => {
    const [seriesData, setSeriesData] = useState(data ? data : {})

    useEffect(() => {
        if (data && data["daysVisited"]) {
            AsyncStorage.setItem("seriesData", JSON.stringify(data));
            setSeriesData(data)
        } else {
            AsyncStorage.getItem("seriesData")
                .then(textData => {
                    if (textData === null) return

                    const parsedData = JSON.parse(textData)
                    setSeriesData(parsedData && parsedData["daysVisited"] ? parsedData : {})
                })
        }
    }, [data]);


    const getImgByVisit = day => {
        if (!seriesData["daysVisited"]) return require("../../images/other_images/checkGry.png")

        return seriesData["daysVisited"][day]["visited"] ? (seriesData["daysVisited"][day]["visitedMore"] ? require("../../images/other_images/checkBlue.png") : require("../../images/other_images/check.png")) : require("../../images/other_images/checkGry.png")
    }

    const SyllableGroup = () => {
        const messagesByGroup = {
            1: [
                "You're smashing it!",
                "Outstanding performance!",
                "You're killing it!",
                "Keep it up!"
            ],
            2: [
                "Great job!",
                "Keep on shining!",
                "Fantastic!",
                "Brilliant execution!"
            ],
            3: [
                "You're smashing it!",
                "Outstanding performance!",
                "You're killing it!",
                "Keep it up!"
            ],
        }

        switch (seriesData["syllableGroup"]) {
            case 3:
                return (
                <>
                    <Text style={navDropdown.titleh7}>You're smashing it!</Text>
                    <Text style={navDropdown.titleh7}>Outstanding performance!</Text>
                    <Text style={navDropdown.titleh7}>You're killing it!</Text>
                    <Text style={navDropdown.titleh7}>Keep it up!</Text>
                </>
                )

        }

        const messages = messagesByGroup[seriesData["syllableGroup"]] ? messagesByGroup[seriesData["syllableGroup"]] : messagesByGroup[1]

        return <Text style={navDropdown.titleh7}>{messages[Math.floor(Math.random() * messages.length)]}</Text>;
    }

    return (
        <AnimatedNavTopMenu id={"series"}>
            <View style={navDropdown.containerSentences}>
                <View style={navDropdown.containerResultDataSce1}>
                    <View style={navDropdown.cardDataDayCurrent}>
                        <Image
                            source={require('../../images/other_images/fire.png')}
                            style={navDropdown.imageAnalyticsDay}
                        />
                        <Text style={navDropdown.percentage1}>{formatDayWord(seriesData.currentSeries)}</Text>
                        <Text style={navDropdown.timeframe1}>Текущая серия</Text>
                    </View>

                    <View style={navDropdown.cardDataDayLong}>
                        <Image
                            source={require('../../images/other_images/deadline.png')}
                            style={navDropdown.imageAnalyticsDay}
                        />
                        <Text style={navDropdown.percentage1}>{formatDayWord(seriesData.maxSeries)}</Text>
                        <Text style={navDropdown.timeframe1}>Самая длинная серия</Text>
                    </View>
                </View>

                <View style={navDropdown.containerResultDataSce1}>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Пн</Text>
                        <Image
                            source={getImgByVisit("Mon")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Вт</Text>
                        <Image
                            source={getImgByVisit("Tue")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Ср</Text>
                        <Image
                            source={getImgByVisit("Wed")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Чт</Text>
                        <Image
                            source={getImgByVisit("Thu")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Пт</Text>
                        <Image
                            source={getImgByVisit("Fri")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Сб</Text>
                        <Image
                            source={getImgByVisit("Sat")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                    <View style={navDropdown.boxDay}>
                        <Text style={navDropdown.dayW}>Вс</Text>
                        <Image
                            source={getImgByVisit("Sun")}
                            style={navDropdown.imageAnalyticsDayCheck}
                        />
                    </View>
                </View>
                <View style={navDropdown.groupStatusVis}>
                    <FontAwesomeIcon  style={{color: 'orange', marginRight: 7}} icon={faFire} size={20}/>
                    <SyllableGroup />
                </View>

            </View>
        </AnimatedNavTopMenu>
    )
})