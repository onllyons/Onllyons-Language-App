import React from "react";
import Carousel from "react-native-new-snap-carousel";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import globalCss from "../../css/globalCss";
import {Dimensions, StyleSheet, Text} from "react-native";
import {useNavigation} from "@react-navigation/native";

export const CarouselMenu = React.memo(() => {
    const navigation = useNavigation()

    const menuItems = [
        {title: 'Книги', onPress: () => navigation.navigate('BooksScreen')},
        {title: 'Стихи', onPress: () => navigation.navigate('PoetryScreen')},
        {title: 'Диалоги', onPress: () => navigation.navigate('DialoguesScreen')},
    ];

    return (
        <Carousel
            data={menuItems}
            renderItem={({item}) => (
                <AnimatedButtonShadow
                    onPress={item.onPress}
                    styleButton={[globalCss.buttonGry, styles.carouselMenuItem]}
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
            inactiveSlideScale={1}
            enableSnap={false}
            contentContainerCustomStyle={{paddingLeft: 0, paddingRight: 20, marginBottom: 40}}
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
        paddingVertical: "15%",
    }
})