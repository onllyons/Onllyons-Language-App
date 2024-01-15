import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import globalCss from "./css/globalCss";

const { width } = Dimensions.get("window");

export default function BooksScreen({ navigation }) {
  const goBackToBooks = () => {
    navigation.navigate("MenuBooksReading");
  };

  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const route = useRoute();
  const url = route.params.url;


  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const containerHeight = event.nativeEvent.layoutMeasurement.height;

    const newScrollY = offsetY < 0 ? 0 : offsetY;

    setScrollY(newScrollY);
    setContentHeight(contentHeight);
    setContainerHeight(containerHeight);
  };

useEffect(() => {
  const maxScroll = contentHeight - containerHeight;
  const newScrollY = scrollY < 0 ? 0 : Math.min(scrollY, maxScroll);
  const newScrollPercentage = (newScrollY / maxScroll) * 100;
  setScrollY(newScrollY);
  setScrollProgress(newScrollPercentage);
  if (initialLoad && newScrollPercentage > 0) {
    setInitialLoad(false);
  }
}, [scrollY, contentHeight, containerHeight, initialLoad]);


  const [scrollProgress, setScrollProgress] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/books.php')
      .then(response => response.json())
      .then(data => {
        // Filtrează datele pentru a selecta doar elementul cu ID-ul corespunzător
        const filteredData = data.filter(item => item.id === route.params.bookId);
        setFilteredData(filteredData); // Folosește setFilteredData aici
      })
      .catch(error => console.error('Error:', error));
  }, [route.params.bookId]);




  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBackToBooks} style={styles.closeButton}>
        <FontAwesomeIcon icon={faTimes} size={30} color="red" />
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View
          style={{
            width: initialLoad ? "0%" : `${scrollProgress}%`,
            height: 5,
            backgroundColor: initialLoad ? "lightgray" : "red",
          }}
        />
      </View>

      <Text style={styles.scrollPercentageText}>{isNaN(scrollProgress) ? '0%' : `${Math.round(scrollProgress)}%`}</Text>

<ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={styles.ScrollView}>
  <View style={styles.contentBooks}>
    {filteredData.map((item, index) => (
      <View key={item.id} style={styles.contentBooksRead}>
        <Text style={styles.titleBook}>{item.title}</Text>
        <Text style={styles.titleAuthor}>{item.author}</Text>
        {/*<Text style={styles.textBook}>{item.content}</Text>*/}

        <Text style={styles.titleAuthor}>
          Once  upon  a  time,  there  were  two  best  friends  an  ant  and  a  grasshopper.  
          The  grasshopper  liked  to  relax  the  whole  day  and  play  his  guitar.  
        </Text>

      </View>
    ))}
  </View>
</ScrollView>

<View>
  {filteredData.length > 0 && (
    <Text style={styles.textBook}>
    https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/audio/
    {filteredData[0].audio_file}</Text>
  )}
</View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: '13%',
  },
  ScrollView:{
    padding: '5%'
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  progressBarContainer: {
    width: '70%',
    height: 5,
    backgroundColor: "lightgray",
  },
  scrollPercentageText: {
    alignSelf: 'center',
    marginTop: 5,
  },
  scrollView: {
    marginTop: 40, // Adjust the spacing as needed
    paddingHorizontal: 20,
  },
  titleBook: {
    fontSize: 21,
  },
  titleAuthor: {
    fontSize: 16,
    marginBottom: 10,
  },
  textBook: {
    fontSize: 18,
  },
});
