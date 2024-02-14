import {Image, Text, TouchableOpacity, View} from "react-native";
import globalCss from "../../css/globalCss";
import {
    AnimatedNavTopArrow, AnimatedNavTopContainer,
    AnimatedNavTop,
    useAnimatedNavTop
} from "../AnimatedNavTop";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";

export const NavTop = (props) => {
    return (
        <AnimatedNavTopContainer>
            <NavTopContent {...props}/>
        </AnimatedNavTopContainer>
    )
}

const NavTopContent = ({navTopData}) => {
    const {setStartPosition, toggleNavTopMenu} = useAnimatedNavTop()

    return (
        <>
            <View
                style={globalCss.navTabUser}
                onLayout={event => setStartPosition(event.nativeEvent.layout.height)}
            >
                <View style={globalCss.itemNavTabUser}>
                    <Image
                        source={require("../../images/other_images/nav-top/english.webp")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>EN</Text>
                </View>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("lessonsLearned")}>
                    <Image
                        source={require("../../images/other_images/nav-top/inkwell.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{navTopData.finished}</Text>
                    <AnimatedNavTopArrow id={"lessonsLearned"}>
                        <Image
                            source={require("../../images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUser}>
                    <Image
                        source={require("../../images/other_images/nav-top/flame.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{navTopData.series}</Text>
                </View>
                <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu("knownWords")}>
                    <Image
                        source={require("../../images/other_images/nav-top/flash-card.png")}
                        style={globalCss.imageNavTop}
                    />
                    <Text style={globalCss.dataNavTop}>{navTopData.words}</Text>
                    <AnimatedNavTopArrow id={"knownWords"}>
                        <Image
                            source={require("../../images/icon/arrowTop.png")}
                            style={navDropdown.navTopArrow}
                        />
                    </AnimatedNavTopArrow>
                </TouchableOpacity>
            </View>

            <AnimatedNavTop id={"lessonsLearned"}>
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
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>23 / 557</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTop>

            <AnimatedNavTop id={"knownWords"}>
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
                                <Text style={[navDropdown.fluencyText, globalCss.green]}>11 / 5351</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </AnimatedNavTop>
        </>
    )
}