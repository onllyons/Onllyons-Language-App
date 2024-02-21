import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import globalCss from './css/globalCss';
import { AnimatedButtonShadow } from "./components/buttons/AnimatedButtonShadow";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
export default function AlphabetScreen({ navigation }) {
    // Starea pentru stocarea datelor preluate
    const [data, setData] = useState([]);

    // Funcția pentru a prelua datele de la backend
    useEffect(() => {
        fetch('https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/alphabet/alphabet_cards.php')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('There was an error!', error));
    }, []);

    return (
        <View style={styles.container}>

            <View style={globalCss.navTabUser}>
                <TouchableOpacity style={globalCss.itemNavTabUserBtnBack}
                                  onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>Английский алфавит</Text>
                </View>
            </View>
 

            <ScrollView contentContainerStyle={{paddingTop: 0, paddingBottom: 200}} style={styles.containerScrollView}>
                <View style={[globalCss.row, styles.containerCards]}>
                    {data.map((item, index) => (
                        <AnimatedButtonShadow
                            key={index}
                            styleContainer={{
                                width: "48%"
                            }}
                            styleButton={[styles.card, styles.bgGry]}
                            shadowColor={"gray"}
                            shadowBorderRadius={6}
                            onPress={() => {
                                navigation.navigate("AlphabetPagesScreen", { url: item.url });
                            }}
                        >
                            <Image
                                source={{
                                    uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/course-read/content/category_images_png/${item.img_png}`
                                }}
                                style={styles.imageStyle}
                            />
                            {/*<Text>{item.title}</Text>*/}
                        </AnimatedButtonShadow>
                    ))}
                </View>

            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    containerScrollView: {
        paddingLeft: "5%",
        paddingRight: '5%',
    },
    containerCards: {
        backgroundColor: 'white',
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

});