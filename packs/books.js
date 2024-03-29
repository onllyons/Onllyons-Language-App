import React, {useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import Loader from "./components/Loader";
import {sendDefaultRequest, SERVER_AJAX_URL} from "./utils/Requests";

// for nav top
import {NavTop} from "./components/books/NavTop";
import {useFocusEffect} from "@react-navigation/native";
import {useStore} from "./providers/StoreProvider";
import {CarouselMenu} from "./components/books/CarouselMenu";
import {Category} from "./components/books/Category";

export default function BooksScreen({navigation}) {
    const {deleteStoredValue, getStoredValue, setStoredValueAsync} = useStore()
    const [data, setData] = useState({
        books: [],
        poetry: [],
        dialogues: []
    });
    const [currentActive, setCurrentActive] = useState("books")
    const [categories, setCategories] = useState({
        books: [],
        poetry: [],
        dialogues: []
    });
    const [loading, setLoading] = useState(false);
    const [updateState, setUpdateState] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const navTopData = useRef({
        books: {
            finished: [],
            saved: [],
            all: 0
        },
        poetry: {
            finished: [],
            saved: [],
            all: 0
        },
        dialogues: {
            finished: [],
            saved: [],
            all: 0
        }
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
        const booksData = getStoredValue("books_books", true)
        const poetryData = getStoredValue("books_poetry", true)
        const dialoguesData = getStoredValue("books_dialogues", true)

        const newData = data
        const newCategories = categories

        if (booksData) {
            navTopData.current.books = booksData.navTopData
            newData.books = booksData.data
            newCategories.books = booksData.uniqueCategories
        }
        if (poetryData) {
            navTopData.current.poetry = poetryData.navTopData
            newData.poetry = poetryData.data
            newCategories.poetry = poetryData.uniqueCategories
        }
        if (dialoguesData) {
            navTopData.current.dialogues = dialoguesData.navTopData
            newData.dialogues = dialoguesData.data
            newCategories.dialogues = dialoguesData.uniqueCategories
        }

        setCategories(newCategories)
        setData(newData)
    }, []);

    useEffect(() => {
        if (!refreshing && data[currentActive].length !== 0) return;

        setLoading(true)

        let url = "books/get_books.php"

        if (currentActive === "poetry") url = "poetry/get_all_poetry.php"
        else if (currentActive === "dialogues") url = "dialogues/get_dialogues.php"

        sendDefaultRequest(`${SERVER_AJAX_URL}/${url}`,
            {},
            navigation,
            {success: false}
        )
            .then(data => {
                navTopData.current[currentActive] = data.navTopData

                setData(prev => ({...prev, [currentActive]: data.data}));
                const uniqueCategories = [...new Set(data.data.map(item => item.type_category))];
                setCategories(prev => ({...prev, [currentActive]: uniqueCategories}));

                setStoredValueAsync(`books_${currentActive}`, {
                    data: data.data,
                    navTopData: data.navTopData,
                    uniqueCategories: uniqueCategories
                })
                    .then(() => {})
                    .catch(() => {})
            })
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false)
                    setLoading(false)
                }, 300)
            }); // Dezactivează Loader-ul
    }, [refreshing, currentActive]);

    const handlePressMenu = useCallback(value => {
        setCurrentActive(value)
    }, [])

    const getCategoryBooks = (category) => {
        return data[currentActive].filter(item => item.type_category === category);
    };

    const getBooksSaved = () => {
        return data[currentActive].filter(item => item.saved);
    };

    const getBooksFinished = () => {
        return data[currentActive].filter(item => item.finished);
    };

    let textSaved = "Мои книги"
    let textFinished = "Прочитанные книги"

    if (currentActive === "poetry") {
        textSaved = "Мои стихи"
        textFinished = "Прочитанные стихи"
    } else if (currentActive === "dialogues") {
        textSaved = "Мои диалоги"
        textFinished = "Прочитанные диалоги"
    }

    return (
        <View style={styles.container}>
            <Loader notFull={true} visible={loading}/>

            <NavTop loading={loading} currentActive={currentActive} data={navTopData.current[currentActive]}/>

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
                <CarouselMenu currentActive={currentActive} handlePressMenu={handlePressMenu}/>
                <Category key={`${currentActive}-saved`} data={getBooksSaved()} type={{type: "saved", currentActive: currentActive, text: textSaved}} navTopInfo={navTopData.current[currentActive]}/>
                {categories[currentActive].map((category, index) => (
                    <Category key={`${currentActive}-category-${index}`} data={getCategoryBooks(category)} type={{type: "category", currentActive: currentActive, text: category}} navTopInfo={navTopData.current[currentActive]}/>
                ))}
                <Category key={`${currentActive}-finished`} data={getBooksFinished()} type={{type: "finished", currentActive: currentActive, text: textFinished}} navTopInfo={navTopData.current[currentActive]}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});
