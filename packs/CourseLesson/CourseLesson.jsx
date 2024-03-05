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
import {debounce, levenshtein} from "../utils/Utls";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";
import {SubscribeModal} from "../components/SubscribeModal";
import {WordConstruct} from "../components/course/WordConstruct";
import {useStore} from "../providers/StoreProvider";
import Loader from "../components/Loader";

const {width} = Dimensions.get("window");

export const CourseLesson = ({navigation}) => {
    const {setStoredValue} = useStore()
    const route = useRoute();
    const {url, category, id} = route.params;
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

    const [loading, setLoading] = useState(true)

    // For update progress
    const timeStart = useRef(Date.now())
    const indexRef = useRef(0);
    const quizActiveRef = useRef(false);
    const debouncedSaveProgress = useRef(debounce(saveProgress, 1000))
    const debouncedCheckText = useRef(debounce(checkTexts, 1000))

    const allowCourse = useRef(true)
    const [subscribeModalVisible, setSubscribeModalVisible] = useState(false)

    const sortedWords = useRef({})

    const calculateCorrectPercentage = useCallback(() => {
        const all = Object.values(currentCheck.current).length;
        const right = Object.values(currentCheck.current).filter((item) => item.value).length;
        const unRight = Object.values(currentCheck.current).filter((item) => !item.value).length;
        return {
            all,
            percent: (right * 100) / all,
            correctCount: right,
            wrongCount: unRight,
        };
    }, [])

    const handleShowHint = (key, hintValue) => {
        currentCheck.current[key] = {
            value: false,
            disableSwipe: false
        }

        setCheck((state) => ({
            ...state,
            [key]: {
                value: hintValue,
                disable: true
            },
        }));
    };


    const setCurrentQuest = useCallback((key, value, currentValue) => {
        currentCheck.current = {...currentCheck.current, [key]: {value: value === currentValue, disableSwipe: false}};
        setCheck((state) => ({...state, [key]: value}));
    }, [check])

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
        const answersCalculate = calculateCorrectPercentage()

        sendDefaultRequest(
            `${SERVER_AJAX_URL}/course/course_progress.php`,
            {
                passesCourse: id,
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
        setLoading(true)
        setIndex(0)
        swiperRef.current?.snapToItem(0, false);

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
                    currentCheck.current = {}

                    setTotalSlides(
                        Object.keys(data.carousel).length +
                        Object.keys(data.questions).length
                    );

                    const carousel = data.carousel.map((item) => ({
                        ...item,
                        type: "carousel",
                    }));

                    startQuizIndex.current = carousel.length

                    const questions = data.questions.map((item, indexItem) => {
                        const key = `questions${indexItem + startQuizIndex.current}${item.id}`
                        currentCheck.current[key] = {value: false, disableSwipe: true}

                        return {
                            ...item,
                            type: "questions",
                        }
                    })

                    startQuizIndex.current = carousel.length
                    sortedWords.current = {}

                    setQuizActive(false);
                    setShowCongratulationsModal(false)
                    setCheck({})

                    setDataFull([...carousel, ...questions]);

                    saveProgress()
                }

                checkAllowCourse()
            })
            .finally(() => {
                setLoading(false)
            })
    };

    const finish = () => {
        setLoading(true)

        const timeLesson = Math.floor((Date.now() - timeStart.current) / 1000)

        // Finish
        sendDefaultRequest(
            `${SERVER_AJAX_URL}/course/course_finish.php`,
            {
                passesCourse: id,
                time: timeLesson,
            },
            navigation,
            {success: false}
        )
            .then(() => {
                setStoredValue("lastFinishCourse", {category: category, id: id, timeLesson: timeLesson})
                navigation.goBack();
            })
            .catch(() => navigation.goBack())
            .finally(() => {
                setLoading(false)
                setShowCongratulationsModal(false)
            })
    };

    const showQuizResult = () => {
        setShowCongratulationsModal(true)
        setCheck({})
        saveProgress()
    }

    function restartQuiz() {
        swiperRef.current?.snapToItem(startQuizIndex.current, false);

        setTimeout(() => {
            Object.keys(currentCheck.current).forEach(key => {
                currentCheck.current[key].value = false
                currentCheck.current[key].disableSwipe = true
            })
            sortedWords.current = {}
            setCheck({})
            setShowCongratulationsModal(false)
        }, 200)
    }

    // Word construct

    const isUsedWordConstruct = useCallback((index, checkValue) => {
        if (!checkValue) return false

        return checkValue.indexesPressed[index] && !checkValue.indexesPressed[index].show;
    }, [])

    const setValueWordConstruct = useCallback((indexItem, indexWord, key) => {
        if (check[key]) {
            if (check[key].complete) return
            else if (check[key].indexesPressed[indexWord] && check[key].indexesPressed[indexWord].changeBg) return
        }

        const word = sortedWords.current[indexItem]["correctWords"][indexWord]
        const isLast = !sortedWords.current[indexItem]["correctWords"][indexWord + 1]

        currentCheck.current[key] = {
            value: isLast,
            disableSwipe: !isLast
        }

        if ((!check[key] || check[key].lastCorrectIndex === -1) && indexWord === 0) {
            setCheck((state) => ({
                ...state,
                [key]: {
                    text: word,
                    indexesPressed: {...(state[key] ? state[key].indexesPressed : {}), 0: {show: true, correct: true, changeBg: true}},
                    lastCorrectIndex: indexWord,
                    complete: isLast
                },
            }));
        } else if (check[key] && !check[key].isLast && check[key].lastCorrectIndex + 1 === indexWord && word) {
            setCheck((state) => ({
                ...state,
                [key]: {
                    text: `${state[key].text} ${word}`,
                    indexesPressed: {...state[key].indexesPressed, [indexWord]: {show: true, correct: true, changeBg: true}},
                    lastCorrectIndex: indexWord,
                    complete: isLast
                },
            }));
        } else {
            setCheck((state) => ({
                ...state,
                [key]: {
                    text: state[key] ? state[key].text : "",
                    indexesPressed: {...(state[key] ? state[key].indexesPressed : {}), [indexWord]: {show: true, correct: false, changeBg: true}},
                    lastCorrectIndex: state[key] ? state[key].lastCorrectIndex : -1,
                    complete: false
                },
            }));
        }

        setTimeout(() => {
            setCheck((state) => {
                if (!state[key]) {
                    state[key] = {};
                }

                if (!state[key].indexesPressed) {
                    state[key].indexesPressed = {};
                }

                if (!state[key].indexesPressed[indexWord]) {
                    state[key].indexesPressed[indexWord] = { show: false, correct: false, changeBg: false };
                }

                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        indexesPressed: {
                            ...state[key].indexesPressed,
                            [indexWord]: {
                                show: !state[key].indexesPressed[indexWord].correct,
                                correct: state[key].indexesPressed[indexWord].correct,
                                changeBg: false
                            }
                        }
                    },
                };
            });
        }, 1000)
    }, [check])

    const getSortedWordsConstruct = useCallback((indexItem, correctText, ...anotherTexts) => {
        if (sortedWords.current[indexItem]) {
            return sortedWords.current[indexItem].allWords
        } else {
            const wordsCorrect = correctText.split(" ").filter((item) => item.length > 0)
            const wordsAdd = anotherTexts.join(" ").split(" ").filter((item) => item.length > 0)

            let words = [
                ...wordsCorrect,
                ...wordsAdd,
            ]
                .map((word, index) => ([word, index]))
                .sort(() => Math.random() - 0.5)

            sortedWords.current[indexItem] = {
                allWords: words,
                correctWords: wordsCorrect
            }

            return words
        }
    }, [])

    const drawCarouselTest = (dataItem, indexItem) => {
        const key = `${dataItem.type}${indexItem}${dataItem.id}`;
        const currentQuest = dataItem[`v${dataItem.correct}`] || "";

        if (!dataItem) return null;
        const keyStr = `carousel-${dataItem.series}-${indexItem}`;

        if (dataItem.type === "carousel") {
            return (
                <View key={keyStr} style={styles.slideIn}>
                    <View style={styles.videoContainerGroup}>
                        <Text style={styles.base_title}>{dataItem.base_title}</Text>
                    </View>

                    {dataItem.file_path.includes("mp3") ? (
                        <CustomSound
                            name={dataItem.file_path}
                            url={`${SERVER_URL}/ru/ru-en/packs/assest/course/audio-lessons/${dataItem.file_path}`}
                            isFocused={!showCongratulationsModal && !loading && allowCourse.current && indexItem === index}
                        />
                    ) : (
                        <CustomVideo
                            isQuiz={false}
                            isFocused={!showCongratulationsModal && !loading && allowCourse.current && indexItem === index}
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
        }

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
                            isQuiz={true}
                            url={`${SERVER_URL}/ru/ru-en/packs/assest/course/content/videos/${dataItem.file_path}`}
                            isFocused={!showCongratulationsModal && !loading && allowCourse.current && indexItem === index}
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
                            isFocused={!showCongratulationsModal && !loading && allowCourse.current && indexItem === index}
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
                const wordsCa = getSortedWordsConstruct(indexItem, dataItem.v1, dataItem.v2)

                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>
                        <CustomSound
                            name={dataItem.file_path}
                            isFocused={!showCongratulationsModal && !loading && allowCourse.current && indexItem === index}
                        />
                        <View style={[styles.inputView, styles.inputContainer1]}>
                            <TextInput
                                placeholder="Выберите правдивые слова"
                                placeholderTextColor="#a5a5a5"
                                value={check[key] ? check[key].text : ""}
                                editable={false}
                                style={globalCss.input}
                            />
                        </View>

                        <View style={styles.groupQuizBtn}>
                            {wordsCa.map((word) => {
                                return !isUsedWordConstruct(word[1], check[key]) && (
                                    <WordConstruct key={word[1]} word={word} setValueWordConstruct={setValueWordConstruct} indexItem={indexItem} check={check[key]} keyItem={key}/>
                                );
                            })}
                        </View>
                    </View>
                );
            case "ct":
                const wordsCt = getSortedWordsConstruct(indexItem, dataItem.v1, dataItem.v2)

                return (
                    <View key={`test-${dataItem.series}-${index}`} style={styles.slideIn}>
                        <View style={styles.videoContainerGroup}>
                            <Text style={styles.base_title}>{dataItem.description}</Text>
                        </View>
                        <View style={[styles.inputView, styles.inputContainer1]}>
                            <TextInput
                                placeholder="Выберите правдивые слова"
                                placeholderTextColor="#a5a5a5"
                                value={check[key] ? check[key].text : ""}
                                editable={false}
                                style={globalCss.input}
                            />
                        </View>

                        <View style={styles.groupQuizBtn}>
                            {wordsCt.map((word) => {
                                return !isUsedWordConstruct(word[1], check[key]) && (
                                    <WordConstruct key={word[1]} word={word} setValueWordConstruct={setValueWordConstruct} indexItem={indexItem} check={check[key]} keyItem={key}/>
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
                                editable={check[key] ? !check[key].disable : true}
                                placeholder="Напиши пропущенное слово."
                                placeholderTextColor="#a5a5a5"
                                style={styles.input}
                                value={check[key] ? check[key].value : ""}
                                onChangeText={(value) => {
                                    currentCheck.current[key] = {
                                        value: false,
                                        disableSwipe: true
                                    }

                                    debouncedCheckText.current(dataItem.v1, value, 3, 3, (correct) => {
                                        if (check[key] && check[key].disable) return

                                        if (correct) {
                                            currentCheck.current[key] = {
                                                value: true,
                                                disableSwipe: false
                                            }

                                            setCheck((state) => ({
                                                ...state,
                                                [key]: {
                                                    value: value,
                                                    disable: true
                                                },
                                            }));
                                        }
                                    })

                                    setCheck((state) => ({
                                        ...state,
                                        [key]: {
                                            value: value,
                                            disable: false
                                        },
                                    }))
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

    const checkDisabledSwipeButtons = () => {
        const currentKey = `${dataFull?.[index]?.type}${index}${dataFull?.[index]?.id}`

        if (!currentCheck.current[currentKey]) return false

        return currentCheck.current[currentKey].disableSwipe
    }

    useEffect(() => {
        updateSlider(currentSeries.current);
    }, []);

    return (
        <>
            {/*<Loader visible={loading} overlayColor={"white"}/> fully white */}
            <Loader visible={loading}/>

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
                        decelerationRate={'fast'} // Ajustează această valoare pentru a controla viteza de decelerare
                        enableMomentum={false}
                        activeSlideAlignment="center" // Asigură-te că slide-ul activ este mereu centrat
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
                    isDisabled={checkDisabledSwipeButtons()}
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
                                            size={20}
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

const checkTexts = (oldText, newText, partiallyCoincidesMax = 3, allowWordDiff = 3, callback = null) => {
    const arrOldText = oldText.trim().toLowerCase().split(/[\s\n\r]+/)
    const arrNewText = newText.trim().toLowerCase().split(/[\s\n\r]+/)
    let formatNewText = newText.replace(/[,.!?]+/g, "").replace(/[\n\r]+|\s{2,}/g, " ")
    let formatOldText = oldText.replace(/[,.!?]+/g, "").replace(/[\n\r]+|\s{2,}/g, " ")
    let diffIndex = {}

    if (Math.abs(formatOldText.length - formatNewText.length) >= allowWordDiff) {
        // Разница в количестве символов более чем
        // console.log(`Разница в количестве символов более чем ${allowWordDiff}`)
        if (callback) callback(false)
        return false
    }

    function checkDifferences() {
        const arrOld = arrOldText.slice(0)
        const arrNew = arrNewText.slice(0)

        Object.keys(diffIndex).forEach(key => {
            arrNew.splice(key, 1)
        })

        for (let i = 0; i < arrOld.length; i++) {
            if (!arrNew[i]) return

            arrOld[i] = arrOld[i].replace(/[,.!?]*/g, "")
            arrNew[i] = arrNew[i].replace(/[,.!?]*/g, "")

            const diff = levenshtein(arrOld[i], arrNew[i])

            const toAddIndex = i + (diffIndex.length > 0 ? diffIndex.length : 0)

            if (diff > 0 && !diffIndex[toAddIndex]) {
                // Percentages
                const percentages = diff >= arrOld[i].length ? 100 : diff / arrOld[i].length * 100

                diffIndex[toAddIndex] = percentages

                if (percentages > 50) return checkDifferences()
            }
        }
    }

    checkDifferences()

    let partiallyCoincides = false;
    let notCoincides = false;
    let partiallyCounter = 0

    Object.keys(diffIndex).forEach(key => {
        if (diffIndex[key] > 50) {
            notCoincides = true
        } else {
            partiallyCounter++
            partiallyCoincides = true
        }
    })

    if (notCoincides || (newText.length <= 0 && oldText.length > 0)) {
        // Текст не полностью совпадает
        // console.log("Текст не совпадает")
        return false
    } else if (partiallyCoincides) {
        if (partiallyCounter <= partiallyCoincidesMax) {
            // Текст не полностью совпадает
            // console.log("Текст не полностью совпадает")
            if (callback) callback(false)
            return false
        } else {
            // Текст не полностью совпадает
            // console.log("Текст не полностью совпадает")
            if (callback) callback(false)
            return false
        }
    }

    if (callback) callback(true)
    return true
}

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
            permanentlyActiveOpacity={0.5}
            styleButton={[
                globalCss.button,
                globalCss.buttonBlue
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
