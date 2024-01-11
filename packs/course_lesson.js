import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-new-snap-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Video, ResizeMode } from 'expo-av';
import { useRoute } from '@react-navigation/native';

import globalCss from './css/globalCss';
import Loader from "./components/Loader";

const { width } = Dimensions.get("window");

const ProgressBar = ({ currentIndex, totalCount }) => {
  const progress = (currentIndex + 1) / totalCount;
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );
};

export default function CourseLessonQuiz({ navigation }) {
  const [data, setData] = useState([]);
  const videoRefs = useRef([]);
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [index, setIndex] = useState(0);
  const totalSlides = data.length;


  const [loader, setLoader] = useState(false)

  const route = useRoute();
  const url = route.params.url;

const organizeData = (data) => {
  const sortedData = data.sort((a, b) => parseInt(a.series) - parseInt(b.series));
  const dataWithQuizzes = [];
  let currentSeries = 0;

  sortedData.forEach(item => {
    if (parseInt(item.series) !== currentSeries) {
      // Dacă am trecut la o nouă serie, adaugă slide-ul pentru quiz
      if (currentSeries !== 0) {
        dataWithQuizzes.push({ quizSlide: true });
      }
      currentSeries = parseInt(item.series);
    }
    dataWithQuizzes.push(item);
  });

  if (currentSeries !== 0) {
    dataWithQuizzes.push({ quizSlide: true });
  }

  return dataWithQuizzes;
};

  useEffect(() => {
    setLoader(true);
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_carousel.php')
      .then((response) => response.json())
      .then((responseData) => {
        const filteredData = responseData.filter(item => item.course_url === url);
        const organizedData = organizeData(filteredData);
        setData(organizedData);
      })
      .catch((error) => {
        console.error('Eroare la solicitarea HTTP: ', error);
      })
      .finally(() => setLoader(false));
  }, [url]);

useEffect(() => {
  // Aceasta este pentru gestionarea resurselor video
  return () => {
    data.forEach(item => {
      if (videoRefs.current[item.id]) {
        videoRefs.current[item.id].unloadAsync();
        videoRefs.current[item.id] = null;
      }
    });
  };
}, [data]);

  const [extractedData, setExtractedData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_test.php');
      const data = await response.json();

      const filteredData = data.filter(item => item.course_url === url);
      const organizedData = organizeData(filteredData);

      // Extrage celula "v1" pentru fiecare serie
      const extractedSeries = [];
      organizedData.forEach((item, index) => {
        if (item.quizSlide) {
          const serie = Math.floor(index / 2) + 1; // Calculează seria corespunzătoare
          extractedSeries.push(`carousel seria ${serie}`);
          extractedSeries.push(`quiz series ${serie}`);
        }
      });

      // Setează rezultatele extrase în variabila de stare
      setExtractedData(extractedSeries);
    } catch (error) {
      console.error('Eroare la solicitarea HTTP sau parsarea datelor:', error);
    }
  };

  // Apelați funcția fetchData pentru a extrage datele și afișa celula "v1".
  fetchData();

  const [isPressed, setIsPressed] = useState({
    review0: false,
    review1: false,
    review2: false,
    review3: false,
    review4: false,
    review5: false,
    review6: false,
    review7: false,
    review8: false,
    review9: false,
    review10: false,
    review11: false,
    review12: false,
  });
  // Funcția pentru actualizarea stării
  const handlePress = (buttonId, value) => {
    setIsPressed({ ...isPressed, [buttonId]: value });
  };
  // Funcția pentru renderizarea butoanelor
  const quizButtonConstruct = (id, buttonText) => (
    <TouchableOpacity
      style={[styles.button, isPressed['review' + id] ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
      onPressIn={() => handlePress('review' + id, true)}
      onPressOut={() => handlePress('review' + id, false)}
      activeOpacity={1}
    >
      <Text style={globalCss.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );

  const quizButtonTyping = (id, buttonText) => (
    <TouchableOpacity
      style={[styles.quizButtonTyping, isPressed['review' + id] ? [globalCss.buttonPressed, globalCss.buttonPressedGreen] : globalCss.buttonGreen]}
      onPressIn={() => handlePress('review' + id, true)}
      onPressOut={() => handlePress('review' + id, false)}
      activeOpacity={1}
    >
      <Text style={globalCss.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

const handleRightButtonPress = useCallback(() => {
    if (index < totalSlides - 1) {
      swiperRef.current?.snapToNext();
    }
  }, [index, totalSlides]);

const updateProgressBar = (newIndex) => {
    setIndex(newIndex);
    // Log pentru debugging
    console.log(`Index actualizat: ${newIndex}, Lungime totală: ${data.length}`);
  };

const handleSlideChange = useCallback(async (newIndex) => {
    if (newIndex === 0) {
      setIsPressedContinue(false);
    }

  if (videoRefs.current[data[index]?.id]) {
    try {
      await videoRefs.current[data[index].id].pauseAsync();
    } catch (error) {
      console.error('Eroare la oprirea videoului anterior:', error);
    }
  }


  // Activează video-ul pentru noul slide
  if (videoRefs.current[data[newIndex]?.id]) {
    try {
      await videoRefs.current[data[newIndex].id].playAsync();
    } catch (error) {
      console.error('Eroare la pornirea videoului nou:', error);
    }
  }
  updateProgressBar(newIndex);
  
}, [data, index]);

const renderItem = ({ item }) => {
    if (item.quizSlide) {
      return (
        <View style={styles.slide}>
          <Text>v1 from course_test.php series 1, series 2, series 3 ..... series 5</Text>
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        {/* Restul codului pentru slide-ul normal */}
        <View style={styles.containerVideoLesson}>
          <Video
            ref={ref => (videoRefs.current[item.id] = ref)}
            style={styles.video}
            source={{
              uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/course/content/videos/${item.file_path}`,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        </View>
        <View style={styles.textCourse}>
          <Text style={styles.textOrig}>{item.eng_title}</Text>
          <Text style={styles.textOrig}>{item.rus_title}</Text>
        </View>
      </View>
    );
  };


  return (
    <LinearGradient
      colors={['#ecf7ff', '#f3faff', '#ecf7ff']}
      locations={[0, 0.6, 1]}
      start={[0, 0]}
      end={[Math.cos(Math.PI / 12), 1]}
      style={styles.swiperContent}>

      <Loader visible={loader} />

      <View style={styles.row}>
        <TouchableOpacity onPress={handleBackButtonPress} style={styles.backBtn}>
          <Text><FontAwesomeIcon icon={faTimes} size={30} style={globalCss.gry} /></Text>
        </TouchableOpacity>
        <ProgressBar currentIndex={index} totalCount={totalSlides} />
      </View>

      <View style={styles.carousel}>
        <Carousel
          ref={swiperRef}
          data={data}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width - 70}
          layout={'default'}
          onSnapToItem={handleSlideChange}
          loop={false}
        />
      </View>

      {/* Afișează rezultatele extrase în View și Text */}
      {extractedData.map((item, index) => (
        <View key={index}>
          <Text>{item}</Text>
        </View>
      ))}
      
      <SwiperButtonsContainer
          onRightPress={handleRightButtonPress}
          isPressedContinue={isPressedContinue}
          setIsPressedContinue={setIsPressedContinue}
      />
    </LinearGradient>
  );
}

const SwiperButtonsContainer = ({onRightPress, isPressedContinue, setIsPressedContinue}) => (
    <View style={styles.swiperButtonsContainer}>
        <TouchableOpacity
            style={[globalCss.button, isPressedContinue ? [globalCss.buttonPressed, globalCss.buttonPressedBlue] : globalCss.buttonBlue]}
            onPress={onRightPress}
            onPressIn={() => setIsPressedContinue(true)}
            onPressOut={() => setIsPressedContinue(false)}
            activeOpacity={1}
        >
            <Text style={[globalCss.buttonText, globalCss.textUpercase]}>Продолжить</Text>
        </TouchableOpacity>
    </View>
);


const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: "100%",
        borderRadius: "12"
    },
    carousel:{
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

    containerVideoLesson: {
        width: '90%',
        height: '50%',
    },
    containerAudioLesson: {
        width: '55%',
        aspectRatio: 1,
        backgroundColor: '#27cad4',
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerQuizInput: {
        width: '55%',
        backgroundColor: '#27cad4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        flex: 1,
        backgroundColor: '#3a464e',
        borderRadius: 10,
        marginRight: '5%',
        alignSelf: 'center',
        height: '40%',
    },
    progressBar: {
        flex: 1,
        backgroundColor: '#ffeb3b',
        borderRadius: 10,
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
    audio: {
        color: 'white'
    },
    textCourse: {
        width: '80%',
        height: '20%',
        borderRadius: 14,
        marginTop: '5%',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    textOrig: {
        fontSize: 22,
        color: '#303030',
        textAlign: 'center',
    },
    textLearn: {
        fontSize: 18,
        color: '#404040',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    slideCourseLess: {
        width: '100%',
        paddingHorizontal: 20,
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
        // paddingVertical: 18,
        // paddingHorizontal: 32,
        alignItems: 'center',
        borderRadius: 14,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    quizBtn: {
        width: '80%',
        marginTop: '7%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
    },
    quizBtnTyping: {
        width: '80%',
        marginTop: '7%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    quizButtonTyping: {
        width: '20%',
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 14,
        marginBottom: '4%',
        marginRight: '4%',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    input: {
        paddingVertical: 18,
        alignItems: 'center',

    }
});
