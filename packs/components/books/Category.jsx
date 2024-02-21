import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import globalCss from "../../css/globalCss";
import {formatBooksWord} from "../../utils/Utls";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-native-new-snap-carousel";
import {AnimatedButtonShadow} from "../buttons/AnimatedButtonShadow";
import {SERVER_URL} from "../../utils/Requests";

export const Category = React.memo(({data, type, navTopInfo}) => {
    if (data.length === 0) return null

    const navigation = useNavigation()

    let urlImage = "ru/ru-en/packs/assest/books/read-books/img"
    let screenReading = "BooksReading"

    if (type.currentActive === "poetry") {
        urlImage = "ru/ru-en/packs/assest/books/read-poetry/img"
        screenReading = "PoetryReading"
    } else if (type.currentActive === "dialogues") {
        urlImage = "ru/ru-en/packs/assest/books/read-dialog/img"
        screenReading = "DialogReading"
    }

    return (
        <View>
            <View style={[globalCss.row, globalCss.mb3]}>
                <View>
                    <Text style={styles.titleCategory}>
                        {type.text}
                    </Text>
                    <Text style={styles.totalBooks}>
                        {formatBooksWord(data.length)}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.openCategory}
                    onPress={() => navigation.navigate('BooksCategory', {data: data, type: type, info: navTopInfo})} // Trimite denumirea categoriei la pagina următoare
                    activeOpacity={1}
                >
                    <View style={styles.openCatTxt}>
                        <Text style={styles.catTxt}>
                            см. все
                        </Text>
                        <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.faChevronRight}/>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={globalCss.mb11}>
                <Carousel
                    data={data.slice(0, 10)}
                    renderItem={({item}) => (
                        <View style={styles.cell}>
                            <AnimatedButtonShadow
                                shadowDisplayAnimate={"slide"}
                                styleButton={[styles.card, styles.bgGry]}
                                onPress={() => navigation.navigate(screenReading, {id: item.id, item: item, data: data, info: navTopInfo, type: type})}
                                shadowColor={"gray"}
                                shadowBorderRadius={12}
                            >
                                <Image
                                    source={{
                                        uri: `${SERVER_URL}/${urlImage}/${item.image}`,
                                    }}
                                    style={styles.image}
                                />
                            </AnimatedButtonShadow>
                            <Text style={styles.title}>{item.title}</Text>
                            {item.author && (
                                <Text style={styles.author}>{item.author}</Text>
                            )}
                        </View>
                    )}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={140}
                    loop={false}
                    autoplay={false}
                    inactiveSlideScale={1}
                    firstItem={0}
                    enableSnap={false}
                    contentContainerCustomStyle={{paddingLeft: -10, paddingRight: 30}}
                />
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    titleCategory: {
        fontSize: 19,
        fontWeight: '600',
    },
    totalBooks: {
        fontSize: 14,
    },
    openCategory: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    openCatTxt: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    catTxt: {
        fontSize: 18,
        color: '#008eff',
    },
    faChevronRight: {
        color: '#008eff',
        fontWeight: '400',
        marginTop: 2.5,
    },
    cell: {
        marginRight: '8%',
    },
    card: {
        width: '100%',
        marginBottom: '0%',
        borderRadius: 12,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2
    },
    bgGry: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8'
    },
    image: {
        width: '100%',
        height: 205,
        resizeMode: 'cover',
        borderRadius: 7,
    },
    title: {
        fontSize: 15,
        marginTop: 10,
        fontWeight: 'bold',
        color: 'black',
    },
    author: {
        fontSize: 12,
        color: 'black',
    },
})