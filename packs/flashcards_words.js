import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Switch, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-new-snap-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faGear, faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

import globalCss from './css/globalCss';
import Loader from "./components/Loader";

const { width } = Dimensions.get("window");

export default function FlashCardsLearning({ route, navigation }) {
  const [combinedData, setCombinedData] = useState([]);
  const [index, setIndex] = useState(0);
  const totalSlides = combinedData.length;
  const { url } = route.params;
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [loader, setLoader] = useState(false)

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
  if (currentSound && isPlaying) {
    await currentSound.pauseAsync();
    setIsPlaying(false);
  } else {
    if (currentSound) {
      await currentSound.unloadAsync();
    }
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
      console.error('Eroare la redarea sunetului:', error);
    }
  }
};



  const handleBackButtonPress = () => {
    navigation.goBack();
  };
  const handleRightButtonPress = () => {
    if (index < totalSlides - 1) {
      swiperRef.current?.snapToNext();
    }
  };

  const updateProgressBar = (newIndex) => {
    setIndex(newIndex);
    console.log(`Index actualizat: ${newIndex}, Lungime totală: ${combinedData.length}`);
  };


  const handleSlideChange = (newIndex) => {
    updateProgressBar(newIndex);
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoader(true); // Indicatorul de încărcare este activat

      const responseCarousel = await fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-carousel.php');
      const dataCarousel = await responseCarousel.json();

      const responseQuiz = await fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-quiz.php');
      const dataQuiz = await responseQuiz.json();

      const filteredCarouselData = dataCarousel.filter((item) => item.url_display === url);
      const filteredQuizData = dataQuiz.filter((item) => item.quiz_url === url);

      const combinedData = [
        ...filteredCarouselData.map((item) => ({ ...item, type: "carousel" })),
        ...filteredQuizData.map((item) => ({ ...item, type: "quiz" })),
      ];

      setCombinedData(combinedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoader(false); // Indicatorul de încărcare este dezactivat
    }
  };

  fetchData();
}, [url]);




  return (
    <GestureHandlerRootView>
    <LinearGradient
      colors={['#ecf7ff', '#f3faff', '#ecf7ff']}
      locations={[0, 0.6, 1]}
      start={[0, 0]}
      end={[Math.cos(Math.PI / 12), 1]}
      style={styles.swiperContent}>

      

      <Loader visible={loader} /> 

      <View style={styles.row}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBackButtonPress}>
          <Text><FontAwesomeIcon icon={faTimes} size={30} style={globalCss.blue} /></Text>
        </TouchableOpacity>
        <ProgressBar currentIndex={index} totalCount={totalSlides} />
        <TouchableOpacity style={styles.settingsBtn} onPress={combinedOnPress} >
          <Text><FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue} /></Text>
        </TouchableOpacity>
      </View>



      <View style={styles.carousel}>
        <Carousel
          data={combinedData}
          ref={swiperRef}
          onSnapToItem={(index) => handleSlideChange(index)}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              {item.type === "carousel" ? (
                <View>
                  <Text style={styles.categoryTitle}>{item.word_en}</Text>
                  {/*<Text style={styles.categoryTitle}>{item.tophoneticsBritish}</Text>*/}
                  {/*<Text style={styles.categoryTitle}>{item.tophoneticsAmerican}</Text>*/}


                  <TouchableOpacity onPress={() => playSound(`https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/${item.word_audio}`)}>
                    <Text>
                      <FontAwesomeIcon icon={isPlaying ? faCirclePause : faCirclePlay} size={30} style={{ color: "#1f80ff" }}/>
                    </Text>
                  </TouchableOpacity>



                  <Text style={styles.categoryTitle}>{item.word_ru}</Text>
                </View>
              ) : (
                <Text style={styles.categoryTitle}>quiz: {item.answer_1}</Text>
              )}
            </View>
          )}
          sliderWidth={width}
          itemWidth={width - 70}
          paginationStyle={styles.pagination}
          contentContainerCustomStyle={styles.carouselContainer}
          layout={'default'}
          loop={false}
        />
      </View>

      <SwiperButtonsContainer
          onRightPress={handleRightButtonPress}
          isPressedContinue={isPressedContinue}
          setIsPressedContinue={setIsPressedContinue}
      />

    </LinearGradient>

    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      index={-1}
    >
      <BottomSheetView style={styles.contentBottomSheet}>
        

      <Switch
        trackColor={{ false: "#d1d1d1", true: "#4ADE80" }}
        thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor="#d1d1d1"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />


      </BottomSheetView>
    </BottomSheet>

    </GestureHandlerRootView>
  );
}

const SwiperButtonsContainer = ({onRightPress, isPressedContinue, setIsPressedContinue}) => (
  <View style={styles.swiperButtonsContainer}>
    <TouchableOpacity
      style={[globalCss.button, isPressedContinue ? [globalCss.buttonPressed, globalCss.buttonPressedBlue] : globalCss.buttonBlue]}
      onPress={onRightPress}
      onPressIn={() => setIsPressedContinue(true)}
      onPressOut={() => setIsPressedContinue(false)}
      activeOpacity={1}>
      <Text style={globalCss.buttonText}>Продолжить</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  carousel: {
    height: "75%",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: '12%',
  },
  gradient: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginTop: '10%',
    height: '7%',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 10,
    height: '90%'
  },
  swiperContent: {
    height: '100%',
  },
  progressBarContainer: {
    flex: 1,
    backgroundColor: '#3a464e',
    borderRadius: 10,
    alignSelf: 'center',
    height: '40%',
  },
  progressBar: {
    flex: 1,
    backgroundColor: '#ffeb3b',
    borderRadius: 10,
  },
  settingsBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '14%',
    height: '100%',
    paddingTop: '1%',
    textAlign: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '14%',
    height: '100%',
    paddingLeft: '2%',
    paddingRight: '1%',
    paddingTop: '1%',
    textAlign: 'center',
  },
  image: {
    width: '50%',
    height: '50%',
    objectFit: 'contain',
  },
  swiperButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: '9%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginRight: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '48%',
    alignItems: 'center',
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  contentBottomSheet:{
    height: '100%', 
  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
  template:{

  },
});
