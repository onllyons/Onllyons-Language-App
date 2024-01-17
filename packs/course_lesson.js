import React, {useState, useRef, useCallback, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import Carousel from "react-native-new-snap-carousel";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import globalCss from "./css/globalCss";
import axios from "axios";
import Toast from "react-native-toast-message";
import {ResizeMode, Video, Audio} from "expo-av";
import {useRoute} from "@react-navigation/native";

const {width} = Dimensions.get("window");

const ProgressBar = ({currentIndex, totalCount}) => {
    const progress = (currentIndex + 1) / totalCount;
    return (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]}/>
        </View>
    );
};

export default function CourseLessonQuiz({navigation}) {
    const route = useRoute()
    const url = route.params.url;
    const [isPressedContinue, setIsPressedContinue] = useState(false);
    const swiperRef = useRef(null);
    const [data, setData] = useState({});
    const [index, setIndex] = useState(0);
    const [currentSeries, setCurrentSeries] = useState(1);
    const [totalSlides, setTotalSlides] = useState(0);
    const [seriesElements, setSeriesElements] = useState([])
    const [sound, setSound] = useState();

    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    const handleRightButtonPress = useCallback(() => {
        swiperRef.current?.snapToNext();
    }, []);

    const updateProgressBar = (newIndex) => {
        setIndex(newIndex);
    };

    const updateSlider = (series) => {
        setCurrentSeries(series)

        axios.post("https://language.onllyons.com/ru/ru-en/backend/mobile_app/ajax/course/get_carousel_and_test.php", {
            url: url,
            series: series
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(({data}) => {
                if (data.success) {
                    console.log(data.questions)
                    if (!data.carousel.length && !data.questions.length) {
                        Toast.show({
                            type: "error",
                            text1: "Дальше серии нет"
                        });
                    } else {
                        setData(data)

                        setTotalSlides(Object.keys(data.carousel).length + Object.keys(data.questions).length);

                        swiperRef.current?.snapToItem(0)
                    }
                } else {
                    Toast.show({
                        type: "error",
                        text1: data.message
                    });
                }
            })
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playSound = async (name) => {
        const {sound} = await Audio.Sound.createAsync(
            {uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/content/audios/${name}`},
            {shouldPlay: true}
        );
        setSound(sound);
    };

    useEffect(() => {
        updateSlider(currentSeries)
    }, [])

    useEffect(() => {
        if (!data.carousel) return

        let seriesElementsArr = [];

        Object.keys(data.carousel).forEach((key, i) => {
            const keyStr = `carousel-${data.carousel[key].series}-${i}`

            seriesElementsArr.push(
                <View key={keyStr} style={styles.slideIn}>
                <Text>{data.carousel[key].base_title}</Text>
                <Video
                    style={styles.video}
                    source={{
                        uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/video-lessons/${data.carousel[key].file_path}`,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                />
                <Text>
                    {data.carousel[key].eng_title}
                </Text>
                <Text>
                    {data.carousel[key].rus_title}
                </Text>
            </View>
            );
        })

        Object.keys(data.questions ? data.questions : {}).forEach((key, index) => {
            let element;
            switch (data.questions[key].variant) {
                case "v":
                    element = (
                        <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn}>
                            <Text>video</Text>
                            <Video
                                style={styles.video}
                                source={{
                                    uri: `https://language.onllyons.com/ru/ru-en/packs/assest/course/content/videos/${data.questions[key].file_path}`,
                                }}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                            />
                        </View>
                    );
                    break;
                case "i":
                    element = (
                        <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn}>
                            <Text>image</Text>
                            <Text>
                                {data.questions[key].series} : {data.questions[key].v1}
                            </Text>
                        </View>
                    );
                    break;
                case "ca":
                case "a":
                    element = (
                        <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn}>
                            <Text>audio</Text>
                            <Text>
                                <TouchableOpacity
                                    onPress={() => playSound(data.questions[key].file_path)}
                                    style={styles.backBtn}
                                >
                                    <Text>
                                        Нажмите, что бы проиграть
                                    </Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                    );
                    break;
                case "ct":
                    element = (
                        <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn}>
                            <Text>clav alege</Text>
                            <Text>
                                {data.questions[key].series} : {data.questions[key].v1}
                            </Text>
                        </View>
                    );
                    break;
                case "t":
                    element = (
                        <View key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn}>
                            <Text>text in bg dde parca img</Text>
                            <Text>
                                {data.questions[key].series} : {data.questions[key].v1}
                            </Text>
                        </View>
                    );
                    break;
                default:
                    element = (
                        <Text key={`test-${data.questions[key].series}-${index}`} style={styles.slideIn}>
                            {data.questions[key].series} : {data.questions[key].v1}
                        </Text>
                    );
            }
            seriesElementsArr.push(element);
        })

        setSeriesElements(seriesElementsArr)
    }, [data])

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
                        <FontAwesomeIcon icon={faTimes} size={30} style={globalCss.gry}/>
                    </Text>
                </TouchableOpacity>
                <ProgressBar currentIndex={index} totalCount={totalSlides}/>
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
                    renderItem={({item}) => (
                        <View style={styles.slide}>
                            {item}
                        </View>
                    )}
                />
            </View>

            <SwiperButtonsContainer
                onRightPress={handleRightButtonPress}
                isPressedContinue={isPressedContinue}
                setIsPressedContinue={setIsPressedContinue}
                updateSlider={updateSlider}
                currentSeries={currentSeries}
            />
        </LinearGradient>
    );
}

const SwiperButtonsContainer = ({onRightPress, isPressedContinue, setIsPressedContinue, updateSlider, currentSeries}) => (
    <View style={{position: "relative", bottom: 40}}>
        <View style={styles.swiperButtonsContainer}>
            <TouchableOpacity
                style={[
                    globalCss.button, globalCss.buttonBlue
                ]}
                onPress={() => updateSlider(currentSeries + 1)}
                activeOpacity={1}
            >
                <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
                    Следующая серия
                </Text>
            </TouchableOpacity>
        </View>
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
    </View>

);

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: "50%",
        borderRadius: 12,
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
        justifyContent: "center"
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
        shadowOffset: {width: 0, height: 4},
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
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    input: {
        paddingVertical: 18,
        alignItems: "center",
    },
});
