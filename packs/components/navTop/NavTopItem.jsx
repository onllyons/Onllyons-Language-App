import globalCss from "../../css/globalCss";
import {Image, Text, TouchableOpacity} from "react-native";
import {AnimatedNavTopArrow, useAnimatedNavTop} from "./AnimatedNavTopMenu";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NavTopItem = ({
    text,
    image,
    id,
    imageArrow = require("../../images/icon/arrowTop.png")
}) => {
    const {toggleNavTopMenu} = useAnimatedNavTop()

    return (
        <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => toggleNavTopMenu(id)}>
            <Image
                source={image}
                style={globalCss.imageNavTop}
            />
            <Text style={globalCss.dataNavTop}>{text}</Text>

            {imageArrow && (
                <AnimatedNavTopArrow id={id}>
                    <Image
                        source={require("../../images/icon/arrowTop.png")}
                        style={navDropdown.navTopArrow}
                    />
                </AnimatedNavTopArrow>
            )}
        </TouchableOpacity>
    )
}

export const NavTopItemLanguage = () => {
    return (
        <NavTopItem
            text={"EN"}
            id={"language"}
            image={require("../../images/other_images/nav-top/english.webp")}
        />
    )
}

export const NavTopItemSeries = React.memo(({text}) => {
    const [currentSeries, setCurrentSeries] = useState(0)

    useEffect(() => {
        if (text) {
            setCurrentSeries(text)
        } else {
            AsyncStorage.getItem("seriesData")
                .then(textData => {
                    if (textData === null) return

                    const parsedData = JSON.parse(textData)
                    setCurrentSeries(parsedData && parsedData.currentSeries ? parsedData.currentSeries : 0)
                })
        }
    }, [text]);

    return (
        <NavTopItem
            text={currentSeries}
            id={"series"}
            image={require("../../images/other_images/nav-top/flame.png")}
        />
    )
})