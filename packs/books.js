import React, {useState, useMemo, useRef, useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions, RefreshControl
} from 'react-native';
import Carousel from 'react-native-new-snap-carousel';
import Loader from "./components/Loader";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";

// fonts
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// icons
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';

import globalCss from './css/globalCss';

// for nav top
import {NavTop} from "./components/books/NavTop";
import {AnimatedButtonShadow} from "./components/buttons/AnimatedButtonShadow";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {formatBooksWord} from "./utils/Utls";
import {useStore} from "./providers/Store";

export default function BooksScreen({navigation}) {
    const {deleteStoredValue, getStoredValue} = useStore()
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateState, setUpdateState] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const booksInfo = useRef({
        finished: [],
        saved: [],
        allBooks: 0
    })

    useFocusEffect(
        useCallback(() => {
            const needToUpdateBooksCategory = getStoredValue("needToUpdateBooks")

            if (needToUpdateBooksCategory !== null) {
                deleteStoredValue("needToUpdateBooks")
                setUpdateState(prev => !prev)
            }
        }, [])
    );

    useMemo(() => {
        if (!loading && !refreshing) return

        console.log("asdasda")

        sendDefaultRequest(`${SERVER_AJAX_URL}/books/get_books.php`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                booksInfo.current = data.booksInfo

                setData(data.data);

                const uniqueCategories = [...new Set(data.data.map(item => item.type_category))];
                setCategories(uniqueCategories);
            })
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false)
                    setLoading(false)
                }, 1)
            }); // Dezactivează Loader-ul
    }, [refreshing]);

    const getCategoryBooks = (category) => {
        return data.filter(item => item.type_category === category);
    };

    const getBooksSaved = () => {
        return data.filter(item => item.saved);
    };

    const getBooksFinished = () => {
        return data.filter(item => item.finished);
    };

    return (
        <View style={styles.container}>

            <NavTop loading={loading} data={booksInfo.current}/>

            <ScrollView
                contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 0,
                    paddingRight: 20,
                    paddingLeft: 20
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => setRefreshing(true)}
                    />
                }
            >
                <Loader visible={loading}/>
                <CarouselMenu navigation={navigation} />
                <Category data={getBooksSaved()} type={{type: "saved", text: "Мои книги"}} booksInfo={booksInfo.current}/>
                {categories.map((category, index) => (
                    <Category data={getCategoryBooks(category)} type={{type: "category", text: category}} key={index} booksInfo={booksInfo.current}/>
                ))}
                <Category data={getBooksFinished()} type={{type: "finished", text: "Прочитанные книги"}} booksInfo={booksInfo.current}/>
            </ScrollView>
        </View>
    );
}

const CarouselMenu = ({ navigation }) => {
    const menuItems = [
        { title: 'Книги', onPress: () => navigation.navigate('BooksScreen') },
        { title: 'Стихи', onPress: () => navigation.navigate('PoetryScreen') },
        { title: 'Диалоги', onPress: () => navigation.navigate('DialoguesScreen') },
    ];


    return (
        <Carousel
            data={menuItems}
            renderItem={({ item }) => (
                <View style={styles.carouselMenuView}>
                    <TouchableOpacity onPress={item.onPress} style={styles.carouselMenuItem}>
                        <Text style={styles.carouselMenuItemText}>{item.title}</Text>
                    </TouchableOpacity>
                </View>
            )}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={120}
            loop={true}
            autoplay={false}
            inactiveSlideScale={1}
            enableSnap={false}
            contentContainerCustomStyle={{ paddingLeft: 0, paddingRight: 0, marginBottom: 40, }}
        />
    );
};

const Category = React.memo(({data, type, booksInfo}) => {
    if (data.length === 0) return null

    const navigation = useNavigation()

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
                    onPress={() => navigation.navigate('BooksCategory', {data: data, type: type, info: booksInfo})} // Trimite denumirea categoriei la pagina următoare
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
                                onPress={() => navigation.navigate('BooksReading', {id: item.id, item: item, info: booksInfo})}
                                shadowColor={"gray"}
                                shadowBorderRadius={12}
                            >
                                <Image
                                    source={{
                                        uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/img/${item.image}`,
                                    }}
                                    style={styles.image}
                                />
                            </AnimatedButtonShadow>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.author}>{item.author}</Text>
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
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    carouselMenuView:{
        width: "100%",
        padding: "0%",
        margin: "0%",
    },
    carouselMenuItemText:{
        textAlign: 'center',
    },
    carouselMenuItem:{
        backgroundColor: 'red',
        width: "91%",
        borderRadius: "11%",
        paddingVertical: "15%",
    },
    contentBooks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: '100%',
        height: 205,
        resizeMode: 'cover',
        borderRadius: 7,
    },
    titleCategory: {
        fontSize: 19,
        fontWeight: '600',
    },
    totalBooks: {
        fontSize: 14,
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


});
