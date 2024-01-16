import React, {useState, useEffect} from 'react';
import globalCss from './css/globalCss';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import {useAuth} from "./screens/ui/AuthProvider";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import Toast from "react-native-toast-message";

export default function CourseScreen({navigation}) {
    const {isAuthenticated, getUser, logout} = useAuth();
    const user = getUser();

    const [pressedCards, setPressedCards] = useState({});
    const [data, setData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadedCategories, setLoadedCategories] = useState([]);

    useEffect(() => {
        fetch('https://www.language.onllyons.com/ru/ru-en/HackTheSiteHere/packs/app/course_lesson.php')
            .then(response => response.json())
            .then(data => {
                const groupedData = groupByCategory(data);
                setData(groupedData);
                setLoadedCategories(Object.keys(groupedData).slice(0, 1)); // Încarcă doar prima categorie la început
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // Funcție pentru gruparea datelor pe categorii
    const groupByCategory = (data) => {
        return data.reduce((acc, item) => {
            (acc[item.category_url] = acc[item.category_url] || []).push(item);
            return acc;
        }, {});
    };

    // Funcție pentru încărcarea următoarei categorii
    const loadNextCategory = () => {
        const allCategories = Object.keys(data);
        const nextIndex = loadedCategories.length;
        if (nextIndex < allCategories.length) {
            setLoadedCategories([...loadedCategories, allCategories[nextIndex]]);
        }
    };

        // Funcție pentru a verifica dacă utilizatorul a ajuns aproape de sfârșitul listei
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    };

    const onPressIn = (id) => {
        setPressedCards(prevState => ({...prevState, [id]: true}));
    };

    const onPressOut = (id) => {
        setPressedCards(prevState => ({...prevState, [id]: false}));
    };

    return (

    <View>
        <View style={styles.navTabUser}>
        <View style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/english.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>EN</Text>
        </View>
        <View style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/sapphire.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>743</Text>
        </View>
        <View style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/flame.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>4</Text>
        </View>
        <TouchableOpacity style={styles.itemNavTabUser}>
          <Image source={require('./images/other_images/nav-top/star.png')} style={styles.imageNavTop} />
          <Text style={styles.dataNavTop}>4</Text>
        </TouchableOpacity>
      </View>


<ScrollView style={styles.bgCourse} onScroll={({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
        loadNextCategory();
    }
}}
scrollEventThrottle={400}>
    
        <View style={globalCss.container}>
            <View style={styles.contentFlashCards}>
                {loadedCategories.map(category => (
                    <React.Fragment key={category}>
                        {data[category].map((item, index) => (
                            <View
                                    key={item.id}
                                    style={[
                                        {
                                            width: index % 3 === 0 ? '100%' : '50%',
                                        },
                                        globalCss.alignItemsCenter,
                                        globalCss.mb17,
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={[
                                            styles.card,
                                            pressedCards[item.id]
                                                ? [styles.cardPressed, styles.bgGryPressed]
                                                : styles.bgGry,
                                        ]}
                                        onPress={() =>
                                            navigation.navigate('CourseLesson', {url: item.url})
                                        }
                                        onPressIn={() => onPressIn(item.id)}
                                        onPressOut={() => onPressOut(item.id)}
                                        activeOpacity={1}
                                    >
                                        <Text>
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                size={30}
                                                style={styles.iconFlash}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                    <Text>
                                        {item.title}
                                    </Text>
                                </View>
                        ))}
                    </React.Fragment>
                ))}
            </View>
        </View>
</ScrollView>
    </View>

    );
}

const styles = StyleSheet.create({
    bgCourse: {
        backgroundColor: '#d1d1d1',
    },
    card: {
        width: 110,
        height: 110,
        marginBottom: '5%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    cardPressed: {
        shadowOffset: {width: 0, height: 0},
        transform: [{translateY: 4}],
    },
    bgGry: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8',
        shadowColor: '#d8d8d8',
    },
    bgGryPressed: {
        backgroundColor: '#f9f9f9',
        borderColor: '#d8d8d8',
    },
    contentFlashCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },

    navTabUser:{
      width: "100%",
      paddingTop: "10%",
      backgroundColor: "#eeeff0",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
      itemNavTabUser:{
      flexDirection: "row",
      paddingTop: '5%',
      paddingBottom: '5%',
      alignItems: "center",
      justifyContent: 'center',
      flex: 1,
    },
      imageNavTop:{
      width: 28,
      height: 28,
    },
    dataNavTop:{
      fontSize: 16,
      color: '#383838',
      fontWeight: '700',
      marginLeft: '5%',
    },
});
