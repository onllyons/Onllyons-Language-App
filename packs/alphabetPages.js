import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Carousel from "react-native-new-snap-carousel";
import { AnimatedButtonShadow } from "./components/buttons/AnimatedButtonShadow";
import globalCss from './css/globalCss';

const {width} = Dimensions.get("window");
export default function AlphabetPagesScreen() {
    const route = useRoute();
    const { url } = route.params;
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/alphabet/alphabet_page_content.php')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => item.url === url);
                setData(filteredData);
            })
            .catch(error => console.error('There was an error!', error));
    }, [url]);

    // Funcția pentru redarea itemilor în Carousel
    const renderItem = ({item, index}) => (
        <View style={styles.slide}>
            <View style={styles.groupEng}>
                <Text style={styles.word_en}>{item.word_en}</Text>

                <Text style={ styles.tophoneticsAmerican}>
                    audio: /ru/ru-en/packs/assest/alphabet/audio/{item.transcription}
                </Text>

                <Text style={ styles.tophoneticsAmerican}>
                    USA: / {item.transcription} /
                </Text>
            </View>


            <Text style={styles.word_ru}>{item.word_ru}</Text>
        </View>
    );

    return (
        <View style={styles.swiperContent}>
            
            <View style={styles.carousel}>
                <Carousel
                    data={data} // Furnizează datele la Carousel
                    renderItem={renderItem} // Specifică cum să fie redat fiecare item
                    sliderWidth={width}
                    itemWidth={width - 70}
                    layout={"default"}
                    loop={false}
                />
            </View>

            <View style={styles.swiperButtonsContainer}>
                <AnimatedButtonShadow
                    shadowColor={"blue"}
                    styleButton={[
                        globalCss.button,
                        globalCss.buttonBlue
                    ]}
                >
                    <Text style={[styles.buttonTextNext, globalCss.textUpercase]}>
                        Продолжить
                    </Text>
                </AnimatedButtonShadow>
            </View>


        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
    },
    carousel: {
        height: "75%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingTop: "12%",
    },
    swiperContent: {
        height: "100%",
    },
    containerCards: {
        backgroundColor: 'white',
    },
    titlePage: {
        marginTop: '13%',
        fontSize: 30,
        fontWeight: '600',
        color: '#333333',
    },
    card: {
        width: '100%',
        height: 150,
        marginBottom: 15,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        marginVertical: '2%',
    },
    bgGry: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8'
    },
    imageStyle:{
        width: 100,
        height: 70,
        resizeMode: 'contain',
    },
        slide: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        height: "90%",
    },
        groupEng: {
        marginBottom: "10%",
    },
        word_en: {
        fontSize: 30,
        color: "#535353",
        textTransform: "capitalize",
        fontWeight: "500",
        textAlign: "center",
    },
    tophoneticsBritish: {
        textAlign: "center",
        color: "#0036ff",
        fontWeight: "300",
        fontSize: 20,
    },
    tophoneticsAmerican: {
        textAlign: "center",
        color: "#0036ff",
        fontWeight: "300",
        fontSize: 20,
    },
    word_ru: {
        fontSize: 30,
        color: "#535353",
        textTransform: "capitalize",
        fontWeight: "500",
        textAlign: "center",
    },
    swiperButtonsContainer: {
        justifyContent: "center",
        paddingHorizontal: "9%",
        width: '100%',

    },
        buttonTextNext: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    },

});