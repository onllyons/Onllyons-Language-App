import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    TextInput,
    Modal,
} from "react-native";
import Carousel from "react-native-new-snap-carousel";
import {useRoute} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import Toast from "react-native-toast-message";

// components
import {CustomSound} from "../components/course/CustomSound";
import {CustomVideo} from "../components/course/CustomVideo";

// helps
import {sendDefaultRequest, SERVER_AJAX_URL, SERVER_URL} from "../utils/Requests";

// fonts
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

// icons
import {faRotateLeft, faTimes, faLightbulb} from "@fortawesome/free-solid-svg-icons";

// styles
import {stylesCourse_lesson as styles} from "../css/course_lesson.styles";
import globalCss from "../css/globalCss";
import {ContainerButtons} from "../components/course/ContainerButtons";
import {debounce} from "../utils/Utls";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {SubscribeModal} from "../components/SubscribeModal";

const {width} = Dimensions.get("window");

export const CourseLesson = ({navigation}) => {
    const route = useRoute();
    const url = route.params.url;
    const currentSeries = useRef(1);
    const [quizActive, setQuizActive] = useState(false);
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
    const [totalSlides, setTotalSlides] = useState(0);
    const [index, setIndex] = useState(0);
    const [dataFull, setDataFull] = useState(null);
    const [check, setCheck] = useState({});
    const currentCheck = useRef({});
    const swiperRef = useRef(null);
    const issetSeriesNext = useRef(true);
    const startQuizIndex = useRef(0);

    // For update progress
    const courseId = useRef(-1);
    const timeStart = useRef(Date.now())
    const indexRef = useRef(0);
    const quizActiveRef = useRef(false);
    const debouncedSaveProgress = useRef(debounce(saveProgress, 1000))

    const allowCourse = useRef(true)
    const [subscribeModalVisible, setSubscribeModalVisible] = useState(false)

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

    const checkAllowCourse = () => {
        if (!allowCourse.current) setSubscribeModalVisible(true)
    }

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
                allowCourse.current = data.allow

                if (!data.carousel.length && !data.questions.length) {
                    Toast.show({
                        type: "error",
                        text1: "Дальше серии нет",
                    });
                } else {
                    issetSeriesNext.current = data.issetSeriesNext;

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

                checkAllowCourse()
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
                        <CustomSound
                            name={dataItem.file_path}
                            url={`${SERVER_URL}/ru/ru-en/packs/assest/course/audio-lessons/${dataItem.file_path}`}
                            isFocused={allowCourse.current && indexItem === index}
                        />
                    ) : (
                        <CustomVideo
                            isFocused={allowCourse.current && indexItem === index}
                            url={`${SERVER_URL}/ru/ru-en/packs/assest/course/video-lessons/${dataItem.file_path}`}
                        />
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

                        <CustomVideo
                            url={`${SERVER_URL}/ru/ru-en/packs/assest/course/content/videos/${dataItem.file_path}`}
                            isFocused={allowCourse.current && indexItem === index}
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
                        <CustomSound
                            name={dataItem.file_path}
                            isFocused={allowCourse.current && indexItem === index}
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
                        <CustomSound
                            name={dataItem.file_path}
                            isFocused={allowCourse.current && indexItem === index}
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
                                return isCurrentWord(word, check[key], dataItem.v1, dataItem.v2) ? null : (
                                    <AnimatedButtonShadow
                                        key={`word-${wordIndex}`}
                                        onPress={() => {
                                            setValueCA(word);
                                        }}
                                        styleButton={[
                                            styles.btnQuizPositionCa,
                                            globalCss.bgGry
                                        ]}
                                        shadowColor={"gray"}
                                    >
                                        <Text style={styles.btnQuizStyleCa}>{word}</Text>
                                    </AnimatedButtonShadow>
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
                                    <AnimatedButtonShadow
                                        key={`word-${wordIndex}`}
                                        style={[
                                            styles.btnQuizPositionCa,
                                            globalCss.bgGry
                                        ]}
                                        shadowColor={"gray"}
                                        onPress={() => {
                                            setValueCT(word);
                                        }}
                                    >
                                        <Text style={styles.btnQuizStyleCa}>{word}</Text>
                                    </AnimatedButtonShadow>
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
            <SubscribeModal visible={subscribeModalVisible} setVisible={setSubscribeModalVisible}/>
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
                                <View style={[styles.slide, {width: width}]}>
                                    {drawCarouselTest(item, index)}
                                </View>
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
                    showQuizResult={showQuizResult}
                    index={index}
                    totalSlides={totalSlides}
                    allowCourse={allowCourse}
                    setSubscribeModalVisible={setSubscribeModalVisible}
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
                                    <AnimatedButtonShadow
                                        styleButton={[
                                            styles.buttonEndQuiz,
                                            globalCss.buttonGry
                                        ]}
                                        styleContainer={styles.buttonRepeatQuizContainer}
                                        shadowColor={"gray"}
                                        onPress={() => restartQuiz()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faRotateLeft}
                                            size={23}
                                            style={globalCss.blueLight}
                                        />
                                    </AnimatedButtonShadow>
                                    <AnimatedButtonShadow
                                        styleButton={[
                                            styles.buttonEndQuiz,
                                            globalCss.buttonGreen
                                        ]}
                                        styleContainer={styles.buttonEndQuizContainer}
                                        shadowColor={"green"}
                                        onPress={() => {
                                            if (issetSeriesNext.current) updateSlider(currentSeries.current + 1)
                                            else finish()
                                        }}
                                    >
                                        <Text style={styles.modalText}>
                                            {issetSeriesNext.current ? "Дальше" : "Закончить"}
                                        </Text>
                                    </AnimatedButtonShadow>
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
        showQuizResult,
        index,
        totalSlides,
        allowCourse,
        setSubscribeModalVisible
}) => (
    <View style={styles.swiperButtonsContainer}>
        <AnimatedButtonShadow
            permanentlyActive={isDisabled}
            styleButton={[
                globalCss.button,
                globalCss.buttonBlue,
                {opacity: isDisabled ? 0.5 : 1},
            ]}
            shadowColor={"blue"}
            size={"full"}
            onPress={() => {
                if (!isDisabled) {
                    if (!allowCourse.current) {
                        setSubscribeModalVisible(true)
                    } else {
                        if (index === totalSlides - 1) showQuizResult(true)
                        else onRightPress()
                    }
                }
            }}
        >
            <Text style={[globalCss.buttonText, globalCss.textUpercase]}>
                {!allowCourse.current ? "Подписаться" : (index === totalSlides - 1 ? "Завершить тест" : "Продолжить")}
            </Text>
        </AnimatedButtonShadow>
    </View>
);
