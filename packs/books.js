import React, {useState, useMemo, useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions
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
import {useNavigation} from "@react-navigation/native";
import {formatBooksWord} from "./utils/Utls";

export default function BooksScreen({navigation}) {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const booksInfo = useRef({
        finished: [],
        saved: [],
        allBooks: 0
    })

    useMemo(() => {
        setLoading(true);

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
                setTimeout(() => setLoading(false), 1)
            }); // Dezactivează Loader-ul
    }, []);

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

            <NavTop data={booksInfo.current}/>

            <ScrollView contentContainerStyle={{paddingTop: 20, paddingBottom: 0, paddingRight: 20, paddingLeft: 20}}>
                <Loader visible={loading}/>
                <Category data={getBooksSaved()} type={{type: "saved", text: "Мои книги"}}/>
                {categories.map((category, index) => (
                    <Category data={getCategoryBooks(category)} type={{type: "category", text: category}} key={index}/>
                ))}
                <Category data={getBooksFinished()} type={{type: "finished", text: "Прочитанные книги"}}/>
            </ScrollView>
        </View>
    );
}

const Category = React.memo(({data, type}) => {
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
                    onPress={() => navigation.navigate('BooksCategory', {data: data, type: type})} // Trimite denumirea categoriei la pagina următoare
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
                                styleButton={[styles.card, styles.bgGry]}
                                onPress={() => navigation.navigate('BooksReading', {id: item.id})}
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
        borderColor: '#d8d8d8',
        shadowColor: '#d8d8d8',
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
