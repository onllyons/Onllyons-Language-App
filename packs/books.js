import React, {useState, useMemo, useRef, useCallback} from 'react';
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
import {useStore} from "./providers/Store";
import {CarouselMenu} from "./components/books/CarouselMenu";
import {Category} from "./components/books/Category";

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
                <CarouselMenu/>
                <Category data={getBooksSaved()} type={{type: "saved", screenType: "Books", text: "Мои книги"}} navTopInfo={booksInfo.current}/>
                {categories.map((category, index) => (
                    <Category data={getCategoryBooks(category)} type={{type: "category", screenType: "Books", text: category}} key={index} navTopInfo={booksInfo.current}/>
                ))}
                <Category data={getBooksFinished()} type={{type: "finished", screenType: "Books", text: "Прочитанные книги"}} navTopInfo={booksInfo.current}/>
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
