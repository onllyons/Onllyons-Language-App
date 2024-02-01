import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import Carousel from "react-native-new-snap-carousel";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {LinearGradient} from 'expo-linear-gradient';
import globalCss from "./css/globalCss";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ResizeMode, Video, Audio } from "expo-av";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./providers/AuthProvider";
import { sendDefaultRequest, SERVER_AJAX_URL } from "./utils/Requests";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";

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
  const route = useRoute();
  const url = route.params.url;
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const swiperRef = useRef(null);
  const [data, setData] = useState({});
  const [index, setIndex] = useState(0);
  const [currentSeries, setCurrentSeries] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [seriesElements, setSeriesElements] = useState([]);
  const [sound, setSound] = useState();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const handleRightButtonPress = useCallback(() => {
    swiperRef.current?.snapToNext();
  }, []);

  const handleJumpToSlide = useCallback((slideIndex) => {
    swiperRef.current?.snapToItem(slideIndex);
  }, []);

  const updateProgressBar = (newIndex) => {
    setIndex(newIndex);
  };

  const updateSlider = (series) => {
    setCurrentSeries(series);

    sendDefaultRequest(
      `${SERVER_AJAX_URL}/course/get_carousel_and_test.php`,
      {
        url: url,
        series: series,
      },
      navigation,
      { success: false }
    )
      .then((data) => {
        if (!data.carousel.length && !data.questions.length) {
          Toast.show({
            type: "error",
            text1: "Дальше серии нет",
          });
        } else {
          setData(data);

          setTotalSlides(
            Object.keys(data.carousel).length +
              Object.keys(data.questions).length
          );

          swiperRef.current?.snapToItem(0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (name) => {
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/content/audios/${name}`,
      },
      { shouldPlay: true }
    );
    setSound(sound);
  };

  useEffect(() => {
    updateSlider(currentSeries);
  }, []);

  useEffect(() => {
    if (!data.carousel) return;

    let seriesElementsArr = [];

    Object.keys(data.carousel).forEach((key, i) => {
      const keyStr = `carousel-${data.carousel[key].series}-${i}`;

      seriesElementsArr.push(
        <View key={keyStr} style={styles.slideIn}>
          <View style={styles.videoContainerGroup}>
            <Text style={styles.base_title}>
              {data.carousel[key].base_title}
            </Text>
          </View>

          <View style={styles.videoContainer}>
            <Video
              key={`video-${key}`}
              style={styles.video}
              source={{
                uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/video-lessons/${data.carousel[key].file_path}`,
              }}
              useNativeControls
              resizeMode="cover"
            />
          </View>

          <View style={styles.bgGroupTitleCourse1}>
            <View style={styles.groupTitleCourse1}>
              <Text style={styles.groupTitleLesson}>
                {data.carousel[key].eng_title}
              </Text>
            </View>
            <View style={styles.groupTitleCourse2}>
              <Text style={styles.groupTitleLesson}>
                {data.carousel[key].rus_title}
              </Text>
            </View>
          </View>
        </View>
      );
    });

    Object.keys(data.questions ? data.questions : {}).forEach((key, index) => {
      let element;
      switch (data.questions[key].variant) {
        case "v":
          element = (
            <View
              key={`test-${data.questions[key].series}-${index}`}
              style={styles.slideIn}
            >
              <View style={styles.videoContainerGroup}>
                <Text style={styles.base_title}>
                  {data.questions[key].description}
                </Text>
              </View>

              <View style={styles.videoContainer}>
                <Video
                  style={styles.video}
                  source={{
                    uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/content/videos/${data.questions[key].file_path}`,
                  }}
                  useNativeControls
                  resizeMode="cover"
                />
              </View>

              <View style={styles.groupQuizBtn}>
                <View style={styles.btnQuizPosition1}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v1}
                  </Text>
                </View>
                <View style={styles.btnQuizPosition2}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v2}
                  </Text>
                </View>
                <View style={styles.btnQuizPosition1}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v3}
                  </Text>
                </View>
                <View style={styles.btnQuizPosition2}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v4}
                  </Text>
                </View>
              </View>
            </View>
          );
          break;
        case "i":
          element = (
            <View
              key={`test-${data.questions[key].series}-${index}`}
              style={styles.slideIn}
            >
              <View style={styles.videoContainerGroup}>
                <Text style={styles.base_title}>
                  {data.questions[key].description}
                </Text>
              </View>
              <Image
                style={styles.variantImageStyle}
                source={{
                  uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/course/content/images/${data.questions[key].file_path}`,
                }}
              />
              <View style={styles.groupQuizBtn}>
                <View style={styles.btnQuizPosition1}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v1}
                  </Text>
                </View>
                <View style={styles.btnQuizPosition2}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v2}
                  </Text>
                </View>
                <View style={styles.btnQuizPosition1}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v3}
                  </Text>
                </View>
                <View style={styles.btnQuizPosition2}>
                  <Text style={styles.btnQuizStyle}>
                    {data.questions[key].v4}
                  </Text>
                </View>
              </View>
            </View>
          );
          break;
        case "a":
          element = (
            <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn} >
              <View style={styles.videoContainerGroup}>
                <Text style={styles.base_title}>
                  {data.questions[key].description}
                </Text>
              </View>
                <TouchableOpacity
                  onPress={() => playSound(data.questions[key].file_path)}>
                  <Text style={styles.audioWord}>
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      size={40}
                      style={{ color: "#1f80ff" }}
                    />
                  </Text>
                </TouchableOpacity>

                <View style={styles.groupQuizBtn}>
                  <View style={styles.btnQuizPosition1}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v1}
                    </Text>
                  </View>
                  <View style={styles.btnQuizPosition2}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v2}
                    </Text>
                  </View>
                  <View style={styles.btnQuizPosition1}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v3}
                    </Text>
                  </View>
                  <View style={styles.btnQuizPosition2}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v4}
                    </Text>
                  </View>
                </View>

            </View>
          );
          break;
          // aici
            case "ca":
              const words = data.questions[key].v1.split(" ");
              element = (
                <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn} >
                  <View style={styles.videoContainerGroup}>
                    <Text style={styles.base_title}>
                      {data.questions[key].description}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => playSound(data.questions[key].file_path)}>
                    <Text style={styles.audioWord}>
                      <FontAwesomeIcon
                        icon={faCirclePlay}
                        size={40}
                        style={{ color: "#1f80ff" }}
                      />
                    </Text>
                  </TouchableOpacity>

                  <View style={[styles.inputView, styles.inputContainer1]}>
                      <TextInput
                          placeholder="Выберите правдивые слова"
                          placeholderTextColor="#a5a5a5"
                          editable={false}
                          style={globalCss.input}
                      />
                  </View>

                  <View style={styles.groupQuizBtn}>
                    {words.map((word, wordIndex) => (
                      <View key={`word-${wordIndex}`} style={styles.btnQuizPositionCa}>
                        <Text style={styles.btnQuizStyleCa}>
                          {word}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
              break;

        case "ct":
          element = (
            <View
              key={`test-${data.questions[key].series}-${index}`}
              style={styles.slideIn}
            >
              <Text>clav alege</Text>
              <Text>
                {data.questions[key].series} : {data.questions[key].v1}
              </Text>
            </View>
          );
          break;
        case "k":
          element = (
            <View
              key={`test-${data.questions[key].series}-${index}`}
              style={styles.slideIn}
            >
            <View style={styles.videoContainerGroup}>
              <Text style={styles.base_title}>
                {data.questions[key].description_text}
              </Text>
              <Text style={globalCss.bold700}>{data.questions[key].description}</Text>
            </View>

            <View style={[styles.inputView, styles.inputContainer1]}>
                <TextInput
                    placeholder="Напиши пропущенное слово."
                    placeholderTextColor="#a5a5a5"
                    style={globalCss.input}
                />
            </View>


            </View>
          );
          break;
        case "t":
          element = (
            <View
              key={`test-${data.questions[key].series}-${index}`}
              style={styles.slideIn}
            >
            <View style={styles.videoContainerGroup}>
              <Text style={styles.base_title}>
                {data.questions[key].description_text}
              </Text>
            </View>

            <LinearGradient
              colors={['#e7fff5', '#25c691']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageContainerGroup}
            >
              <Text style={styles.baseTitleImg}>
                {data.questions[key].description}
              </Text>
            </LinearGradient>

              <View style={styles.groupQuizBtn}>
                  <View style={styles.btnQuizPosition1}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v1}
                    </Text>
                  </View>
                  <View style={styles.btnQuizPosition2}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v2}
                    </Text>
                  </View>
                  <View style={styles.btnQuizPosition1}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v3}
                    </Text>
                  </View>
                  <View style={styles.btnQuizPosition2}>
                    <Text style={styles.btnQuizStyle}>
                      {data.questions[key].v4}
                    </Text>
                  </View>
                </View>
            </View>
          );
          break;
        default:
          element = (
            <Text
              key={`test-${data.questions[key].series}-${index}`}
              style={styles.slideIn}
            >
              error ? {data.questions[key].series} : {data.questions[key].v1}
            </Text>
          );
      }
      seriesElementsArr.push(element);
    });

    setSeriesElements(seriesElementsArr);
  }, [data]);

  return (
    <View style={styles.swiperContent}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleBackButtonPress}
          style={styles.backBtn}
        >
          <Text>
            <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.gry} />
          </Text>
        </TouchableOpacity>
        <ProgressBar currentIndex={index} totalCount={totalSlides} />
      </View>

      <View style={styles.carousel}>
        <Carousel
          ref={swiperRef}
          data={seriesElements}
          sliderWidth={width}
          itemWidth={width - 70}
          layout={"default"}
          loop={false}
          onSnapToItem={updateProgressBar} // Actualizeaza bara de progres cand faci scroll
          renderItem={({ item }) => <View style={styles.slide}>{item}</View>}
        />
      </View>

      <SwiperButtonsContainer
        onRightPress={handleRightButtonPress}
        isPressedContinue={isPressedContinue}
        setIsPressedContinue={setIsPressedContinue}
        updateSlider={updateSlider}
        currentSeries={currentSeries}
        index={index}
        totalSlides={totalSlides}
        onJumpToSlide={handleJumpToSlide} // ssa sterg sare btn la slaid
      />
    </View>
  );
}

