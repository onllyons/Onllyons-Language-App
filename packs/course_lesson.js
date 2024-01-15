import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-new-snap-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Video, ResizeMode } from "expo-av";
import { useRoute } from "@react-navigation/native";
import globalCss from "./css/globalCss";
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
  const [carouselData, setCarouselData] = useState([]);
  const [testData, setTestData] = useState([]);
  const route = useRoute();
  const url = route.params.url;
  const [isPressedContinue, setIsPressedContinue] = useState(false);
  const swiperRef = useRef(null);
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const urlCarousel =
    "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_carousel.php";
  const urlTest =
    "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/course_test.php";

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const handleRightButtonPress = useCallback(() => {
    swiperRef.current?.snapToNext();
  }, []);

  const updateProgressBar = (newIndex) => {
    setIndex(newIndex);
  };

  useEffect(() => {
    fetch(urlCarousel)
      .then((response) => response.json())
      .then((responseData) => {
        const filteredCarouselData = responseData.filter(
          (item_carousel) => item_carousel.course_url === url
        );
        setCarouselData(filteredCarouselData);
      })
      .catch((error) => {
        console.error("Eroare la solicitarea HTTP pentru Carousel: ", error);
      }); 

    fetch(urlTest)
      .then((response) => response.json())
      .then((responseData) => {
        const filteredTestData = responseData.filter(
          (item_test) => item_test.course_url === url
        );
        setTestData(filteredTestData);
      })
      .catch((error) => {
        console.error("Eroare la solicitarea HTTP pentru Test: ", error);
      });

    const totalSlides = carouselData.length + testData.length;
    setTotalSlides(carouselData.length + testData.length);
  }, [carouselData, testData]);

  const renderSeriesData = () => {
    let seriesElements = [];
    let maxSeriesNumber = Math.max(
      ...carouselData.map((item) => parseInt(item.series)),
      ...testData.map((item) => parseInt(item.series))
    );

    for (let series = 1; series <= maxSeriesNumber; series++) {
      const carouselItems = carouselData.filter(
        (item) => item.series === series.toString()
      );
      const testItems = testData.filter(
        (item) => item.series === series.toString()
      );

      carouselItems.forEach((item, index) => {
        seriesElements.push(
          <Text key={`carousel-${series}-${index}`}>
            {item.series} : {item.eng_title}
          </Text>
        );
      });

      testItems.forEach((item, index) => {
        let element;
        switch (item.variant) {
          case "v":
            element = (
              <View key={`test-${series}-${index}`}>
                <Text>video</Text>
                <Text>
                  {item.series} : {item.v1}
                </Text>
              </View>
            );
            break;
          case "i":
            element = (
              <View key={`test-${series}-${index}`}>
                <Text>image</Text>
                <Text>
                  {item.series} : {item.v1}
                </Text>
              </View>
            );
            break;
          case "a":
            element = (
              <View key={`test-${series}-${index}`}>
                <Text>audio</Text>
                <Text>
                  {item.series} : {item.v1}
                </Text>
              </View>
            );
            break;
          case "ct":
            element = (
              <View key={`test-${series}-${index}`}>
                <Text>clav alege</Text>
                <Text>
                  {item.series} : {item.v1}
                </Text>
              </View>
            );
            break;
          case "t":
            element = (
              <View key={`test-${series}-${index}`}>
                <Text>text in bg dde parca img</Text>
                <Text>
                  {item.series} : {item.v1}
                </Text>
              </View>
            );
            break;
          default:
            element = (
              <Text key={`test-${series}-${index}`}>
                {item.series} : {item.v1}
              </Text>
            );
        }
        seriesElements.push(element);
      });
    }

    return seriesElements;
  };

  return (
    <LinearGradient
      colors={["#ecf7ff", "#f3faff", "#ecf7ff"]}
      locations={[0, 0.6, 1]}
      start={[0, 0]}
      end={[Math.cos(Math.PI / 12), 1]}
      style={styles.swiperContent}
    >
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
          data={renderSeriesData()}
          sliderWidth={width}
          itemWidth={width - 70}
          layout={"default"}
          loop={false}
          onSnapToItem={updateProgressBar} // Actualizeaza bara de progres cand faci scroll
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text>{item}</Text>
            </View>
          )}
        />
      </View>

      <SwiperButtonsContainer
        onRightPress={handleRightButtonPress}
        isPressedContinue={isPressedContinue}
        setIsPressedContinue={setIsPressedContinue}
      />
    </LinearGradient>
  );
}

const SwiperButtonsContainer = ({
  onRightPress,
  isPressedContinue,
  setIsPressedContinue,
}) => (
  <View style={styles.swiperButtonsContainer}>
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
  </View>
);

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    borderRadius: "12",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "90%",
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
});
