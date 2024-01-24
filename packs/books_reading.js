import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  handleScroll,
  Switch,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Loader from "./components/Loader";
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faGear,
  faCaretRight,
  faCaretLeft,
  faCheck,
  faCirclePlay,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';

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


const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
const bottomSheetRef = useRef(null);
const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
const handleOpenPress = useCallback(() => {
  bottomSheetRef.current?.snapToIndex(1);
}, []);

const renderBackdrop = useCallback(
  (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={1}
    />
  ),
  []
);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Loader visible={loading} />





      <View style={styles.row}>
        <TouchableOpacity onPress={goBackToBooks} style={styles.closeButton}>
          <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.blue} />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${scrollY}%` }]} />
        </View>

        <TouchableOpacity style={styles.settingsBtn} onPress={handleOpenPress}>
          <Text>
            <FontAwesomeIcon icon={faCheck} size={30} style={globalCss.blue} />
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
      <View style={styles.controlAudioBtn}>
      <FontAwesomeIcon 
        icon={faCaretLeft} 
        size={43}
        style={styles.audioBtnPlayColor}
      />
      </View>
      {filteredData.length > 0 && (
        <TouchableWithoutFeedback
          onPress={() =>
            playSound(
              `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/audio/${filteredData[0].audio_file}`
            )
          }
        >
          <View style={styles.audioBtnPlay}>
            <FontAwesomeIcon 
              icon={isPlaying ? faCirclePause : faCirclePlay} 
              size={43}
              style={styles.audioBtnPlayColor}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.controlAudioBtn}>
      <FontAwesomeIcon 
        icon={faCaretRight} 
        size={43}
        style={styles.audioBtnPlayColor}
      />
      
      

      </View>
      </View>


   


<BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      index={-1}
    >
      <BottomSheetView style={styles.contentBottomSheet}>
        
      <View style={styles.audioBtnSave}>
          <Text style={styles.audioTxtSave}>Пометить как прочитанное</Text>

      <Switch
        trackColor={{ false: "#d1d1d1", true: "#4ADE80" }}
        thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor="#d1d1d1"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      </View>


      </BottomSheetView>
    </BottomSheet>




    </GestureHandlerRootView>
  );
} 



const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingBottom: 20,
    paddingTop: '12%',
  },
  audioBtnSave:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  audioTxtSave:{
    fontSize: 18,
    fontWeight: '500',
    color: '#343541',
    flex: 1,
  },
  audioPlyr:{
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: '8%',
    alignItems: 'center',
  },
  contentBottomSheet:{
    height: '100%', 
      flex: 1,

  },
  audioBtnPlayColor:{
    color: '#343541',
  },
  controlAudioBtn:{
    minWidth: '20%',
    alignItems: 'center',
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
    height: 25,
    flex: 1,
    backgroundColor: '#3a464e',
    borderRadius: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffeb3b',
    borderRadius: 10,
  },
  settingsBtn:{
    width: '14%',
    paddingVertical: '3%',
    alignItems: 'center',
    backgroundColor: 'red',
    alignContent: 'center',
  },
});