const SwiperButtonsContainer = ({
  onRightPress,
  isPressedContinue,
  setIsPressedContinue,
  updateSlider,
  currentSeries,
  index,
  totalSlides,
  onJumpToSlide,
}) => (
  <View style={{ position: "relative", bottom: 10 }}>
    <View style={styles.swiperButtonsContainer}>
      {index === totalSlides - 1 ? (
        <TouchableOpacity
          style={[globalCss.button, globalCss.buttonBlue]}
          onPress={() => updateSlider(currentSeries + 1)}
          activeOpacity={1}
        >
          <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
            Следующая серия
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            globalCss.button,
            isPressedContinue
              ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
              : globalCss.buttonBlue,
          ]}
          onPress={onRightPress}
          onPressIn={() => setIsPressedContinue(true)}
          onPressOut={() => setIsPressedContinue(false)}
          activeOpacity={1}
        >
          <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
            Продолжить
          </Text>
        </TouchableOpacity>
      )}

      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {/* !!!!!!!! Конец курса кнопка!!!!!!!! */}
      {/* !!!!!!!! Конец курса кнопка!!!!!!!! */}
      {/* !!!!!!!! Конец курса кнопка!!!!!!!! */}
      {/* !!!!!!!! Конец курса кнопка!!!!!!!! */}
      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}      

      <TouchableOpacity
        style={styles.btnabs}
        onPress={() => onJumpToSlide(7)} // 11111111111111111111
        activeOpacity={1}
      >
        <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
          onJumpToSlide
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: "37%",
    borderRadius: 12,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  btnabs: {
    position: "absolute",
    backgroundColor: "red",
    width: "30%",
    bottom: 80,
    left: 40,
  },
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
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "90%",
    padding: 20,
  },
  slideIn: {
    flex: 1,
    justifyContent: "center",
  },
  swiperContent: {
    height: "100%",
  },

  containerVideoLesson: {
    width: "90%",
    height: "50%",
  },
  containerAudioLesson: {
    width: "55%",
    aspectRatio: 1,
    backgroundColor: "#27cad4",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  containerQuizInput: {
    width: "55%",
    backgroundColor: "#27cad4",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    flex: 1,
    backgroundColor: "#3a464e",
    borderRadius: 10,
    marginRight: "5%",
    alignSelf: "center",
    height: "40%",
  },
  progressBar: {
    flex: 1,
    backgroundColor: "#ffeb3b",
    borderRadius: 10,
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
  audio: {
    color: "white",
  },
  textCourse: {
    width: "80%",
    height: "20%",
    borderRadius: 14,
    marginTop: "5%",
    justifyContent: "center",
    backgroundColor: "white",
  },
  textOrig: {
    fontSize: 22,
    color: "#303030",
    textAlign: "center",
  },
  textLearn: {
    fontSize: 18,
    color: "#404040",
    textAlign: "center",
    fontStyle: "italic",
  },
  slideCourseLess: {
    width: "100%",
    paddingHorizontal: 20,
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
    // paddingVertical: 18,
    // paddingHorizontal: 32,
    alignItems: "center",
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  quizBtn: {
    width: "80%",
    marginTop: "7%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  quizBtnTyping: {
    width: "80%",
    marginTop: "7%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  quizButtonTyping: {
    width: "20%",
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 14,
    marginBottom: "4%",
    marginRight: "4%",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  input: {
    paddingVertical: 18,
    alignItems: "center",
  },
  bgGroupTitleCourse1: {
    marginTop: "9%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
  },
  videoContainerGroup: {
    width: "100%",
    minHeight: "11%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
    inputView: {
        borderBottomWidth: 2.1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        borderLeftWidth: 2.1,
        borderRightWidth: 2.1,
        paddingLeft: 12,
    },
    inputContainer1: {
        borderTopWidth: 2.1,
        borderRadius: 14,
        paddingBottom: 17,
        paddingTop: 17,
        paddingRight: 12,
        marginBottom: 12,
    },
  base_title: {
    color: "#212121",
    fontSize: 16,
    textAlign: "center",
  },

  groupTitleCourse1: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: "#E0E0E0",
    borderBottomWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: "3%",
  },
  groupTitleCourse2: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: "#E0E0E0",
    paddingHorizontal: "3%",
  },
  groupTitleLesson: {
    color: "#616161",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
    marginVertical: "6.5%",
  },
  groupQuizBtn: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "9%",
  },
  btnQuizStyle: {
    color: "#616161",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
    paddingVertical: "10%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  btnQuizPositionCa:{
    paddingVertical: "4%",
    paddingHorizontal: "4%",
    marginRight: '3%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  btnQuizStyleCa: {
    color: "#616161",
    fontSize: 16,
    textAlign: "center",
    
  },
  btnQuizPosition1: {
    width: "50%",
    paddingRigh: "2.5%",
    marginBottom: "2.5%",
  },
  btnQuizPosition2: {
    width: "50%",
    paddingLeft: "2.5%",
    marginBottom: "2.5%",
  },
  variantImageStyle: {
    width: "100%",
    height: "37%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  imageContainerGroup: {
    backgroundColor: 'red',
    width: "100%", 
    height: "37%",
    borderRadius: 14,
    justifyContent: "center",
  },
  baseTitleImg: {
    color: "black",
    fontWeight: '600',
    fontSize: 19,
    textAlign: "center",
    width: "100%",
    marginVertical: "6.5%",
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
