import globalCss from "../../css/globalCss";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {AnimatedNavTopArrow, useAnimatedNavTop} from "./AnimatedNavTopMenu";
import {stylesnav_dropdown as navDropdown} from "../../css/navDropDownTop.styles";
import React, {useEffect, useState} from "react";
import ContentLoader from "react-native-easy-content-loader";
import {useStore} from "../../providers/StoreProvider";

export const NavTopItem = ({
    text,
    image,
    id,
    loading = false,
    imageArrow = require("../../images/icon/arrowTop.png")
}) => {
    const {toggleNavTopMenu} = useAnimatedNavTop()

    return (
        <TouchableOpacity style={globalCss.itemNavTabUser} onPress={() => {
            if (!loading) toggleNavTopMenu(id)
        }}>
            <Image
                source={image}
                style={globalCss.imageNavTop}
            />
            {loading ? (<NavTopTextLoader/>) : (
                <Text style={globalCss.dataNavTop}>{text}</Text>
            )}

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

const NavTopTextLoader = () => {
    return (
        <View>
            <ContentLoader active pRows={1} pWidth={14} pHeight={18} title={false} />
        </View>
    )
}

export const NavTopItemLanguage = ({loading = false}) => {
    return (
        <NavTopItem
            text={"EN"}
            loading={loading}
            id={"language"}
            image={require("../../images/other_images/nav-top/english.webp")}
        />
    )
}

export const NavTopItemSeries = React.memo(({text, loading = false}) => {
    const {getStoredValue} = useStore()
    const [currentSeries, setCurrentSeries] = useState(0)

    useEffect(() => {
        if (text) {
            setCurrentSeries(text)
        } else {
            const courseData = getStoredValue("courseData", true)

            if (courseData && courseData.seriesData) setCurrentSeries(courseData.seriesData.currentSeries)
        }
    }, [text]);

    return (
        <NavTopItem
            loading={loading}
            text={currentSeries}
            id={"series"}
            image={require("../../images/other_images/nav-top/flame.png")}
        />
    )
})