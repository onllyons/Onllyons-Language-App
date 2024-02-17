import React, {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import globalCss from "./css/globalCss";
import {useStore} from "./providers/Store";

export default function BooksCategoryScreen({route}) {
    const {getStoredValue, deleteStoredValue} = useStore()
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const {data: transmittedData, type: transmittedType, info: transmittedInfo} = route.params;
    const [visibleItems, setVisibleItems] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [updateState, setUpdateState] = useState(false)

    useEffect(() => {
        setData(transmittedData)
        setTotalItems(transmittedData.length);
    }, [transmittedData]);

    useFocusEffect(
        useCallback(() => {
            const needToUpdateBooksCategory = getStoredValue("needToUpdateBooksCategory")

            if (needToUpdateBooksCategory !== null) {
                deleteStoredValue("needToUpdateBooksCategory")
                setUpdateState(prev => !prev)
            }
        }, [])
    );


    const loadMoreItems = () => {
        if (visibleItems < totalItems) {
            setVisibleItems(visibleItems + 15);
        }
    };

    const getCategoryImageAndText = (categoryValue) => {
        switch (Number(categoryValue)) {
            case 1:
                return {
                    imageSource: require('./images/icon/levelEasy.png'),
                    text: "Начальный уровень"
                };
            case 2:
                return {
                    imageSource: require('./images/icon/levelMedium.png'),
                    text: "Средний уровень"
                };
            case 3:
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
            <TouchableOpacity onPress={() => navigation.navigate('BooksReading', {id: item.id, item: item, info: transmittedInfo})}>
                <View style={[
                    styles.item,
                    // Finished books
                    transmittedType.type === "category" && item.finished && {backgroundColor: "#57cc04"}
                ]}>
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

            {/*<Loader visible={loading}/>*/}

            <View style={globalCss.navTabUser}>
                <TouchableOpacity style={globalCss.itemNavTabUserBtnBack}
                                  onPress={() => navigation.navigate('BooksScreen')}>
                    <FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.blue}/>
                </TouchableOpacity>
                <View style={globalCss.itemNavTabUserTitleCat}>
                    <Text style={globalCss.dataCategoryTitle}>cc{transmittedType.text}</Text>
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
