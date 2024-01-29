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
  Image,
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
import Loader from "./components/Loader";

import globalCss from "./css/globalCss";

const { width } = Dimensions.get("window");
const DEBOUNCE_TIME = 300;
export default function FlashCardsLearning({ route, navigation }) {
  const [combinedData, setCombinedData] = useState([]);
  const [index, setIndex] = useState(0);
  const totalSlides = combinedData.length;
  const { url } = route.params;
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPressedQuizStart, setIsPressedStartQuiz] = useState(false);
  

  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledUsa, setIsEnabledUsa] = useState(true);

  const [carouselData, setCarouselData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isAtLastCarouselSlide, setIsAtLastCarouselSlide] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(0);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);


  // effects btn
  const [checkQuizAnswers, setCheckQuizAnswers] = useState({});
  const handlePressIn = (answerId) => {
    setCheckQuizAnswers(prevState => ({ ...prevState, [answerId]: true }));
  };

  const handlePressOut = (answerId) => {
    setCheckQuizAnswers(prevState => ({ ...prevState, [answerId]: false }));
  };

 


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
    setIsLoading(true); // Activează loader-ul

    const fetchData = async () => {
      try {
        await fetchCarouselData(); // Așteaptă finalizarea primei cereri
        await fetchQuizData(); // Așteaptă finalizarea celei de-a doua cereri
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false); // Dezactivează loader-ul după finalizarea ambelor cereri
      }
    };

    fetchData();
  }, [url]); // Include url ca dependență

