import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-new-snap-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { Video, ResizeMode } from 'expo-av';
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

export default function BooksScreen({ navigation }) {
  const [data, setData] = useState([]);
  const videoRefs = useRef([]);
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [index, setIndex] = useState(0);
  const totalSlides = 7;

  const [loader, setLoader] = useState(false)

  const route = useRoute();
  const url = route.params.url;

  useEffect(() => {
    setLoader(true);

    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_carousel.php')
      .then((response) => response.json())
      .then((responseData) => {
        const filteredData = responseData.filter(item => item.course_url === url);
        setData(filteredData);
      })
      .catch((error) => {
        console.error('Eroare la solicitarea HTTP: ', error);
      })
      .finally(() => setLoader(false));
  }, [url]);


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
    swiperRef.current?.snapToNext();
  }, []);

  const handleSlideChange = useCallback((newIndex) => {
    console.log('Slide schimbat la indexul:', newIndex);
    setIndex(newIndex);
  }, []);

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

      <Carousel
        ref={swiperRef}
        data={data}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <View style={styles.containerVideoLesson}>
              <Video
                ref={ref => (videoRefs.current[index] = ref)}
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
        )}

        sliderWidth={width}
        itemWidth={width - 70}
        layout={'default'}
        loop={true}
      />

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
        height: "100%"
    },
    gradient: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginTop: '20%',
        height: '3%',
    },
    swiperContent: {
        height: '100%',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        height: 100,
        borderRadius: 10,
    },
    containerVideoLesson: {
        width: '80%',
        height: '40%',
        backgroundColor: '#616161',
        borderRadius: 14
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
        marginRight: '5%'
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
        backgroundColor: 'red',
        width: '14%',
        paddingLeft: '2%',
        paddingRight: '1%',
        textAlign: 'center',
        alignSelf: 'center'
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
        paddingHorizontal: 20,
        marginTop: 10,
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
