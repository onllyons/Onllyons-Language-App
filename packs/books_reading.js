// Importuri din React și React Native
import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Switch, TouchableWithoutFeedback, TouchableOpacity, Animated} from "react-native";

// Importuri pentru navigare
import { useRoute } from "@react-navigation/native";

// Iconițe FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faRotateRight, faGear, faCirclePlay, faCirclePause, } from "@fortawesome/free-solid-svg-icons";

// Importuri pentru gestionarea audio
import { Audio } from "expo-av";

// Import pentru gestionarea gesturilor
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Bottom Sheet
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

// Importuri locale și de utilitare
import globalCss from "./css/globalCss";
import { sendDefaultRequest, SERVER_AJAX_URL } from "./utils/Requests";

// Componente personalizate
import { Welcome } from "./components/Welcome";
import { useStore } from "./providers/Store";


export default function BooksScreen({ navigation }) {
    const { setStoredValue } = useStore();
    const [scrollY, setScrollY] = useState(0);
    const route = useRoute();
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [saved, setSaved] = useState(false);
    const bottomSheetRef = useRef(null);
    const [data, setData] = useState([]);
    const [wordsArray, setWordsArray] = useState([]);
    const { id: bookId, item, info } = route.params;
    const scrollAnim = useRef(new Animated.Value(0)).current;

    // butoane pentru mute si volum
    const [isMuted, setIsMuted] = useState(false);
    const toggleMute = async () => {
      setIsMuted(!isMuted); // Schimbă starea de mute
      if (sound) {
        if (isMuted) {
          await sound.setVolumeAsync(1.0); // Setează volumul la normal dacă este pe mute
        } else {
          await sound.setVolumeAsync(0.0); // Pune pe mute
        }
      }
    };

    const handleScroll = (event) => {
      const y = event.nativeEvent.contentOffset.y;
      const height = event.nativeEvent.layoutMeasurement.height;
      const contentHeight = event.nativeEvent.contentSize.height;

      // Calculați procentajul de scroll (0 - 100)
      let scrollPercentage = (y / (contentHeight - height)) * 100;
      scrollPercentage = isNaN(scrollPercentage) ? 0 : scrollPercentage;

      // Asigurați-vă că procentajul nu depășește 100
      scrollPercentage = Math.min(100, Math.max(0, scrollPercentage));

      // Actualizați animația progresului cu noul procentaj
      scrollAnim.setValue(scrollPercentage); // Folosiți 'setValue' pentru a actualiza valoarea animației
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
    setLoading(true);
    sendDefaultRequest(
      `${SERVER_AJAX_URL}/books/test_book.php`,
      { id: bookId },
      navigation,
      { success: false }
    )
      .then((data) => {
        setFinished(!!data.data.finished);
        setSaved(!!data.data.saved);
        setData(data.data);
        const staticWordsArray = data.data.wordsArray;
        setWordsArray(staticWordsArray);
      })
      .catch((err) => {
        if (typeof err === "object" && !err.tokensError) {
          navigation.goBack();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookId, navigation]);

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
    )
      .then(() => {})
      .catch(() => {});

    if (item) item.saved = !saved;

    const indexSaved = info.saved.indexOf(bookId);

    if (!saved) {
      if (indexSaved === -1) {
        setStoredValue("needToUpdateBooks", true);
        info.saved.push(bookId);
      }
    } else {
      if (indexSaved !== -1) {
        setStoredValue("needToUpdateBooks", true);
        info.saved.splice(indexSaved, 1);
      }
    }

    setSaved(!saved);
  };

  const handleFinish = () => {
    sendDefaultRequest(
      `${SERVER_AJAX_URL}/books/finish_book.php`,
      { id: bookId },
      navigation,
      { success: false }
    )
      .then(() => {})
      .catch(() => {});

    if (item) item.finished = !finished;

    const indexFinish = info.finished.indexOf(bookId);

    if (!finished) {
      if (indexFinish === -1) {
        setStoredValue("needToUpdateBooks", true);
        info.finished.push(bookId);
      }
    } else {
      if (indexFinish !== -1) {
        setStoredValue("needToUpdateBooks", true);
        info.finished.splice(indexFinish, 1);
      }
    }

    setStoredValue("needToUpdateBooksCategory", true);

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


  return loading ? (
    <Welcome />
  ) : (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.blue} />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                width: scrollAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }) 
              }
            ]} 
          />
        </View>

        <TouchableOpacity style={styles.settingsBtn} onPress={handleOpenPress}>
          <Text>
            <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue} />
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
      
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 160,
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.contentBooks}>
          <View key={data.id} style={styles.contentBooksRead}>
            <Text style={styles.titleBook}>{data.title}</Text>
            <Text style={styles.titleAuthor}>as {data.author}</Text>

            <View style={styles.textContainer}>
              {wordsArray && wordsArray.length > 0 ? (
                wordsArray.map((word, index) => {
                  // Dacă elementul este o imagine
                  if (word.text === "IMAGE") {
                    return (
                      <View key={index} style={styles.imageContainer}>
                        <Image
                          source={{ uri: word.src }}
                          style={styles.sourceImgBook}
                        />
                      </View>
                    );
                  }

                  // Pentru elementele cu timp asociat, afișăm ca butoane
                  const hasTiming = word.start !== 0 || word.duration !== 0;
                  if (hasTiming) {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => playFromWord(word.start)}
                        style={[
                          styles.textTouchableDef,
                          index === currentWordIndex &&
                            styles.highlightedTextBtn,
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
                    );
                  }

                  // Pentru text simplu, fără timp asociat
                  return (
                    <Text
                      key={index}
                      style={[
                        styles.readingContent,
                        styles.normalText, // Stil pentru textul simplu
                      ]}
                    >
                      {word.text + " "}
                    </Text>
                  );
                })
              ) : (
                <Text>Încărcare...</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.audioPlyr}>
        
        <View style={styles.controlAudioBtn}>
          <Image
              source={require('./images/other_images/player/list.png')}
              style={styles.imgVolume}
            />
        </View>
        
        <View style={styles.controlAudioBtn}>
            <TouchableWithoutFeedback
                
                onPress={() =>
                  playSound(
                    `https://www.language.onllyons.com/ru/ru-en/packs/assest/books/read-books/audio/${data.audio_file}`
                  )
                }
            >
                <FontAwesomeIcon
                  icon={isPlaying ? faCirclePause : faCirclePlay}
                  size={43}
                  style={styles.audioBtnPlayColor}
                />
            </TouchableWithoutFeedback>
        </View>

        <View style={styles.controlAudioBtn}>
            <TouchableWithoutFeedback onPress={toggleMute}>
              <Image
                source={isMuted ? require('./images/other_images/player/mute.png') : require('./images/other_images/player/volume.png')}
                style={styles.imgVolume}
              />
            </TouchableWithoutFeedback>
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
          <View style={styles.settingsGroup}>
            <Text style={styles.settingsIPA}>Пометить как прочитанное</Text>

            <Switch
              trackColor={{ false: "#d1d1d1", true: "#4ADE80" }}
              thumbColor={finished ? "#ffffff" : "#f4f3f4"}
              disabled={finished}
              ios_backgroundColor="#d1d1d1"
              onValueChange={handleFinish}
              value={finished}
            />
          </View>

          <View style={styles.settingsGroup}>
            <Text style={styles.settingsIPA}>Добавить в закладки</Text>

            <Switch
              trackColor={{ false: "#d1d1d1", true: "#4ADE80" }}
              thumbColor={saved ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#d1d1d1"
              onValueChange={handleBookmark}
              value={saved}
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

  settingsGroup: {
    paddingHorizontal: 20,
    marginBottom: "2%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  settingsIPA: {
    fontSize: 18,
    fontWeight: "500",
    color: "#343541",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  sourceImgBook: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: "8%",
    borderRadius: "10%",
  },
  imgVolume:{
    width: 50,
    height: 50,
    resizeMode: "container",
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
    Width: "20%",
    backgroundColor: 'red',
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
    fontWeight: "600",
    color: "#343541",
    alignSelf: "center",
    marginBottom: 10,
  },
  titleAuthor: {
    color: "#343541",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 30,
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
});
