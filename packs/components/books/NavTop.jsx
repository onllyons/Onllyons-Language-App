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

const NavTopContent = ({data}) => {
    const {setStartPosition} = useAnimatedNavTop()

    return (
        <>
            <View
                style={globalCss.navTabUser}
                onLayout={event => setStartPosition(event.nativeEvent.layout.height)}
            >
                <NavTopItemLanguage/>
                <NavTopItem
                    text={data.finished.length}
                    id={"booksReadedAnalytics"}
                    image={require("../../images/other_images/nav-top/book.png")}
                />
                <NavTopItemSeries/>
                <NavTopItem
                    text={data.saved.length}
                    id={"booksSavedAnalytics"}
                    image={require("../../images/other_images/nav-top/bookmark.png")}
                />
            </View>

            <NavTopItemLanguageMenu/>
            <NavTopItemSeriesMenu/>

            <AnimatedNavTopMenu id={"booksReadedAnalytics"}>
                <View style={navDropdown.containerSentences}>

                    <Text style={navDropdown.titleh5}>Прочитанные книги</Text>
                    <Text style={navDropdown.titleh6}>Сколько книг я уже прочитал?</Text>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainerRead}>
                                <Image
                                    source={require('../../images/other_images/educationReading.png')}
                                    style={navDropdown.booksImgCard}
                                />
                            </View>
                            <View style={navDropdown.dividerCourseData}/>
                            <View style={navDropdown.fluencyContainer}>
                                <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{data.finished.length} / {data.allBooks}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>

            <AnimatedNavTopMenu id={"booksSavedAnalytics"}>
                <View style={navDropdown.containerSentences}>

                    <Text style={navDropdown.titleh5}>Сохранённые книги</Text>
                    <Text style={navDropdown.titleh6}>Общее количество закладок</Text>

                    <View style={navDropdown.containerCourseData}>
                        <View style={navDropdown.cardCourseData}>
                            <View style={navDropdown.iconContainerRead}>
                                <Image
                                    source={require('../../images/other_images/bookmarks.png')}
                                    style={navDropdown.booksImgCard}
                                />
                            </View>
                            <View style={navDropdown.dividerCourseData}/>
                            <View style={navDropdown.fluencyContainer}>
                                <Text style={navDropdown.iconSubText}>ПРОГРЕСС</Text>
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{data.saved.length} / {data.allBooks}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>
        </>
    )
}