import {Image, Text, View} from "react-native";
import globalCss from "../../css/globalCss";
import {
    AnimatedNavTopContainer,
    AnimatedNavTopMenu,
    useAnimatedNavTop
} from "../navTop/AnimatedNavTopMenu";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";
import {calculatePercentage, getHoursOrMinutes} from "../../utils/Utls";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import React, {useEffect, useRef, useState} from "react";
import {NavTopItem, NavTopItemLanguage, NavTopItemSeries} from "../navTop/NavTopItem";
import {NavTopItemLanguageMenu, NavTopItemSeriesMenu} from "../navTop/NavTopMenu";

export const NavTop = (props) => {
    return (
        <AnimatedNavTopContainer>
            <NavTopContent {...props}/>
        </AnimatedNavTopContainer>
    )
}

const NavTopContent = ({getCategoryData, seriesData, generalInfo}) => {
    const {setStartPosition} = useAnimatedNavTop()
    const [phrasesPercent, setPhrasesPercent] = useState(0)
    const percentRef = useRef(0)

    useEffect(() => {
        percentRef.current = calculatePercentage(generalInfo.phrasesCompleted, generalInfo.phrases)
    }, [generalInfo.phrasesCompleted]);

    return (
        <>
            <View style={globalCss.navTabUser}
                  onLayout={event => {
                      setStartPosition(event.nativeEvent.layout.height)
                  }}>

                <NavTopItemLanguage/>
                <NavTopItem
                    text={getCategoryData("finished")}
                    id={"general"}
                    image={require("../../images/other_images/nav-top/mortarboard.png")}
                />
                <NavTopItemSeries text={seriesData.currentSeries ? seriesData.currentSeries : 0}/>
                <NavTopItem
                    text={getCategoryData("phrasesCompleted")}
                    id={"phrases"}
                    image={require("../../images/other_images/nav-top/feather.png")}
                />
            </View>

            <NavTopItemLanguageMenu/>
            <NavTopItemSeriesMenu seriesData={seriesData}/>

            <AnimatedNavTopMenu id={"general"}>
                <View style={navDropdown.containerSentences}>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainer}>

                                <View style={navDropdown.cardMiddleProcenteCourse}>
                                    <View style={navDropdown.cardMiddleProcenteRow}>
                                        <Text style={navDropdown.textProcenteCourse}>{generalInfo.coursesCompleted ? calculatePercentage(generalInfo.coursesCompleted, generalInfo.courses, true) : 0}</Text>
                                        <Text style={navDropdown.textProcenteCourse1}>%</Text>
                                    </View>
                                </View>
                                <Image
                                    source={require('../../images/other_images/sheet1.png')}
                                    style={navDropdown.courseSheet}
                                />

                            </View>
                            <View style={navDropdown.dividerCourseData}/>
                            <View style={navDropdown.fluencyContainer}>
                                <Text style={navDropdown.iconSubText}>УРОВЕНЬ</Text>
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{generalInfo.level ? generalInfo.level : "Beginner"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={navDropdown.containerSheet}>
                        <View style={navDropdown.cardSheet}>

                            <View style={navDropdown.sectionSheet2}>
                                <Text style={navDropdown.header}>ВСЕГО УРОКОВ</Text>
                                <Text style={navDropdown.numberSheetTxt}>{generalInfo.courses ? `${generalInfo.coursesCompleted}/${generalInfo.courses}` : "0/0"}</Text>
                            </View>

                            <View style={navDropdown.sectionSheetBorder}>
                                <View style={navDropdown.sectionSheet1}>
                                    <Text style={navDropdown.headerSheet}>ВИКТОРИНЫ</Text>
                                    <Text style={[navDropdown.dateTimeQuizAnalytical, globalCss.green]}>{generalInfo.quizzes ? `${generalInfo.quizzesCompleted}/${generalInfo.quizzes}` : "0/0"}</Text>
                                </View>
                                <View style={navDropdown.sectionSheet}>
                                    <Text style={navDropdown.headerSheet}>ОБЩЕЕ ВРЕМЯ</Text>
                                    <Text style={[navDropdown.numberSheetTxt, globalCss.green]}>
                                        {generalInfo.coursesCompletedHours ? getHoursOrMinutes(generalInfo.coursesCompletedHours, true) : 0}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>
            <AnimatedNavTopMenu
                id={"phrases"}
                onOpen={() => {
                    if (percentRef.current !== phrasesPercent) setPhrasesPercent(percentRef.current)
                }}
            >
                <View style={navDropdown.containerSentences}>
                    <Text style={navDropdown.titleh5}>Фразы, которые ты освоил</Text>
                    <Text style={navDropdown.titleh6}>Твой Прогресс в Обучении!</Text>

                    <View style={navDropdown.rowBlockSentences}>
                        <AnimatedCircularProgress
                            size={160}
                            width={21}
                            fill={phrasesPercent}
                            tintColor="#ffd100"
                            backgroundColor="#748895"
                            lineCap="round"
                        >
                            {
                                (fill) => (
                                    <>
                                        <Text style={navDropdown.resultProgressBar}>
                                            {`${Math.round(fill)}%`}
                                        </Text>
                                    </>
                                )
                            }
                        </AnimatedCircularProgress>

                        <View style={navDropdown.containerResultDataSce}>
                            <View style={[navDropdown.cardDataSce, globalCss.bgGry, {marginRight: 15}]}>
                                <Text style={navDropdown.percentage}>{generalInfo.phrasesCompleted}</Text>
                                <Text style={navDropdown.timeframe}>Всего изучено из {generalInfo.phrases ? generalInfo.phrases : 0}</Text>
                            </View>

                            <View style={[navDropdown.cardDataSce, globalCss.bgGry]}>
                                <Text style={navDropdown.percentage}>{percentRef.current}%</Text>
                                <Text style={navDropdown.timeframe}>Прогресс курса из 100%</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </AnimatedNavTopMenu>
        </>
    )
}