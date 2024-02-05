import React, {useEffect, useState} from "react";
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import Loader from "./components/Loader";
import globalCss from "./css/globalCss";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";

export default function BooksCategoryScreen({route}) {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const {category} = route.params;
    const [loading, setLoading] = useState(false);
    const [visibleItems, setVisibleItems] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setLoading(true);

        console.log("---------" + category + "---------")
        sendDefaultRequest(`${SERVER_AJAX_URL}/books/get_books.php`,
            {category: category},
            navigation,
            {success: false}
        )
            .then(({data}) => {
                setData(data);
                setTotalItems(data.length);
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 1)
            });
    }, [category]);

    const loadMoreItems = () => {
        if (visibleItems < totalItems) {
            setVisibleItems(visibleItems + 15);
        }
    };

    const getCategoryImageAndText = (categoryValue) => {
        switch (categoryValue) {
            case "1":
                return {
                    imageSource: require('./images/icon/levelEasy.png'),
                    text: "Начальный уровень"
                };
            case "2":
                return {
                    imageSource: require('./images/icon/levelMedium.png'),
                    text: "Средний уровень"
                };
            case "3":
                return {
                    imageSource: require('./images/icon/levelHard.png'),
                    text: "Продвинутый уровень"
                };
            default:
                return {
                    imageSource: null,
                    text: ""
                };
        }
    };

    const renderItem = ({item}) => {
        const categoryInfo = getCategoryImageAndText(item.category);

        return (
            <TouchableOpacity onPress={() => navigation.navigate('BooksReading', {id: item.id})}>
                <View style={styles.item}>
                    <Image
                        source={{
                            uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/${item.image}`,
                        }}
                        style={styles.image}
                    />
                    <View>
                        <Text style={styles.author}>{item.author}</Text>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.levelHard}>
                            <Image
                                source={categoryInfo.imageSource}
                                style={styles.levelHardImg}
                            />
                            <Text style={styles.levelHardTxt}>{categoryInfo.text}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>

            <Loader visible={loading}/>

            <View style={globalCss.navTabUser}>
                <TouchableOpacity style={globalCss.itemNavTabUserBtnBack}
                                  onPress={() => navigation.navigate('BooksScreen')}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>{category}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{paddingTop: 20, paddingBottom: 0, paddingRight: 20, paddingLeft: 20}}
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                        loadMoreItems();
                    }
                }}
                scrollEventThrottle={400}
            >
                {data.slice(0, visibleItems).map((item) => (
                    <View key={item.id}>
                        {renderItem({item})}
                    </View>
                ))}
            </ScrollView>


        </View>
    );
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        marginBottom: '10%',
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: '26%',
        height: 130,
        borderRadius: 15,
        marginRight: 10,
    },
    title: {
        maxWidth: '90%',
        fontSize: 17,
        marginTop: '2%',
        fontWeight: "bold",
    },
    author: {
        fontSize: 14,
        marginTop: '2%',
        color: "gray",
    },
    levelHard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%',
        alignContent: 'flex-start',
    },
    levelHardImg: {
        width: 25,
        height: 25,
    },
    levelHardTxt: {
        marginLeft: '3%'
    },

});
