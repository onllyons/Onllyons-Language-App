import React, { useState, useRef, useEffect } from "react";
import globalCss from "./css/globalCss";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "./screens/ui/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Toast from "react-native-toast-message";

export default function CourseScreen({ navigation }) {
  const { isAuthenticated, getUser, logout } = useAuth();
  const user = getUser();

  const [pressedCards, setPressedCards] = useState({});
  const [data, setData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] = useState('');
  const categoryRefs = useRef({});
  const scrollViewRef = useRef(null);


const handleScroll = (event) => {
  const scrollPosition = event.nativeEvent.contentOffset.y;
  let currentCategoryIndex = -1;

  for (let i = 0; i < categoryHeights.current.length; i++) {
    if (scrollPosition >= (categoryHeights.current[i - 1] || 0) && scrollPosition < categoryHeights.current[i]) {
      currentCategoryIndex = i;
      break;
    }
  }

  if (currentCategoryIndex !== -1 && data[loadedCategories[currentCategoryIndex]]) {
    setCurrentCategoryName(data[loadedCategories[currentCategoryIndex]].var_idtest_1);
  }
};





useEffect(() => {
    fetch("https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_lesson.php")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const groupedData = groupByCategory(data);
        setData(groupedData);
        const initialCategories = Object.keys(groupedData).slice(0, 1);
        setLoadedCategories(initialCategories);
        if (initialCategories.length > 0) {
          setCurrentCategoryName(groupedData[initialCategories[0]].var_idtest_1);
        }
      })
      .catch((error) => {
        console.error("Eroare:", error);
      });
  }, []);

useEffect(() => {
    if (loadedCategories.length > 0 && data) {
      setCurrentCategoryName(data[loadedCategories[loadedCategories.length - 1]].var_idtest_1);
    }
  }, [loadedCategories, data]);




    // Funcție pentru gruparea datelor pe categorii
const groupByCategory = (data) => {
  return data.reduce((acc, item) => {
    // Crează o nouă categorie dacă nu există
    if (!acc[item.category_url]) {
      acc[item.category_url] = {
        items: [],
        var_idtest_1: item.var_idtest_1, // Stochează var_idtest_1 pentru fiecare categorie
      };
    }

    // Adaugă item-ul la categoria respectivă
    acc[item.category_url].items.push(item);

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
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
    );
  };

  const onPressIn = (id) => {
    setPressedCards((prevState) => ({ ...prevState, [id]: true }));
  };

  const onPressOut = (id) => {
    setPressedCards((prevState) => ({ ...prevState, [id]: false }));
  };

  const getMarginLeftForCard = (index) => {
      const pattern = [40, 30, 20, 30, 40, 50]; // Modelul pentru marginLeft
      return pattern[index % 6]; // Repetă modelul la fiecare 6 carduri
  };

  const categoryHeights = useRef([]);

const measureCategoryHeight = (index) => {
  categoryRefs.current[index].measure((x, y, width, height, pageX, pageY) => {
    categoryHeights.current[index] = (categoryHeights.current[index - 1] || 0) + height;
    if (index === loadedCategories.length - 1) {
      // Toate înălțimile au fost calculate
    }
  });
};



  return (
    <View>
      <View style={styles.navTabUser}>
        <View style={styles.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/english.webp")}
            style={styles.imageNavTop}
          />
          <Text style={styles.dataNavTop}>EN</Text>
        </View>
        <View style={styles.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/sapphire.webp")}
            style={styles.imageNavTop}
          />
          <Text style={styles.dataNavTop}>743</Text>
        </View>
        <View style={styles.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/flame.png")}
            style={styles.imageNavTop}
          />
          <Text style={styles.dataNavTop}>4</Text>
        </View>
        <TouchableOpacity style={styles.itemNavTabUser}>
          <Image
            source={require("./images/other_images/nav-top/star.png")}
            style={styles.imageNavTop}
          />
          <Text style={styles.dataNavTop}>4</Text>
        </TouchableOpacity>
      </View>

       <View style={styles.infoCourseSubject}>
        <Text>{currentCategoryName}</Text> 
      </View>

      <ScrollView
      ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 190, paddingBottom: 20 }}
        style={styles.bgCourse}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadNextCategory();
          }
        }}
        scrollEventThrottle={400}
      > 

        

        <View style={styles.container}>




          <View style={styles.contentFlashCards}>
            {loadedCategories.map((category, index) => (
              <React.Fragment key={category} 
              ref={el => (categoryRefs.current[index] = el)}
                onLayout={() => measureCategoryHeight(index)}>


              <View style={styles.categoryTitleBg}>
                 <Text style={styles.categoryTitle}>
                  {data[category].var_idtest_1} 
                </Text>
                </View>

                {data[category].items.map((item, index) => (
                 <TouchableOpacity
                   key={item.id}
                   style={[
                    {
                        marginLeft: `${getMarginLeftForCard(index)}%`,
                    },
                     styles.card,
                     pressedCards[item.id]
                       ? [styles.cardPressed, styles.bgGryPressed]
                       : styles.bgGry,
                   ]}
                   onPress={() =>
                     navigation.navigate("CourseLesson", { url: item.url })
                   }
                   onPressIn={() => onPressIn(item.id)}
                   onPressOut={() => onPressOut(item.id)}
                   activeOpacity={1}
                 >
                   <Text>
                     <FontAwesomeIcon
                       icon={faStar}
                       size={18}
                       style={styles.iconFlash}
                     />
                   </Text>
                   <Text>{item.title}</Text>

                 </TouchableOpacity>
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
  container: {},
  bgCourse: {
    backgroundColor: "#ffffff",
  },
  card: {
    width: 70,
    height: 56,
    marginBottom: "5%",
    borderRadius: 300,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },

  infoCourseSubject: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    right: '5%',
    width: '90%',
    height: 140,
    backgroundColor: '#57cc02',
    borderRadius: 13,
    shadowOffset: { width: 0, height: 8 },
    zIndex: 1,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: '#47a40b',
    elevation: 0,
    justifyContent: 'center',
  },


  cardPressed: {
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateY: 4 }],
  },
  bgGry: {
    backgroundColor: "#e5e5e5",
    shadowColor: "#b7b7b7",
  },
  bgGryPressed: {
    backgroundColor: "#f9f9f9",
    borderColor: "#d8d8d8",
  },
  contentFlashCards: {
    flexDirection: "column",
    // flexWrap: "wrap",
    // justifyContent: "center",
    // alignItems: "center",
    // alignContent: "center",
  },
  navTabUser: {
    width: "100%",
    paddingTop: "10%",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingTop: 10,
    paddingLeft: 10,
  },
  itemNavTabUser: {
    flexDirection: "row",
    paddingTop: "5%",
    paddingBottom: "5%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  imageNavTop: {
    width: 28,
    height: 28,
    resizeMode: 'contain'
  },
  dataNavTop: {
    fontSize: 16,
    color: "#383838",
    fontWeight: "700",
    marginLeft: "5%",
  },
});
