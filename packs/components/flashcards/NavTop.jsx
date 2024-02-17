import {Image, Text, View} from "react-native";
import globalCss from "../../css/globalCss";
import {
    AnimatedNavTopContainer,
    AnimatedNavTopMenu,
    useAnimatedNavTop
} from "../navTop/AnimatedNavTopMenu";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";
import {NavTopItem, NavTopItemLanguage, NavTopItemSeries} from "../navTop/NavTopItem";
import React from "react";
import {NavTopItemLanguageMenu, NavTopItemSeriesMenu} from "../navTop/NavTopMenu";

export const NavTop = (props) => {
    return (
        <AnimatedNavTopContainer>
            <NavTopContent {...props}/>
        </AnimatedNavTopContainer>
    )
}

const NavTopContent = ({data, loading}) => {
    const {setStartPosition} = useAnimatedNavTop()

    return (
        <>
            <View
                style={globalCss.navTabUser}
                onLayout={event => setStartPosition(event.nativeEvent.layout.height)}
            >
                <NavTopItemLanguage loading={loading}/>
                <NavTopItem
                    loading={loading}
                    text={data.finished}
                    id={"lessons"}
                    image={require("../../images/other_images/nav-top/inkwell.png")}
                />
                <NavTopItemSeries loading={loading}/>
                <NavTopItem
                    loading={loading}
                    text={data.finishedWords}
                    id={"knownWords"}
                    image={require("../../images/other_images/nav-top/flash-card.png")}
                />
            </View>

            <NavTopItemLanguageMenu/>
            <NavTopItemSeriesMenu/>

            <AnimatedNavTopMenu id={"lessons"}>
                <View style={navDropdown.containerSentences}>

                    <Text style={navDropdown.titleh5}>Пройденные уроки</Text>
                    <Text style={navDropdown.titleh6}>Сколько уроков я прошёл?</Text>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainerRead}>
                                <Image
                                    source={require('../../images/other_images/knowledge.png')}
                                    style={navDropdown.booksImgCard}
                                />
                            </View>
                            <View style={navDropdown.dividerCourseData} />
                            <View style={navDropdown.fluencyContainer}>
                                <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{data.finished} / {data.allLessons}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>

            <AnimatedNavTopMenu id={"knownWords"}>
                <View style={navDropdown.containerSentences}>

                    <Text style={navDropdown.titleh5}>Изученные слова</Text>
                    <Text style={navDropdown.titleh6}>Сколько слов я изучил?</Text>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainerRead}>
                                <Image
                                    source={require('../../images/other_images/tasks.png')}
                                    style={navDropdown.booksImgCard}
                                />
                            </View>
                            <View style={navDropdown.dividerCourseData} />
                            <View style={navDropdown.fluencyContainer}>
                                <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{data.finishedWords} / {data.allWords}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>
        </>
    )
}