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

const NavTopContent = ({data, currentActive, loading}) => {
    const {setStartPosition} = useAnimatedNavTop()

    const navTopMenuText = {
        books: {
            finished: {
                title: "Прочитанные книги",
                subtitle: "Сколько книг я уже прочитал?"
            },
            saved: {
                title: "Сохранённые книги"
            }
        },
        poetry: {
            finished: {
                title: "Прочитанные стихи",
                subtitle: "Сколько стихов я уже прочитал?"
            },
            saved: {
                title: "Сохранённые стихи"
            }
        },
        dialogues: {
            finished: {
                title: "Прочитанные диалоги",
                subtitle: "Сколько диалогов я уже прочитал?"
            },
            saved: {
                title: "Сохранённые диалоги"
            }
        }
    }

    return (
        <>
            <View
                style={globalCss.navTabUser}
                onLayout={event => setStartPosition(event.nativeEvent.layout.height)}
            >
                <NavTopItemLanguage loading={loading}/>
                <NavTopItem
                    loading={loading}
                    text={data.finished.length}
                    id={"booksReadedAnalytics"}
                    image={require("../../images/other_images/nav-top/book.png")}
                />
                <NavTopItemSeries loading={loading}/>
                <NavTopItem
                    loading={loading}
                    text={data.saved.length}
                    id={"booksSavedAnalytics"}
                    image={require("../../images/other_images/nav-top/bookmark.png")}
                />
            </View>

            <NavTopItemLanguageMenu/>
            <NavTopItemSeriesMenu/>

            <AnimatedNavTopMenu id={"booksReadedAnalytics"}>
                <View style={navDropdown.containerSentences}>

                    <Text style={navDropdown.titleh5}>{navTopMenuText[currentActive].finished.title}</Text>
                    <Text style={navDropdown.titleh6}>{navTopMenuText[currentActive].finished.subtitle}</Text>

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
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{data.finished.length} / {data.all}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>

            <AnimatedNavTopMenu id={"booksSavedAnalytics"}>
                <View style={navDropdown.containerSentences}>

                    <Text style={navDropdown.titleh5}>{navTopMenuText[currentActive].saved.title}</Text>
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
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>{data.saved.length} / {data.all}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTopMenu>
        </>
    )
}