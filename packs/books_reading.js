import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Loader from "./components/Loader";
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faCaretRight,
  faCaretLeft,
  faCheck,
  faCirclePlay,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";
import { Audio } from "expo-av";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import globalCss from "./css/globalCss";
import { sendDefaultRequest, SERVER_AJAX_URL } from "./utils/Requests";

export default function BooksScreen({ navigation }) {
  const [scrollY, setScrollY] = useState(0);
  const route = useRoute();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const bottomSheetRef = useRef(null);
  const [data, setData] = useState([]);
  const [wordsArray, setWordsArray] = useState([]);
  const bookId = route.params.id;
  const spanRegex = /<span data-m="(\d+)" data-d="(\d+)">(.*?)<\/span>/g;

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

  useEffect(() => {
    setLoading(true);

    sendDefaultRequest(
      `${SERVER_AJAX_URL}/books/get_book.php`,
      { id: bookId },
      navigation,
      { success: false }
    )
      .then((data) => {
        const words = extractWords(data.data.content); // Aici extrageți cuvintele

        setFinished(!!data.data.finished);
        setData(data.data);
        setWordsArray(words); // Corect - actualizați starea cuvintelor extrase
      })
      .catch((err) => {
        if (typeof err === "object" && !err.tokensError) {
          navigation.goBack();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookId, navigation]); // Ajustați dependențele dacă este necesar

  useEffect(() => {
    console.log(wordsArray);
    let interval = setInterval(async () => {
      if (isPlaying && sound) {
        const status = await sound.getStatusAsync();
        if (status.isPlaying) {
          const currentTime = status.positionMillis;
          const wordIndex = wordsArray.findIndex(
            (word) =>
              currentTime >= word.start &&
              currentTime <= word.start + word.duration
          );
          console.log(wordIndex);
          setCurrentWordIndex(wordIndex);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval = null;

    if (isPlaying && sound) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isPlaying) {
          const currentTime = status.positionMillis;
          const wordIndex = wordsArray.findIndex(
            (word) =>
              currentTime >= word.start &&
              currentTime < word.start + word.duration
          );
          setCurrentWordIndex(wordIndex); // Actualizează cuvântul curent pe baza timpului de redare
        }
      }, 100); // Verifică la fiecare 100 ms
    }

    return () => interval && clearInterval(interval);
  }, [isPlaying, sound]);

  const extractWords = (htmlString) => {
    const matches = Array.from(htmlString.matchAll(spanRegex));
    return matches.map((match) => ({
      text: match[3].trim(), // Textul cuvântului
      start: parseInt(match[1], 10), // Timpul de start
      duration: parseInt(match[2], 10), // Durata
    }));
  };

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

  const handleBookmark = () => {
    sendDefaultRequest(
      `${SERVER_AJAX_URL}/books/create_bookmark.php`,
      { id: bookId },
      navigation,
      { success: false }
    ).catch(() => {});

    setFinished(!finished);
  };
  const playFromWord = async (startMillis) => {
    if (sound) {
      await sound.setPositionAsync(startMillis);
      if (!isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Loader visible={loading} />

      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
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

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={4}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 30,
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.contentBooks}>
          <View key={data.id} style={styles.contentBooksRead}>
            <Text style={styles.titleBook}>{data.title}</Text>
            <Text style={styles.titleAuthor}>{data.author}</Text>

            <View style={styles.textContainer}>
              {wordsArray.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => playFromWord(word.start)}
                  style={[
                    styles.textTouchableDef,
                    index === currentWordIndex && styles.highlightedTextBtn,
                  ]}
                >
                  <Text
                    style={[
                      styles.readingContent,
                      index === currentWordIndex
                        ? styles.highlightedText
                        : index < currentWordIndex
                        ? styles.readText
                        : styles.normalText,
                    ]}
                  >
                    {word.text + " "}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
        <TouchableWithoutFeedback
          onPress={() =>
            playSound(
              `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/audio/${data.audio_file}`
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
        snapPoints={["25%", "50%", "90%"]}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        index={-1}
      >
        <BottomSheetView style={styles.contentBottomSheet}>
          <View style={styles.audioBtnSave}>
            <Text style={styles.audioTxtSave}>Пометить как прочитанное</Text>

            <Switch
              trackColor={{ false: "#d1d1d1", true: "#4ADE80" }}
              thumbColor={finished ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#d1d1d1"
              onValueChange={handleBookmark}
              value={finished}
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
    paddingTop: "12%",
  },
  audioBtnSave: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  audioTxtSave: {
    fontSize: 18,
    fontWeight: "500",
    color: "#343541",
    flex: 1,
  },
  audioPlyr: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: "8%",
    alignItems: "center",
  },
  contentBottomSheet: {
    height: "100%",
    flex: 1,
  },
  audioBtnPlayColor: {
    color: "#343541",
  },
  controlAudioBtn: {
    minWidth: "20%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    minWidth: "14%",
    paddingVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  titleBook: {
    fontSize: 21,
    fontWeight: "500",
    color: "#343541",
    alignSelf: "center",
  },
  titleAuthor: {
    color: "#343541",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10,
  },

  progressBarContainer: {
    height: 25,
    flex: 1,
    backgroundColor: "#3a464e",
    borderRadius: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffeb3b",
    borderRadius: 10,
  },
  settingsBtn: {
    width: "14%",
    paddingVertical: "3%",
    alignItems: "center",
    backgroundColor: "red",
    alignContent: "center",
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },

  highlightedText: {
    color: "green",
  },
  readingContent: {
    fontSize: 19,
    color: "#999",
  },
  readText: {
    color: "red",
  },
  highlightedTextBtn: {
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },

  textTouchableDef: {
    marginBottom: 3,
  },
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
  asdf: {},
});
