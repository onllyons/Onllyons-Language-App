import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  handleScroll,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Loader from "./components/Loader";
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faGear,
  faCirclePlay,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";

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
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();  // Referință pentru ScrollView
  const contentRef = useRef();

const handleScroll = (event) => {
  const y = event.nativeEvent.contentOffset.y;
  const height = event.nativeEvent.layoutMeasurement.height;
  const contentHeight = event.nativeEvent.contentSize.height;

  if (y <= 0) {
    setScrollY(0);
  } else {
    let scrollPercentage = (y / (contentHeight - height)) * 100;
    // Verifică dacă rezultatul este NaN și corectează
    scrollPercentage = isNaN(scrollPercentage) ? 0 : scrollPercentage;
    // Asigură că valoarea este între 0 și 100
    setScrollY(Math.min(100, Math.max(0, scrollPercentage.toFixed(0))));
  }
};




  const playSound = async (audioUrl) => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);




  const [filteredData, setFilteredData] = useState([]);
  const [wordsArray, setWordsArray] = useState([]);

  useEffect(() => {
  setLoading(true);
  fetch(
      "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/books.php"
    )
    .then((response) => response.json())
    .then((data) => {
      const filteredData = data.filter(
        (item) => item.id === route.params.bookId
      );
      const words = extractWords(filteredData[0].content); // Presupunând că `filteredData[0].content` conține HTML-ul
      setFilteredData(filteredData);
      setWordsArray(words); // presupunând că ai o stare `wordsArray` pentru a stoca cuvintele extrase
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => setLoading(false));
}, [route.params.bookId]);




  const words = [
    { text: "is", start: 180, duration: 100 },
    { text: "the", start: 280, duration: 189 },
    // ... restul cuvintelor
  ];

  useEffect(() => {
    let interval;

    if (isPlaying && sound) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isPlaying) {
          const currentTime = status.positionMillis;
          const wordIndex = words.findIndex(
            (word) =>
              currentTime >= word.start &&
              currentTime <= word.start + word.duration
          );
          setCurrentWordIndex(wordIndex);
        }
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, sound]);

const extractWords = (htmlString) => {
  const regex = /<span data-m="(\d+)" data-d="(\d+)">(.*?)<\/span>/g;
  const words = [];
  let match;

  while ((match = regex.exec(htmlString)) !== null) {
    const start = parseInt(match[1], 10);
    const duration = parseInt(match[2], 10);
    const text = match[3].trim().replace(/&nbsp;/g, ' ');

    words.push({ text, start, duration });
  }

  return words;
};


  return (
    <View style={styles.container}>
      <Loader visible={loading} />





      <View style={styles.row}>
        <TouchableOpacity onPress={goBackToBooks} style={styles.closeButton}>
          <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.blue} />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${scrollY}%` }]} />
        </View>

        <TouchableOpacity style={styles.settingsBtn}>
          <Text>
            <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue} />
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingTop: 30, paddingBottom: 30, paddingHorizontal: 20, }}>
        <View style={styles.contentBooks}>
          {filteredData.map((item, index) => (
          <View key={item.id} style={styles.contentBooksRead}>
            <Text style={styles.titleBook}>{item.title}</Text>
            <Text style={styles.titleAuthor}>{item.author}</Text>

            <View style={styles.textContainer}>
              {wordsArray.map((word, index) => (
                <Text
                  key={index}
                  style={currentWordIndex === index ? styles.highlightedWord : styles.normalWord}
                >
                  {word.text + " "}
                </Text>
              ))}
            </View>
          </View>
        ))}
        </View>
      </ScrollView>

      <View style={styles.audioPlyr}>
        {filteredData.length > 0 && (
          <TouchableOpacity
            style={styles.audioBtnPlay}
            onPress={() =>
              playSound(
                `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/audio/${filteredData[0].audio_file}`
              )
            }
          >
            <FontAwesomeIcon icon={isPlaying ? faCirclePause : faCirclePlay} size={43} style={styles.audioBtnPlayColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
} 


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingBottom: 20,
    marginTop: '12%',
  },
  audioPlyr:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'blue',
    paddingVertical: '8%',
    alignItems: 'center',
  },
  audioBtnPlay:{
    
  },
  audioBtnPlayColor:{
    color: 'red',
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    minWidth: '14%',
    paddingVertical: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  titleBook: {
    fontSize: 21,
    fontWeight: '500',
    color: '#343541',
    alignSelf: 'center',
  },
  titleAuthor: {
    color: '#343541',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textBook: {
    fontSize: 18,
  },
  highlightedWord: {
    backgroundColor: 'yellow',
  },
  normalWord: {
    backgroundColor: 'transparent',
  },

  progressBarContainer: {
    height: 20,
    flex: 1,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'red',
    borderRadius: 5,
  },
  settingsBtn:{
    width: '14%',
    paddingVertical: '3%',
    alignItems: 'center',
    alignContent: 'center',
  },
});
