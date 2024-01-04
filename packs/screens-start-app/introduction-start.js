import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import globalCss from '../css/globalCss';

const ProgressBar = ({ currentIndex, totalCount }) => {
  const progress = (currentIndex + 1) / totalCount;
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );
};

export default function IntroductionScreen({ navigation }) {
  const swiperRef = useRef(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const [index, setIndex] = useState(0);
  const totalSlides = 6;
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
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
    colors={['#5ed472', '#4ac35f', '#31b048']}
    locations={[0, 0.6, 1]}
    start={[0, 0]}
    end={[Math.cos(Math.PI / 12), 1]}
    style={styles.swiperContent}>



        <View style={styles.row}>
          <TouchableOpacity onPress={handleBackButtonPress} style={styles.backBtn}>
            <Text><FontAwesomeIcon icon={faArrowLeft} size={30} style={globalCss.gry} /></Text>
          </TouchableOpacity>
          <ProgressBar currentIndex={index} totalCount={totalSlides} />
        </View>




        <Swiper
          ref={swiperRef}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          onIndexChanged={handleSlideChange}
        >
          <View style={styles.slide}>
            <View style={styles.containerText}>
              <Text style={styles.text}>
                 Добро пожаловать в Onllyons Language.
              </Text>
            </View>

            <Image
              source={require('../images/maket-1.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <View style={styles.slideFormInp}>
              
              <View>
                <TouchableOpacity
                  style={[styles.button, selectedLevel === 'Beginner' && styles.selectedButton]}
                  onPress={() => handleLevelSelect('Beginner')}
                >
                  <Text style={styles.buttonText}>Beginner</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, selectedLevel === 'Medium' && styles.selectedButton]}
                  onPress={() => handleLevelSelect('Medium')}
                >
                  <Text style={styles.buttonText}>Intermediate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, selectedLevel === 'Native' && styles.selectedButton]}
                  onPress={() => handleLevelSelect('Native')}
                >
                  <Text style={styles.buttonText}>Advanced</Text>
                </TouchableOpacity>
              </View>


            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.slideFormInp}>
              <Text style={styles.titleInput}>surname</Text>
              <View style={styles.inputView}>
                <TextInput
                  placeholder="login"
                  placeholderTextColor="#373737"
                  style={globalCss.input}
                />
              </View>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.slideFormInp}>
              <Text style={styles.titleInput}>username</Text>
              <View style={styles.inputView}>
                <TextInput
                  placeholder="login"
                  placeholderTextColor="#373737"
                  style={globalCss.input}
                />
              </View>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.slideFormInp}>
              <Text style={styles.titleInput}>email</Text>
              <View style={styles.inputView}>
                <TextInput
                  placeholder="login"
                  placeholderTextColor="#373737"
                  style={globalCss.input}
                />
              </View>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.slideFormInp}>
              <Text style={styles.titleInput}>passwords</Text>
              <View style={styles.inputView}>
                <TextInput
                  placeholder="login"
                  placeholderTextColor="#373737"
                  style={globalCss.input}
                />
              </View>
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
      style={[globalCss.button, isPressedContinue ? [globalCss.buttonPressed, globalCss.buttonPressedWhite] : globalCss.buttonWhite]}
      onPress={onRightPress}
      onPressIn={() => setIsPressedContinue(true)}
      onPressOut={() => setIsPressedContinue(false)}
      activeOpacity={1}
    >
      <Text style={[globalCss.buttonTextGreen, globalCss.textUpercase]}>Продолжить</Text>
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
  containerText: {
    width: '80%',
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
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
  slideFormInp:{
    width: '100%',
    paddingHorizontal: 20,
  },
  titleInput:{
    color: '#373737',
    fontWeight: '700',
    fontSize: 23,
    marginBottom: 10,
  },
  inputView:{
    borderBottomWidth: 2.1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    borderLeftWidth: 2.1,
    backgroundColor: '#e0e0e0',
    borderRightWidth: 2.1,
    paddingLeft: 12,
    borderTopWidth: 2.1,
    borderRadius: 14,
    paddingBottom: 17, 
    paddingTop: 17, 
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
  selectedButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  buttonText: {
    color: '#333',
    fontSize: 26,
  },


});
