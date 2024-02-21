import React from "react";
import Carousel from "react-native-new-snap-carousel";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import globalCss from "../../css/globalCss";
import {Dimensions, StyleSheet, Text} from "react-native";

export const CarouselMenu = React.memo(({currentActive, handlePressMenu}) => {
    const menuItems = [
        {title: 'Книги', type: "books"},
        {title: 'Стихи', type: "poetry"},
        {title: 'Диалоги', type: "dialogues"},
    ];

    return (
        <Carousel
            data={menuItems}
            renderItem={({item}) => (
                <AnimatedButtonShadow
                    onPress={() => handlePressMenu(item.type)}
                    styleButton={[globalCss.buttonGry, styles.carouselMenuItem]}
                    permanentlyActiveOpacity={.5}
                    permanentlyActive={currentActive === item.type}
                    disable={currentActive === item.type}
                    shadowColor={"gray"}
                    shadowBorderRadius={7}
                >
                    <Text style={styles.carouselMenuItemText}>{item.title}</Text>
                </AnimatedButtonShadow>
            )}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={120}
            loop={true}
            autoplay={false}
            enableSnap={false}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            inactiveSlideShift={0}
            contentContainerCustomStyle={{paddingLeft: 0, paddingRight: 20, marginBottom: 30}}
        />
    );
})

const styles = StyleSheet.create({
    carouselMenuItemText:{
        textAlign: 'center',
    },
    carouselMenuItem:{
        width: "91%",
        borderRadius: 7,
        marginBottom: 10,
        paddingVertical: "15%",
    }
})