import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import globalCss from "../../css/globalCss";
import {
    AnimatedNavTopArrow, AnimatedNavTopContainer,
    AnimatedNavTop,
    useAnimatedNavTop
} from "../AnimatedNavTop";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";
import {calculatePercentage, formatDayWord, getHoursOrMinutes} from "../../utils/Utls";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faFire} from "@fortawesome/free-solid-svg-icons";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import React, {useState} from "react";

export const NavTop = (props) => {
    return (
        <AnimatedNavTopContainer>
            <NavTopContent {...props}/>
        </AnimatedNavTopContainer>
    )
}

const NavTopContent = ({getCategoryData, seriesData, generalInfo, onLayout}) => {
    const {setStartPosition, toggleNavTopMenu} = useAnimatedNavTop()
    const [phrasesPercent, setPhrasesPercent] = useState(0)

    const getImgByVisit = day => {
        if (!seriesData.current["daysVisited"]) return require("../../images/other_images/checkGry.png")

        return seriesData.current["daysVisited"][day]["visited"] ? (seriesData.current["daysVisited"][day]["visitedMore"] ? require("../../images/other_images/checkBlue.png") : require("../../images/other_images/check.png")) : require("../../images/other_images/checkGry.png")
    }

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

    const SyllableGroup = () => {
        switch (seriesData.current["syllableGroup"]) {
            case 3:
                return (
                    <Text>Группа 3</Text>
                )

            case 2:
                return (
                    <Text>Группа 2</Text>
                )

            case 1:
            default:
                return (
                    <Text>Группа 1</Text>
                )
        }
    }

    return (
        <>
            <View style={globalCss.navTabUser}
                  onLayout={event => {
                      setStartPosition(event.nativeEvent.layout.height)

                      if (onLayout) onLayout(event)
                  }}>

                {/*{true ? (*/}
                {/*    <View>*/}
                {/*        <ContentLoader active avatar={true} pRows={0} title={false} avatarStyles={{width: 35, height: 35, borderRadius: 10}} />*/}
                {/*    </View>*/}
                {/*) : (*/}
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("language")}>
                    <Image
                        source={require("../../images/other_images/nav-top/english.webp")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>EN</Text>

                    <AnimatedNavTopArrow id={"language"}>
                        <Image
                            source={require("../../images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>

                <TouchableOpacity style={globalCss.itemNavTabUser}
                                  onPress={() => toggleNavTopMenu("courseLessonAnalytics")}>
                    <Image
                        source={require("../../images/other_images/nav-top/mortarboard.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text
                        style={globalCss.dataNavTop}>{getCategoryData("finished")}</Text>

                    <AnimatedNavTopArrow id={"courseLessonAnalytics"}>
                        <Image
                            source={require("../../images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser}
                                  onPress={() => toggleNavTopMenu("consecutiveDaysSeries")}>
                    <Image
                        source={require("../../images/other_images/nav-top/flame.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{seriesData.current.currentSeries ? seriesData.current.currentSeries : 0}</Text>

                    <AnimatedNavTopArrow id={"consecutiveDaysSeries"}>
                        <Image
                            source={require("../../images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("phrasesModal")}>
                    <Image
                        source={require("../../images/other_images/nav-top/feather.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text
                        style={globalCss.dataNavTop}>{getCategoryData("phrasesCompleted")}</Text>

                    <AnimatedNavTopArrow id={"phrasesModal"}>
                        <Image
                            source={require("../../images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
            </View>

            <AnimatedNavTop id={"language"}>
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
            </AnimatedNavTop>
            <AnimatedNavTop id={"courseLessonAnalytics"}>
                <View style={navDropdown.containerSentences}>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainer}>

                                <View style={navDropdown.cardMiddleProcenteCourse}>
                                    <View style={navDropdown.cardMiddleProcenteRow}>
                                        <Text style={navDropdown.textProcenteCourse}>{generalInfo.current.coursesCompleted ? calculatePercentage(generalInfo.current.coursesCompleted, generalInfo.current.courses, true) : 0}</Text>
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
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{generalInfo.current.level ? generalInfo.current.level : "Beginner"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={navDropdown.containerSheet}>
                        <View style={navDropdown.cardSheet}>

                            <View style={navDropdown.sectionSheet2}>
                                <Text style={navDropdown.header}>ВСЕГО УРОКОВ</Text>
                                <Text style={navDropdown.numberSheetTxt}>{generalInfo.current.courses ? `${generalInfo.current.coursesCompleted} / ${generalInfo.current.courses}` : "0 / 0"}</Text>
                            </View>

                            <View style={navDropdown.sectionSheetBorder}>
                                <View style={navDropdown.sectionSheet1}>
                                    <Text style={navDropdown.headerSheet}>ВИКТОРИНЫ</Text>
                                    <Text style={[navDropdown.numberSheetTxt, globalCss.green]}>{generalInfo.current.quizzes ? `${generalInfo.current.quizzesCompleted} / ${generalInfo.current.quizzes}` : "0 / 0"}</Text>
                                </View>
                                <View style={navDropdown.sectionSheet}>
                                    <Text style={navDropdown.headerSheet}>ОБЩЕЕ ВРЕМЯ</Text>
                                    <Text style={[navDropdown.numberSheetTxt, globalCss.green]}>
                                        {generalInfo.current.coursesCompletedHours ? getHoursOrMinutes(generalInfo.current.coursesCompletedHours, true) : 0}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>

                </View>
            </AnimatedNavTop>
            <AnimatedNavTop id={"consecutiveDaysSeries"}>
                <View style={navDropdown.containerSentences}>


                    <View style={navDropdown.containerResultDataSce1}>
                        <View style={navDropdown.cardDataDayCurrent}>
                            <Image
                                source={require('../../images/other_images/fire.png')}
                                style={navDropdown.imageAnalyticsDay}
                            />
                            <Text style={navDropdown.percentage1}>{formatDayWord(seriesData.current.currentSeries)}</Text>
                            <Text style={navDropdown.timeframe1}>Текущая серия</Text>
                        </View>

                        <View style={navDropdown.cardDataDayLong}>
                            <Image
                                source={require('../../images/other_images/deadline.png')}
                                style={navDropdown.imageAnalyticsDay}
                            />
                            <Text style={navDropdown.percentage1}>{formatDayWord(seriesData.current.maxSeries)}</Text>
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
                    <View style={globalCss.alignItemsCenter}>
                        <Text style={navDropdown.titleh7}>
                            <FontAwesomeIcon icon={faFire} size={20} style={{color: 'orange', marginRight: 7}}/>
                            <SyllableGroup/>
                        </Text>
                    </View>


                    {/* way to go! */}
                    {/* Nice work! */}
                    {/* Great job! */}
                    {/* Keep it up! */}
                    {/* Well done! */}
                    {/* Fantastic! */}
                    {/* Keep on shining! */}
                    {/* Brilliant execution! */}
                    {/* You're smashing it! */}
                    {/* Outstanding performance! */}
                    {/* You're killing it! */}

                </View>
            </AnimatedNavTop>
            <AnimatedNavTop
                id={"phrasesModal"}
                onOpen={() => {
                    const percent = calculatePercentage(generalInfo.current.phrasesCompleted, generalInfo.current.phrases)

                    if (phrasesPercent !== percent) setPhrasesPercent(percent)
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
                            <AnimatedButtonShadow
                                styleContainer={navDropdown.cardDataSceContainer}
                                styleButton={[navDropdown.cardDataSce, globalCss.bgGry]}
                                shadowColor={"gray"}
                                moveByY={3}
                            >
                                <Text style={navDropdown.percentage}>{generalInfo.current.phrasesCompleted}</Text>
                                <Text style={navDropdown.timeframe}>Всего изучено из {generalInfo.current.phrases ? generalInfo.current.phrases : 0}</Text>
                            </AnimatedButtonShadow>

                            <AnimatedButtonShadow
                                styleContainer={navDropdown.cardDataSceContainer}
                                styleButton={[navDropdown.cardDataSce, globalCss.bgGry]}
                                shadowColor={"gray"}
                                moveByY={3}
                            >
                                <Text style={navDropdown.percentage}>{phrasesPercent}%</Text>
                                <Text style={navDropdown.timeframe}>Прогресс курса из 100%</Text>
                            </AnimatedButtonShadow>
                        </View>

                    </View>
                </View>
            </AnimatedNavTop>
        </>
    )
}