const handleShowQuiz = async () => {
  setIsLoading(true);
  try {
    await fetchQuizData();
    setShowQuiz(true); // Primul setăm faptul că arătăm quiz-ul
    setQuizIndex(1); // Setăm indexul quiz-ului la 1 pentru a începe de la primul slide al quiz-ului
    setIndex(1); // Setăm indexul global la 1
    setCombinedData(quizData); // Actualizăm datele combinate cu datele quiz-ului
    setShowModal(false); // Închidem modalul
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
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
  // Verificarea stării isEnabled
  AsyncStorage.getItem("isEnabled")
    .then((value) => {
      if (value !== null) {
        setIsEnabled(JSON.parse(value));
      }
    })
    .catch((error) => {
      console.error("error", error);
    });

  // Verificarea stării isEnabledUsa
  AsyncStorage.getItem("isEnabledUsa")
    .then((value) => {
      if (value !== null) {
        setIsEnabledUsa(JSON.parse(value));
      }
    })
    .catch((error) => {
      console.error("error:", error);
    });

  // Verificarea stării quizShown
  AsyncStorage.getItem('quizShown')
    .then((value) => {
      if (value === 'true') {
        setShowModal(false); // Nu afișa modalul dacă quiz-ul a fost deja deschis
      }
    })
    .catch((error) => {
      console.error("Eroare la citirea din AsyncStorage:", error);
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
  };

  const lastCarouselIndex = combinedData.findIndex(
    (item) => item.type !== "carousel"
  );

  const handleSlideChange = (newIndex) => {
     if (showQuiz) {
        setQuizIndex(newIndex); // Actualizăm indexul pentru quiz
        console.log(`Index quiz: ${newIndex + 1}, Lungime totală quiz: ${quizData.length}`);
      } else {
        setCarouselIndex(newIndex); // Actualizăm indexul pentru carusel
        console.log(`Index carousel: ${newIndex + 1}, Lungime totală carousel: ${carouselData.length}`);
      }

    updateProgressBar(newIndex);
    setRandomOrder([1, 2, 3, 4].sort(() => Math.random() - 0.5));

    setIndex(newIndex);
    setIsAnswerSelected(false); // Resetați starea când se schimbă slide-ul




    // Verifică dacă este ultimul slide
    const isAtLastSlide = newIndex === combinedData.length - 1;
    setIsAtLastCarouselSlide(isAtLastSlide); // Setează starea în funcție de poziția curentă

    setIsAnswerSelected(false); // Resetați starea când se schimbă slide-ul

    // Verifică dacă quiz-ul este afișat și dacă slide-ul curent are audio
    const currentSlide = showQuiz ? quizData[newIndex] : carouselData[newIndex];
    if (!showQuiz && currentSlide && currentSlide.word_audio) {
      const audioUrl = `https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/${currentSlide.word_audio}`;
      playSound(audioUrl);
    }

    if ((showQuiz && newIndex === quizData.length) || (!showQuiz && newIndex === carouselData.length)) {
      setIndex(0);
    }

  };

const handleRightButtonPress = () => {
  if (isAtLastCarouselSlide && !showQuiz) {
    // Dacă este ultimul slide și quiz-ul nu este afișat, afișează modalul
    setShowModal(true);
  } else if (index < totalSlides - 1) {
    // Altfel, avansează la următorul slide
    swiperRef.current?.snapToNext();
    const newIndex = index + 1;
    setIndex(newIndex); // Actualizează indexul la următorul slide
  }
};

const [selectedAnswers, setSelectedAnswers] = useState({});
const [answersCorrectness, setAnswersCorrectness] = useState({});
const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [randomOrder, setRandomOrder] = useState([]);
  // Modificați funcția pentru a primi argumentele necesare
const handleSelectAnswer = (questionId, answerIndex, correctAnswer) => {
  const correctAnswerIndex = parseInt(correctAnswer, 10);
  setSelectedAnswers(prevState => ({ ...prevState, [questionId]: answerIndex }));
  setAnswersCorrectness(prevState => ({ ...prevState, [questionId]: answerIndex === correctAnswerIndex }));
  setIsAnswerSelected(true);
};


  const renderItem = ({ item }) => {
    if (showQuiz) {
    
      return (
        <View style={styles.slide}>
          <View style={styles.groupBtnQuiz}>
            <Text style={styles.headerText}>{item.question}</Text>
            {randomOrder.map((answerIndex) => (
              <TouchableOpacity
                key={answerIndex}
                style={[
                  styles.quizBtnCtr,
                  globalCss.buttonGry,
                  selectedAnswers[item.id] === answerIndex && answersCorrectness[item.id] ? styles.correct : null,
                  selectedAnswers[item.id] === answerIndex && !answersCorrectness[item.id] ? styles.incorrect : null,
                  checkQuizAnswers[item.id] ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : null
                ]}
                onPress={() =>
                  handleSelectAnswer(item.id, answerIndex, item.answer_correct)
                }
                onPressIn={() => handlePressIn(item.id)} // Asigurați-vă că fiecare buton primește cheia sa unică
                onPressOut={() => handlePressOut(item.id)} // Asigurați-vă că fiecare buton primește cheia sa unică
                activeOpacity={1}
              >
                <Text style={globalCss.blueLight}>
                  {item[`answer_${answerIndex}`]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      // Afișați slide-urile Carousel asdf
      return (
        <View style={styles.slide}>
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
        <Loader visible={isLoading} />

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
              showQuiz
                ? quizData.length
                : carouselData.length
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
            sliderWidth={width}
            itemWidth={showQuiz ? width - 30 : width - 70}
            paginationStyle={styles.pagination}
            contentContainerCustomStyle={styles.carouselContainer}
            layout={"default"}
            loop={false}
            onSnapToItem={handleSlideChange}
            renderItem={renderItem}
            firstItem={showQuiz ? quizIndex : carouselIndex}
            scrollEnabled={!showQuiz} // Dezactivează scroll-ul când showQuiz este adevărat
          />

        </View>

        <SwiperButtonsContainer
          onRightPress={handleRightButtonPress}
          isPressedContinue={isPressedContinue}
          setIsPressedContinue={setIsPressedContinue}
          swiperRef={swiperRef}
          isAnswerSelected={isAnswerSelected}
          showQuiz={showQuiz} // Pasați această stare
        />


      </View>

      {showModal && (
        <View style={styles.modalContainer}>
        <View style={styles.modalClose}>
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
        </View>



          <Image style={styles.succesImg} source={require('./images/El/succes.png')} />
        <View style={styles.modalContainerCenter}>
          <Text style={styles.succesText}>Поздравляю, вы успешно завершили урок! Нажмите на кнопку ниже, чтобы начать тест.</Text>
          <TouchableOpacity 
            style={[globalCss.button, styles.buttonGenQuiz, isPressedQuizStart ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
            onPressIn={() => setIsPressedStartQuiz(true)}
            onPressOut={() => setIsPressedStartQuiz(false)}
            activeOpacity={1}
            onPress={handleShowQuiz}>
            <Text style={styles.modalText}>начать тест</Text>
          </TouchableOpacity>
         </View>
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
  isAnswerSelected,
  showQuiz,
}) => (
  <View style={styles.swiperButtonsContainer}>
<TouchableOpacity
  style={[
    globalCss.button,
    isPressedContinue
      ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
      : globalCss.buttonBlue,
    !isAnswerSelected && showQuiz && styles.buttonInactive
  ]}
  onPress={() => {
    if (swiperRef && swiperRef.current) {
      if (showQuiz && isAnswerSelected) {
        onRightPress(); // Execută doar dacă este quiz și un răspuns este selectat
      } else if (!showQuiz) {
        onRightPress(); // Execută în modul carusel
      }
    }
  }}
  onPressIn={() => setIsPressedContinue(true)}
  onPressOut={() => setIsPressedContinue(false)}
  activeOpacity={1}
  disabled={!isAnswerSelected && showQuiz} // Dezactivează doar în modul quiz și dacă nu este selectat un răspuns
>
<Text style={[globalCss.buttonText, !isAnswerSelected && showQuiz && { color: '#343541' }]}>Продолжить</Text>
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

  
  groupBtnQuiz: {
    maxWidth: "80%",
    alignContent: "center",
  },
  quizBtnCtr: {
    minWidth: '100%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  correct: {
      backgroundColor: "#81b344",
  },
  incorrect: {
      backgroundColor: "#ca3431",
  },
  correctTxt: {
      color: "white",
  },
  buttonText: {
      fontSize: 18,
      color: "white",
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: '10%',
  },
  buttonInactive: {
    backgroundColor: '#f1f0f0',
    shadowColor: '#cbcbcb',
  },
  succesImg: {
    alignSelf: "center",
    marginBottom: "2.9%",
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginTop: '4%',
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingTop: '10%',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    zIndex: 999,
  },
  modalClose: {
    height: '10%',
    paddingRight: '5%',
    paddingLeft: '2%',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  succesText:{
    color: '#343541',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: '20%',
    textAlign: 'center',
  },
  modalText: {
    textTransform: 'uppercase',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainerCenter: {
    width: '100%',
    paddingHorizontal: '5%',
    alignSelf: 'center',
    paddingTop: '4%',
    
  },
  buttonGenQuiz: {
    alignSelf: 'center',

  },
  template: {},
  template: {},
  template: {},
  template: {},
});
