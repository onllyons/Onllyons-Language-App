import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

import globalCss from './css/globalCss';

const ProgressBar = ({ currentIndex, totalCount }) => {
  const progress = (currentIndex + 1) / totalCount;
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );
};

export default function BooksScreen({ navigation }) {
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [index, setIndex] = useState(0);
  const totalSlides = 6;

  const route = useRoute();
  const url = route.params.url;

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_lesson.php')
      .then((response) => response.json())
      .then((responseData) => {
        // Extrageți 'rus_title' din datele primite și setați-l în stare
        const rusTitles = responseData.map((item) => item.rus_title);
        setData(rusTitles);
      })
      .catch((error) => {
        console.error('Eroare la solicitarea HTTP: ', error);
      });
  }, []);
  // quiz btn
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
    swiperRef.current?.scrollBy(1);
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

        <View style={styles.row}>
          <TouchableOpacity onPress={handleBackButtonPress} style={styles.backBtn}>
            <Text><FontAwesomeIcon icon={faTimes} size={30} style={globalCss.gry} /></Text>
          </TouchableOpacity>
          <ProgressBar currentIndex={index} totalCount={totalSlides} />
        </View>


        <Text style={styles.textOrig}>
         Сылка урока: {url}
        </Text>

        <Swiper
          ref={swiperRef}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          onIndexChanged={handleSlideChange}
        >
          <View style={styles.slide}>
            <View style={styles.containerVideoLesson}>
              <Text style={styles.text}>
                video: https://www.language.onllyons.com/ru/ru-en/packs/assest/course/content/videos/hello1.mp4
              </Text>
            </View>
            <View style={styles.textCourse}>
              <Text style={styles.textOrig}>
                txt eng
              </Text>
              <Text style={styles.textLearn}>
                txt rus
              </Text>
            </View>

          </View>
          <View style={styles.slide}>
            <View style={styles.containerAudioLesson}>
              <Text style={styles.faVolumeHigh}>
                <FontAwesomeIcon icon={faVolumeHigh} size={70} style={styles.audio} />
              </Text>
            </View>
            <View style={styles.textCourse}>
              <Text style={styles.textOrig}>
                txt eng
              </Text>
              <Text style={styles.textLearn}>
                txt rus
              </Text>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.containerAudioLesson}>
              <Text style={styles.faVolumeHigh}>
                <FontAwesomeIcon icon={faVolumeHigh} size={70} style={styles.audio} />
              </Text>
            </View>
            <View style={styles.quizBtn}>

              {quizButtonConstruct(0, 'btn1')}
              {quizButtonConstruct(1, 'btn2')}
              {quizButtonConstruct(2, 'btn3')}
              {quizButtonConstruct(3, 'btn4')}

            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.containerQuizInput}>
              <TextInput
                style={styles.input}
                placeholder="сформулируйте правильный ответ"
              />
            </View>
            <View style={styles.quizBtnTyping}>

              {quizButtonTyping(4, 'a')}
              {quizButtonTyping(5, 'b')}
              {quizButtonTyping(6, 'c')}
              {quizButtonTyping(7, 'd')}
              {quizButtonTyping(8, 'e')}
              {quizButtonTyping(9, 'f')}
              {quizButtonTyping(10, 'g')}
              {quizButtonTyping(11, 'h')}
              {quizButtonTyping(12, 'i')}

            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.slideCourseLess}>
              <Text style={styles.text}>
                55555555555
              </Text>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.slideCourseLess}>
              <Text style={styles.text}>
                6666666666
              </Text>
            </View>
          </View>
        </Swiper>
        <SwiperButtonsContainer
          onRightPress={handleRightButtonPress}
          isPressedContinue={isPressedContinue}
          setIsPressedContinue={setIsPressedContinue}
        />
    </LinearGradient>
  );
}

const SwiperButtonsContainer = ({ onRightPress, isPressedContinue, setIsPressedContinue }) => (
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
    paddingBottom: '10%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerVideoLesson: {
    width: '80%',
    height: '40%',
    backgroundColor: '#616161',
    borderRadius: '20%'
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
  audio:{
    color: 'white'
  },
  textCourse:{
    width: '80%',
    height: '20%',
    borderRadius: '20%',
    marginTop: '5%',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textOrig:{
    fontSize: 22,
    color: '#303030',
    textAlign: 'center',
  },
  textLearn:{
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
    borderRadius: 14,
  },
  quizBtn:{
    width: '80%',
    marginTop: '7%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  quizBtnTyping:{
    width: '80%',
    marginTop: '7%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  button:{
    width: '48%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: '4%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  quizButtonTyping:{
    width: '20%',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: '4%',
    marginRight: '4%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  input:{
    paddingVertical: 18,
    alignItems: 'center',
    
  }
});
