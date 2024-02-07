import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    Image,
    TextInput,
    Modal,
} from "react-native";
import Carousel from "react-native-new-snap-carousel";
import {useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import Toast from "react-native-toast-message";

// components
import {VideoCustom} from "../components/VideoCustom/VideoCustom";
import {SoundCustom} from "../components/SoundCustom/SoundCustom";

// helps
import {sendDefaultRequest, SERVER_AJAX_URL} from "../utils/Requests";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// icons
import {faRotateLeft, faTimes, faLightbulb} from "@fortawesome/free-solid-svg-icons";

// styles
import {stylesCourse_lesson as styles} from "../css/course_lesson.styles";
import globalCss from "../css/globalCss";
import {ContainerButtons} from "../components/ContainerButtons/ContainerButtons";
import {debounce} from "../utils/Utls";

const {width} = Dimensions.get("window");

export const CourseLesson = ({navigation}) => {
    const route = useRoute();
    const url = route.params.url;
    const currentSeries = useRef(1);
    const [quizActive, setQuizActive] = useState(false);
    const [isPressedContinue, setIsPressedContinue] = useState(false);
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
    const [isPressedQuizStart1, setIsPressedStartQuiz1] = useState(false);
    const [isPressedQuizRestart, setIsPressedRestartQuiz] = useState(false);
    const [totalSlides, setTotalSlides] = useState(0);
    const [index, setIndex] = useState(0);
    const [dataFull, setDataFull] = useState(null);
    const [check, setCheck] = useState({});
    const currentCheck = useRef({});
    const swiperRef = useRef(null);
    const issetSeriesNext = useRef(true);
    const quizWidth = useRef(new Animated.Value(width - 100));
    const startQuizIndex = useRef(0);
    // effect btn audio var ca
    const [buttonStates, setButtonStates] = useState({});

    // For update progress
    const courseId = useRef(-1);
    const timeStart = useRef(Date.now())
    const indexRef = useRef(0);
    const quizActiveRef = useRef(false);
    const debouncedSaveProgress = useRef(debounce(saveProgress, 1000))

    const setButtonState = (index, isPressed) => {
        setButtonStates(prevState => ({
            ...prevState,
            [index]: isPressed
        }));
    };

    const calculateCorrectPercentage = () => {
        const all = Object.values(currentCheck.current).length;
        const right = Object.values(currentCheck.current).filter((item) => item).length;
        const unRight = Object.values(currentCheck.current).filter((item) => !item).length;
        return {
            all,
            percent: (right * 100) / all,
            correctCount: right,
            wrongCount: unRight,
        };
    };


    const [showHint, setShowHint] = useState(false);

    const handleShowHint = (key, hintValue) => {
        setCheck((state) => ({
            ...state,
            [key]: hintValue,
        }));

        setShowHint(true);

        setTimeout(() => {
            setShowHint(false);
        }, 2000);
    };


    const setCurrentQuest = (key, value, currentValue) => {
        currentCheck.current = {...currentCheck.current, [key]: value === currentValue};
        setCheck((state) => ({...state, [key]: value}));
    };

    const handleBackButtonPress = () => {
        try {
            setShowCongratulationsModal(false);
            navigation.goBack();
        } catch (error) {
        }
    };

    const handleRightButtonPress = useCallback(() => {
        swiperRef.current?.snapToNext();
    }, []);

    const handleJumpToSlide = useCallback((slideIndex) => {
        swiperRef.current?.snapToItem(slideIndex);
    }, []);

    function saveProgress() {
        if (courseId.current === -1) return

        const answersCalculate = calculateCorrectPercentage()

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/course/course_progress.php`,
            {
                passesCourse: courseId.current,
                stage: {
                    series: currentSeries.current,
                    slideIndex: indexRef.current >= startQuizIndex.current ? startQuizIndex.current : indexRef.current,
                    sliderQuiz: quizActiveRef.current,
                    correctAnswers: answersCalculate.correctCount,
                    currentQuestion: indexRef.current >= startQuizIndex.current ? indexRef.current - startQuizIndex.current  : 0
                }
            },
            navigation,
            {success: false, error: false}
        )
            .then(() => {})
            .catch(() => {})
    }

    const updateProgressBar = (newIndex) => {
        // TODO tester NOW
        //console.log("dataFull[index].type", dataFull[newIndex].type);
        /* if (!quizActive && newIndex >= startQuizIndex.current) {
          Animated.timing(quizWidth.current, {
            toValue: width - 70,
            duration: 500,
            useNativeDriver: false,
          }).start();

          setQuizActive(true);
        } else if (quizActive && newIndex < startQuizIndex.current)
          setQuizActive(false);
        else if (dataFull[newIndex].type !== "carousel") */

        if (quizActive && dataFull[newIndex].type === "carousel") {
            setQuizActive(false);
            quizActiveRef.current = false
        } else if (!quizActive && dataFull[newIndex].type === "questions") {
            setQuizActive(true);
            quizActiveRef.current = true

            // Perhaps the user was scrolling too quickly
            swiperRef.current?.snapToItem(startQuizIndex.current, false);
        }

        debouncedSaveProgress.current()
        setIndex(newIndex);
        indexRef.current = newIndex
    };

    const updateSlider = (series) => {
        currentSeries.current = series;

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/course/get_carousel_and_test.php`,
            {
                url: url,
                series: series,
            },
            navigation,
            {success: false}
        )
            .then((data) => {
                if (!data.carousel.length && !data.questions.length) {
                    Toast.show({
                        type: "error",
                        text1: "Дальше серии нет",
                    });
                } else {
                    issetSeriesNext.current = data.issetSeriesNext;
                    quizWidth.current = new Animated.Value(width - 100);

                    setQuizActive(false);

                    setTotalSlides(
                        Object.keys(data.carousel).length +
                        Object.keys(data.questions).length
                    );

                    const carousel = data.carousel.map((item) => ({
                        ...item,
                        type: "carousel",
                    }));
                    const questions = data.questions.map((item) => ({
                        ...item,
                        type: "questions",
                    }));

                    startQuizIndex.current = carousel.length
                    courseId.current = data.courseId
                    currentCheck.current = {}

                    setCheck({})
                    setDataFull([...carousel, ...questions]);
                    setShowCongratulationsModal(false)
                    swiperRef.current?.snapToItem(0, false);

                    debouncedSaveProgress.current()
                }
            })
    };

    const finish = () => {
        // Finish
        setShowCongratulationsModal(false)

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/course/course_finish.php`,
            {
                passesCourse: courseId.current,
                time: Math.floor((Date.now() - timeStart.current) / 1000),
            },
            navigation,
            {success: false}
        )
            .then(() => {
                navigation.goBack();
            })
    };

    const showQuizResult = () => {
        setShowCongratulationsModal(true)
        debouncedSaveProgress.current()
    }

    const isCurrentWord = (word, checkKey, dataItemV1, dataItemV2) => {
        // TODO
        /*  console.log(
          'check[keyId].split(" ").filter((item) => item === word)',
          checkKey
        ); */
        if (word.length <= 3)
            return checkKey?.split(" ").filter((item) => item === word).length > 0;

        return checkKey && checkKey?.includes(word);
    };
    console.log("check", check);
    console.log("currentCheck", currentCheck.current);

    function restartQuiz() {
        currentCheck.current = {}
        swiperRef.current?.snapToItem(startQuizIndex.current, false);
        setShowCongratulationsModal(false)
        setCheck({})
    }

    const drawCarouselTest = (dataItem, indexItem) => {
        const key = `${dataItem.type}${indexItem}${dataItem.id}`;
        const currentQuest = dataItem[`v${dataItem.correct}`] || "";
        // TODO test data NOW
        //if (indexItem === index) console.log("dataItem", dataItem);

        if (!dataItem) return null;
        const keyStr = `carousel-${dataItem.series}-${indexItem}`;

        if (dataItem.type === "carousel")
            return (
                <View key={keyStr} style={styles.slideIn}>
                    <View style={styles.videoContainerGroup}>
                        <Text style={styles.base_title}>{dataItem.base_title}</Text>
                    </View>

                    {dataItem.file_path.includes("mp3") ? (
                        <SoundCustom
                            name={dataItem.file_path}
                            url={`https://www.language.onllyons.com/ru/ru-en/packs/assest/course/audio-lessons/${dataItem.file_path}`}
                            isFocused={indexItem === index}
                        />
                    ) : (
                        <View style={styles.videoContainer}>
                            <VideoCustom
                                index={indexItem}
                                uri={`https://language.onllyons.com/ru/ru-en/packs/assest/course/video-lessons/${dataItem.file_path}`}
                                isFocused={indexItem === index}
                            />
                        </View>
                    )}

                    <View style={styles.bgGroupTitleCourse1}>
                        <View style={styles.groupTitleCourse1}>
                            <Text style={styles.groupTitleLesson}>{dataItem.eng_title}</Text>
                        </View>
                        <View style={styles.groupTitleCourse2}>
                            <Text style={styles.groupTitleLesson}>{dataItem.rus_title}</Text>
                        </View>
                    </View>
                </View>
            );

        switch (dataItem.variant) {
            case "v":
                return (
                    <View
                        key={`test-${dataItem.series}-${indexItem}`}
                        style={styles.slideIn}
                    >
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>

                        <View style={styles.videoContainer}>
                            <VideoCustom
                                index={indexItem}
                                uri={`https://language.onllyons.com/ru/ru-en/packs/assest/course/content/videos/${dataItem.file_path}`}
                                isFocused={indexItem === index}
                            />
                        </View>

                        <ContainerButtons
                            disabled={Boolean(check[key])}
                            keyId={key}
                            checkKey={check[key]}
                            dataItemV1={dataItem.v1}
                            dataItemV2={dataItem.v2}
                            dataItemV3={dataItem.v3}
                            dataItemV4={dataItem.v4}
                            currentQuest={currentQuest}
                            setCurrentQuest={setCurrentQuest}
                        />
                    </View>
                );
            case "i":
                return (
                    <View key={`test-${dataItem.series}-${key}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>
                        <Image
                            style={styles.variantImageStyle}
                            source={{
                                uri: `https://www.language.onllyons.com/ru/ru-en/packs/assest/course/content/images/${dataItem.file_path}`,
                            }}
                        />
                        <ContainerButtons
                            disabled={Boolean(check[key])}
                            keyId={key}
                            checkKey={check[key]}
                            dataItemV1={dataItem.v1}
                            dataItemV2={dataItem.v2}
                            dataItemV3={dataItem.v3}
                            dataItemV4={dataItem.v4}
                            currentQuest={currentQuest}
                            setCurrentQuest={setCurrentQuest}
                        />
                    </View>
                );
            case "a":
                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>
                        <SoundCustom
                            name={dataItem.file_path}
                            isFocused={indexItem === index}
                        />
                        <ContainerButtons
                            disabled={Boolean(check[key])}
                            keyId={key}
                            checkKey={check[key]}
                            dataItemV1={dataItem.v1}
                            dataItemV2={dataItem.v2}
                            dataItemV3={dataItem.v3}
                            dataItemV4={dataItem.v4}
                            currentQuest={currentQuest}
                            setCurrentQuest={setCurrentQuest}
                        />
                    </View>
                );
            case "ca":
                const words = [
                    ...dataItem.v1.split(" "),
                    ...(dataItem.v2?.split(" ") || []),
                ]
                    .filter((item) => item.length > 0)
                    .sort((a, b) => b.length - a.length);
                const setValueCA = (value) => {
                    currentCheck.current = {
                        ...currentCheck.current,
                        [key]: true,
                    }

                    if (!check[key] && dataItem.v1.split(" ")[0] === value)
                        setCheck((state) => ({
                            ...state,
                            [key]: value,
                        }));
                    else if (dataItem.v1.includes(`${check[key]} ${value}`))
                        setCheck((state) => ({
                            ...state,
                            [key]: `${state[key]} ${value}`,
                        }));
                };
                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>
                        <SoundCustom
                            name={dataItem.file_path}
                            isFocused={indexItem === index}
                        />
                        <View style={[styles.inputView, styles.inputContainer1]}>
                            <TextInput
                                placeholder="Выберите правдивые слова"
                                placeholderTextColor="#a5a5a5"
                                value={check[key]}
                                editable={false}
                                style={globalCss.input}
                            />
                        </View>

                        <View style={styles.groupQuizBtn}>
                            {words.map((word, wordIndex) => {
                                const isButtonPressed = buttonStates[wordIndex] || false;

                                return isCurrentWord(word, check[key], dataItem.v1, dataItem.v2) ? null : (
                                    <TouchableOpacity
                                        key={`word-${wordIndex}`}
                                        onPress={() => {
                                            setValueCA(word);
                                        }}
                                        style={[
                                            styles.btnQuizPositionCa,
                                            isButtonPressed ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry
                                        ]}
                                        onPressIn={() => setButtonState(wordIndex, true)}
                                        onPressOut={() => setButtonState(wordIndex, false)}
                                        activeOpacity={1}
                                    >
                                        <Text style={styles.btnQuizStyleCa}>{word}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                );
            case "ct":
                const wordsTest = [
                    ...dataItem.v1.split(" "),
                    ...(dataItem.v2?.split(" ") || []),
                ]
                    .filter((item) => item.length > 0)
                    .sort((a, b) => b.length - a.length);
                const setValueCT = (value) => {
                    currentCheck.current = {
                        ...currentCheck.current,
                        [key]: true,
                    }

                    if (!check[key] && dataItem.v1.split(" ")[0] === value)
                        setCheck((state) => ({
                            ...state,
                            [key]: value,
                        }));
                    else if (
                        check[key] &&
                        dataItem.v1?.includes(`${check[key]} ${value}`)
                    )
                        setCheck((state) => ({
                            ...state,
                            [key]: `${state[key]} ${value}`,
                        }));
                };
                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>
                        <View style={[styles.inputView, styles.inputContainer1]}>
                            <TextInput
                                placeholder="Выберите правдивые слова"
                                placeholderTextColor="#a5a5a5"
                                value={check[key]}
                                editable={false}
                                style={globalCss.input}
                            />
                        </View>

                        <View style={styles.groupQuizBtn}>
                            {wordsTest.map((word, wordIndex) => {
                                // Verifică dacă butonul a fost apăsat înainte de a începe returnarea JSX
                                const isButtonPressed = buttonStates[wordIndex] || false;

                                // Continuă cu restul logicii doar dacă cuvântul curent nu este selectat
                                if (isCurrentWord(word, check[key], dataItem.v1, dataItem.v2)) {
                                    return null;
                                }

                                return (
                                    <TouchableOpacity
                                        key={`word-${wordIndex}`}
                                        style={[
                                            styles.btnQuizPositionCa,
                                            isButtonPressed ? [globalCss.cardPressed, globalCss.bgGryPressed] : globalCss.bgGry
                                        ]}
                                        onPressIn={() => setButtonState(wordIndex, true)}
                                        onPressOut={() => setButtonState(wordIndex, false)}
                                        activeOpacity={1}
                                        onPress={() => {
                                            setValueCT(word);
                                        }}
                                    >
                                        <Text style={styles.btnQuizStyleCa}>{word}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                    </View>
                );
            case "k":
                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description_text}</Text>
                            <Text style={globalCss.bold700}>{dataItem.description}</Text>
                        </View>

                        <View style={[styles.inputViewKeyboard, styles.inputContainerKeyboard]}>
                            <TextInput
                                placeholder="Напиши пропущенное слово."
                                placeholderTextColor="#a5a5a5"
                                style={styles.input}
                                value={check[key]}
                                onChangeText={(value) => {
                                    const rightValue = value.replace(
                                        /[.,\/#\!$%\^&\*;:{}=\-_`~()]/g,
                                        ""
                                    );

                                    currentCheck.current = {
                                        ...currentCheck.current,
                                        [key]:
                                        rightValue.toLocaleLowerCase().trim() ===
                                        dataItem.v1.toLocaleLowerCase(),
                                    }
                                    setCheck((state) => ({
                                        ...state,
                                        [key]: rightValue,
                                    }));
                                }}
                            />
                            <TouchableOpacity style={styles.btnGetHint}
                                              onPress={() => handleShowHint(key, dataItem.v1)}>
                                <Text style={styles.btnGetHintTxt}>
                                    <FontAwesomeIcon icon={faLightbulb} size={20} style={globalCss.whiteDarker}/>
                                </Text>
                            </TouchableOpacity>


                        </View>

                    </View>
                );
            case "t":
                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description_text}</Text>
                        </View>

                        <LinearGradient
                            colors={["#e7fff5", "#25c691"]}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={styles.imageContainerGroup}
                        >
                            <Text style={styles.baseTitleImg}>{dataItem.description}</Text>
                        </LinearGradient>

                        <ContainerButtons
                            disabled={Boolean(check[key])}
                            keyId={key}
                            checkKey={check[key]}
                            dataItemV1={dataItem.v1}
                            dataItemV2={dataItem.v2}
                            dataItemV3={dataItem.v3}
                            dataItemV4={dataItem.v4}
                            currentQuest={currentQuest}
                            setCurrentQuest={setCurrentQuest}
                        />
                    </View>
                );
            default:
                return (
                    <Text key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        ...
                    </Text>
                );
        }
    };

    useEffect(() => {
        updateSlider(currentSeries.current);
    }, []);

    return (
        <>
            <View style={styles.swiperContent}>
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
                        scrollEnabled={!quizActive}
                        ref={swiperRef}
                        data={dataFull || []}
                        sliderWidth={width}
                        itemWidth={width}
                        layout="default"
                        loop={false}
                        onSnapToItem={updateProgressBar} // Actualizează bara de progres la scroll
                        renderItem={({item, index}) => (
                            <View style={styles.slideBox}>
                                <Animated.View
                                    style={{
                                        width:
                                            startQuizIndex.current <= index
                                                ? quizWidth.current
                                                : width,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.slide,
                                            {
                                                width:
                                                    startQuizIndex.current <= index
                                                        ? width - 0
                                                        : width - 0,
                                            },
                                        ]}
                                    >
                                        {drawCarouselTest(item, index)}
                                    </View>
                                </Animated.View>
                            </View>
                        )}
                    />
                </View>
                <SwiperButtonsContainer
                    isDisabled={
                        (!check[`${dataFull?.[index]?.type}${index}${dataFull?.[index]?.id}`] && dataFull?.[index]?.type !== "carousel")
                        || ((dataFull?.[index]?.variant === "ca" || dataFull?.[index]?.variant === "ct")
                            && check[`${dataFull?.[index]?.type}${index}${dataFull?.[index]?.id}`] !== dataFull?.[index]?.v1)
                        || (dataFull?.[index]?.variant === "k"
                            && check[`${dataFull?.[index]?.type}${index}${dataFull?.[index]?.id}`]
                                .toLocaleLowerCase()
                                .trim() !== dataFull?.[index]?.v1.toLocaleLowerCase().trim())
                    }
                    onRightPress={handleRightButtonPress}
                    isPressedContinue={isPressedContinue}
                    setIsPressedContinue={setIsPressedContinue}
                    showQuizResult={showQuizResult}
                    index={index}
                    totalSlides={totalSlides}
                    onJumpToSlide={handleJumpToSlide} // ssa sterg sare btn la slaid
                />
            </View>
            {showCongratulationsModal && (
                <Modal
                    transparent={true}
                    visible={showCongratulationsModal}
                    onRequestClose={() => setShowCongratulationsModal(false)}
                >
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

                        <View style={styles.modalView}>
                            <Image
                                style={styles.succesImgQuiz}
                                source={
                                    calculateCorrectPercentage().percent >= 50
                                        ? require("../images/El/succesLesson.png")
                                        : require("../images/El/badLesson.png")
                                }
                            />

                            <View style={styles.modalContainerCenter}>
                                <View style={styles.resultQuizData}>
                                    {(() => {
                                        const {all, correctCount, wrongCount} =
                                            calculateCorrectPercentage();
                                        return (
                                            <>
                                                <View style={styles.quizDataContainer}>
                                                    <View style={styles.quizDataBackground1}>
                                                        <Text style={styles.quizDataLabel}>Правильно</Text>
                                                    </View>
                                                    <Text style={styles.quizDataCount}>
                                                        {correctCount}
                                                    </Text>
                                                </View>

                                                <View style={styles.quizDatamlmr}>
                                                    <View style={styles.quizDataBackground2}>
                                                        <Text style={styles.quizDataLabel}>Неправи..</Text>
                                                    </View>
                                                    <Text style={styles.quizDataCount}>{wrongCount}</Text>
                                                </View>

                                                <View style={styles.quizDataContainer3}>
                                                    <View style={styles.quizDataBackground3}>
                                                        <Text style={styles.quizDataLabel}>Всего</Text>
                                                    </View>
                                                    <Text style={styles.quizDataCount}>{all}</Text>
                                                </View>
                                            </>
                                        );
                                    })()}
                                </View>

                                <View style={styles.groupBtnQuizFinish}>
                                    <TouchableOpacity
                                        style={[
                                            styles.buttonRestartQuiz,
                                            styles.buttonGenQuiz,
                                            isPressedQuizRestart
                                                ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                                                : globalCss.buttonGry,
                                        ]}
                                        onPressIn={() => setIsPressedRestartQuiz(true)}
                                        onPressOut={() => setIsPressedRestartQuiz(false)}
                                        activeOpacity={1}
                                        onPress={() => restartQuiz()}
                                    >
                                        <Text style={styles.modalText}>
                                            <FontAwesomeIcon
                                                icon={faRotateLeft}
                                                size={20}
                                                style={globalCss.blueLight}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.buttonEndQuiz,
                                            styles.buttonGenQuiz,
                                            isPressedQuizStart1
                                                ? [
                                                    globalCss.buttonPressed,
                                                    globalCss.buttonPressedGreen,
                                                ]
                                                : globalCss.buttonGreen,
                                        ]}
                                        activeOpacity={1}
                                        onPressIn={() => setIsPressedStartQuiz1(true)}
                                        onPressOut={() => setIsPressedStartQuiz1(false)}
                                        onPress={() => {
                                            if (issetSeriesNext.current) updateSlider(currentSeries.current + 1)
                                            else finish()
                                        }}
                                    >
                                        <Text style={styles.modalText}>
                                            {issetSeriesNext.current ? "Дальше" : "Закончить"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

const ProgressBar = ({currentIndex, totalCount}) => {
    const progress = (currentIndex + 1) / totalCount;
    return (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]}/>
        </View>
    );
};

const SwiperButtonsContainer = ({
        isDisabled,
        onRightPress,
        isPressedContinue,
        setIsPressedContinue,
        showQuizResult,
        index,
        totalSlides,
        onJumpToSlide
    }) => (
    <View style={styles.swiperButtonsContainer}>
        {index === totalSlides - 1 ? (
            <TouchableOpacity
                disabled={isDisabled}
                style={[
                    globalCss.button,
                    isPressedContinue
                        ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
                        : globalCss.buttonBlue,
                    {opacity: isDisabled ? 0.5 : 1},
                ]}
                onPress={() => showQuizResult(true)}
                onPressIn={() => setIsPressedContinue(true)}
                onPressOut={() => setIsPressedContinue(false)}
                activeOpacity={1}
            >
                <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
                    Завершить тест
                </Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                disabled={isDisabled}
                style={[
                    globalCss.button,
                    isPressedContinue
                        ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
                        : globalCss.buttonBlue,
                    {opacity: isDisabled ? 0.5 : 1},
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

        <TouchableOpacity
            style={styles.btnabs}
            onPress={() => onJumpToSlide(17)}
            activeOpacity={1}
        >
            <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
                onJumpToSlide
            </Text>
        </TouchableOpacity>
    </View>
);
