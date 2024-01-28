import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Switch,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import Carousel from "react-native-new-snap-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  faTimes,
  faGear,
  faCirclePlay,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Audio } from "expo-av";

import globalCss from "./css/globalCss";
import Loader from "./components/Loader";

const { width } = Dimensions.get("window");
const DEBOUNCE_TIME = 300;
export default function FlashCardsLearning({ route, navigation }) {
  const [combinedData, setCombinedData] = useState([]);
const [index, setIndex] = useState(0);
const totalSlides = combinedData.length;
  const { url } = route.params;
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [loader, setLoader] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledUsa, setIsEnabledUsa] = useState(true);

  const [carouselData, setCarouselData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isAtLastCarouselSlide, setIsAtLastCarouselSlide] = useState(false);
const [showModal, setShowModal] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(0);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    // Salvare în AsyncStorage
    AsyncStorage.setItem("isEnabled", JSON.stringify(!isEnabled))
      .then(() => {
        console.log(
          "Valoarea isEnabled a fost salvată cu succes în AsyncStorage."
        );
      })
      .catch((error) => {
        console.error("Eroare la salvarea în AsyncStorage:", error);
      });
  };

const fetchCarouselData = async () => {
  try {
    const response = await fetch(
      "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-carousel.php"
    );
    let data = await response.json();
    data = data.filter((item) => item.url_display === url); // Filtrare după URL
    setCarouselData(data);

    // Calculează lungimea datelor și actualizează combinedData
    const totalSlides = data.length;
    setCombinedData(data);
  } catch (error) {
    console.error("Error fetching carousel data:", error);
  }
};


  // Încărcarea datelor pentru Quiz, filtrate după URL
  const fetchQuizData = async () => {
    try {
      const response = await fetch(
        "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-quiz.php"
      );
      let data = await response.json();
      data = data.filter((item) => item.quiz_url === url); // Filtrare după URL
      setQuizData(data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  useEffect(() => {
    fetchCarouselData();
  }, []);

const handleShowQuiz = () => {
  fetchQuizData(); // Încărcați datele quiz-ului când butonul este apăsat
  setShowQuiz(true); // Afișează quiz-ul
  setShowModal(false); // Ascunde modalul
  setIndex(0); // Resetarea indexului la 0 pentru a începe quiz-ul
};




  const toggleSwitchUsa = () => {
    setIsEnabledUsa((previousState) => !previousState);
    // Salvare în AsyncStorage
    AsyncStorage.setItem("isEnabledUsa", JSON.stringify(!isEnabledUsa))
      .then(() => {
        console.log("succes");
      })
      .catch((error) => {
        console.error("error:", error);
      });
  };

  // Recuperare stării din AsyncStorage la încărcarea componentei
  useEffect(() => {
    AsyncStorage.getItem("isEnabled")
      .then((value) => {
        if (value !== null) {
          setIsEnabled(JSON.parse(value));
        }
      })
      .catch((error) => {
        console.error("error", error);
      });

    AsyncStorage.getItem("isEnabledUsa")
      .then((value) => {
        if (value !== null) {
          setIsEnabledUsa(JSON.parse(value));
        }
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);

  // moddal deschided de jso
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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const combinedOnPress = () => {
    handleOpenPress();
    handlePress();
  };

  const ProgressBar = ({ currentIndex, totalCount }) => {
    const progress = (currentIndex + 1) / totalCount;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    );
  };


const playSound = async (audioUrl) => {
  // Verifică dacă sunetul curent este în curs de redare și așteaptă finalizarea
  if (currentSound && isPlaying) {
    await currentSound.stopAsync(); // Oprire înainte de a începe redarea următoare
    setIsPlaying(false);
  }

  // Descarcă sunetul curent (dacă există)
  if (currentSound) {
    await currentSound.unloadAsync();
  }

  // Crează un nou sunet și redă-l
  const newSound = new Audio.Sound();
  try {
    await newSound.loadAsync({ uri: audioUrl });
    await newSound.playAsync();
    setCurrentSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isPlaying && status.didJustFinish) {
        setIsPlaying(false);
        newSound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Eroare la redarea sunetului:", error);
  }
};




const handleBackButtonPress = () => {
  navigation.goBack();
};



const updateProgressBar = (newIndex) => {
  setIndex(newIndex);

  const isAtLastSlide = newIndex === combinedData.length - 1; // Verifică dacă este ultimul slide
  setIsAtLastCarouselSlide(isAtLastSlide);

  console.log(
    `Index actualizat: ${newIndex}, Lungime totală: ${combinedData.length}`
  );
};

const lastCarouselIndex = combinedData.findIndex(
  (item) => item.type !== "carousel"
);

const handleSlideChange = (newIndex) => {
  updateProgressBar(newIndex);

  // Verifică dacă este ultimul slide
  const isAtLastSlide = newIndex === combinedData.length - 1;
  setIsAtLastCarouselSlide(isAtLastSlide); // Setează starea în funcție de poziția curentă

  // Verifică dacă quiz-ul este afișat și dacă slide-ul curent are audio
  const currentSlide = showQuiz ? quizData[newIndex] : carouselData[newIndex];
  if (!showQuiz && currentSlide && currentSlide.word_audio) {
    const audioUrl = `https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/${currentSlide.word_audio}`;
    playSound(audioUrl);
  }
};


const handleRightButtonPress = () => {
  if (isAtLastCarouselSlide) {
    // Dacă este ultimul slide, afișează modalul
    setShowModal(true);
  } else if (index < totalSlides - 1) {
    // Altfel, avansează la următorul slide
    swiperRef.current?.snapToNext();
    const newIndex = index + 1;
    setIndex(newIndex); // Actualizează indexul la următorul slide
  }
};


  const renderItem = ({ item }) => {
    if (showQuiz) {
      // Afișați slide-urile Quiz
      return (
        <View style={styles.slide}>
          <Text style={styles.categoryTitle}>quiz: {item.answer_1}</Text>
        </View>
      );
    } else {
      // Afișați slide-urile Carousel
      return (
        <View style={styles.slide}>
          {/* 11111111111111111111111111111111111111111111111111 */}
          <View style={styles.groupEng}>
            <Text style={styles.word_en}>{item.word_en}</Text>
            <Text
              style={
                isEnabled ? styles.tophoneticsAmerican : { display: "none" }
              }
            >
              brit: / {item.tophoneticsBritish} /
            </Text>
            <Text
              style={
                isEnabledUsa ? styles.tophoneticsBritish : { display: "none" }
              }
            >
              usa: / {item.tophoneticsAmerican} /
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              playSound(
                `https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/${item.word_audio}`
              )
            }
          >
            <Text style={styles.audioWord}>
              <FontAwesomeIcon
                icon={isPlaying ? faCirclePause : faCirclePlay}
                size={40}
                style={{ color: "#1f80ff" }}
              />
            </Text>
          </TouchableOpacity>

          <Text style={styles.word_ru}>{item.word_ru}</Text>
        </View>
      );
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.swiperContent}>
        <Loader visible={loader} />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackButtonPress}
          >
            <Text>
              <FontAwesomeIcon
                icon={faTimes}
                size={30}
                style={globalCss.blue}
              />
            </Text>
          </TouchableOpacity>
          <ProgressBar
            currentIndex={index}
            totalCount={
              !showQuiz
                ? carouselData.length
                : carouselData.length + quizData.length
            }
          />

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={combinedOnPress}
          >
            <Text>
              <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue} />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.carousel}>
          <Carousel
            data={showQuiz ? quizData : carouselData}
            ref={swiperRef}
            onSnapToItem={handleSlideChange}
            renderItem={renderItem} // Utilizați funcția renderItem corectată
            sliderWidth={width}
            itemWidth={width - 70}
            paginationStyle={styles.pagination}
            contentContainerCustomStyle={styles.carouselContainer}
            layout={"default"}
            loop={false}
          />








        </View>

        <SwiperButtonsContainer
          onRightPress={handleRightButtonPress}
          isPressedContinue={isPressedContinue}
          setIsPressedContinue={setIsPressedContinue}
          swiperRef={swiperRef} 
        />
      </View>

{showModal && (
  <View style={styles.modalContainer}>
    <TouchableOpacity onPress={handleShowQuiz}>
      <Text style={styles.modalText}>Afișează Quiz</Text>
    </TouchableOpacity>
  </View>
)}


      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        index={-1}
      >
        <BottomSheetView style={styles.contentBottomSheet}>
          <View style={styles.settingsGroup}>
            <Text style={styles.settingsIPA}>Американское произношение</Text>

            <Switch
              trackColor={{ false: "#d1d1d1", true: "#4ADE80" }}
              thumbColor={isEnabledUsa ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#d1d1d1"
              onValueChange={toggleSwitchUsa}
              value={isEnabledUsa}
            />
          </View>

          <View style={styles.settingsGroup}>
            <Text style={styles.settingsIPA}>Британское произношение</Text>

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

const SwiperButtonsContainer = ({
  onRightPress,
  isPressedContinue,
  setIsPressedContinue,
  swiperRef,
}) => (
  <View style={styles.swiperButtonsContainer}>
    <TouchableOpacity
      style={[
        globalCss.button,
        isPressedContinue
          ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
          : globalCss.buttonBlue,
      ]}
      onPress={() => {
        if (swiperRef && swiperRef.current) { // Verifică dacă swiperRef este definit și nu este null
          onRightPress(); // Apelează funcția onRightPress
          swiperRef.current.snapToNext(); // Schimbă slide-ul la următorul în carusel
        }
      }}
      onPressIn={() => setIsPressedContinue(true)}
      onPressOut={() => setIsPressedContinue(false)}
      activeOpacity={1}
    >
      <Text style={globalCss.buttonText}>Продолжить</Text>
    </TouchableOpacity>
  </View>
);



const styles = StyleSheet.create({
  carousel: {
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingTop: "12%",
  },
  gradient: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginTop: "10%",
    height: "7%",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "90%",
  },
  swiperContent: {
    height: "100%",
  },
  progressBarContainer: {
    flex: 1,
    backgroundColor: "#3a464e",
    borderRadius: 10,
    alignSelf: "center",
    height: "40%",
  },
  progressBar: {
    flex: 1,
    backgroundColor: "#ffeb3b",
    borderRadius: 10,
  },
  settingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "14%",
    height: "100%",
    paddingTop: "1%",
    textAlign: "center",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "14%",
    height: "100%",
    paddingLeft: "2%",
    paddingRight: "1%",
    paddingTop: "1%",
    textAlign: "center",
  },
  image: {
    width: "50%",
    height: "50%",
    objectFit: "contain",
  },
  swiperButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: "9%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginRight: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "48%",
    alignItems: "center",
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  contentBottomSheet: {
    height: "100%",
  },
  groupEng: {
    marginBottom: "10%",
  },
  word_en: {
    fontSize: 30,
    color: "#535353",
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "center",
  },
  tophoneticsBritish: {
    textAlign: "center",
    color: "#0036ff",
    fontWeight: 300,
    fontSize: 20,
  },
  tophoneticsAmerican: {
    textAlign: "center",
    color: "#0036ff",
    fontWeight: 300,
    fontSize: 20,
  },
  word_ru: {
    fontSize: 30,
    color: "#535353",
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "center",
  },
  audioWord: {
    alignSelf: "center",
    marginBottom: "10%",
  },
  settingsGroup: {
    flexDirection: "row",
    alignItems: "center",
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

  modalContainer: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },

  template: {},
  template: {},
  template: {},
  template: {},
  template: {},
  template: {},
  template: {},
  template: {},
});
