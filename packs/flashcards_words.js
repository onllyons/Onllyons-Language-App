import React, {useState, useEffect, useRef, useMemo, useCallback,} from "react";
import {View, Text, Modal, Image, TouchableOpacity, Dimensions, Switch, StyleSheet,} from "react-native";
import * as Haptics from "expo-haptics";
import Carousel from "react-native-new-snap-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes, faRotateLeft, faGear, faCirclePlay, faCirclePause,} from "@fortawesome/free-solid-svg-icons";
import BottomSheet, {BottomSheetView, BottomSheetBackdrop,} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Audio} from "expo-av";
import Loader from "./components/Loader";

import globalCss from "./css/globalCss";

const {width} = Dimensions.get("window");

export default function FlashCardsLearning({route, navigation}) {
    const [combinedData, setCombinedData] = useState([]);
    const [index, setIndex] = useState(0);
    const totalSlides = combinedData.length;

    const {url} = route.params;
    const swiperRef = useRef(null);
    const [isPressedContinue, setIsPressedContinue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPressedQuizStart, setIsPressedStartQuiz] = useState(false);
    const [isPressedQuizStart1, setIsPressedStartQuiz1] = useState(false);
    const [isPressedQuizRestart, setIsPressedRestartQuiz] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabledUsa, setIsEnabledUsa] = useState(true);
    const [showCongratulationsModal, setShowCongratulationsModal] = useState(false); //modal end quiz

    const [carouselData, setCarouselData] = useState([]);
    const [quizData, setQuizData] = useState([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [isAtLastCarouselSlide, setIsAtLastCarouselSlide] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [carouselIndex, setCarouselIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);

    // effects btn
    const [checkQuizAnswers, setCheckQuizAnswers] = useState({});
    const handlePressIn = (questionId, answerIndex) => {
        setCheckQuizAnswers((prevState) => ({
            ...prevState,
            [`${questionId}_${answerIndex}`]: true
        }));
    };

    const handlePressOut = (questionId, answerIndex) => {
        setCheckQuizAnswers((prevState) => ({
            ...prevState,
            [`${questionId}_${answerIndex}`]: false
        }));
    };


    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
        // Salvare în AsyncStorage
        AsyncStorage.setItem("isEnabled", JSON.stringify(!isEnabled))
            .then(() => {
                console.log(
                    "Valoarea isEnabled a fost salvată cu succes în AsyncStorage."
                );
            })
            .catch((error) => {
                console.error("Eroare la salvarea în AsyncStorage:", error);
            });
    };

    const fetchCarouselData = async () => {
        try {
            const response = await fetch(
                "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-carousel.php"
            );
            let data = await response.json();
            data = data.filter((item) => item.url_display === url); // Filtrare după URL
            setCarouselData(data);

            // Calculează lungimea datelor și actualizează combinedData
            setCombinedData(data);
        } catch (error) {
            console.error("Error fetching carousel data:", error);
        }
    };

    // Încărcarea datelor pentru Quiz, filtrate după URL
    const fetchQuizData = async () => {
        try {
            const response = await fetch(
                "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-quiz.php"
            );
            const data = await response.json();
            const filteredData = data.filter((item) => item.quiz_url === url);
            setQuizData(filteredData); // Setează datele quizului
            return filteredData;
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            return []; // Întoarce un array gol în caz de eroare
        }
    };


    useEffect(() => {
        setIsLoading(true); // Activează loader-ul

        const fetchData = async () => {
            try {
                await fetchCarouselData(); // Așteaptă finalizarea primei cereri
                await fetchQuizData(); // Așteaptă finalizarea celei de-a doua cereri
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false); // Dezactivează loader-ul după finalizarea ambelor cereri
            }
        };

        fetchData();
    }, [url]); // Include url ca dependență


    const handleShowQuiz = async () => {
        setIsLoading(true);
        try {
            const data = await fetchQuizData();
            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid data received');
            }
            setShowQuiz(true);
            setQuizIndex(0);
            setIndex(0);
            setCombinedData(data); // Setează datele combinării cu datele quizului
            setShowModal(false);
            swiperRef.current?.snapToItem(0); // Navigați explicit la primul slide
        } catch (error) {
            console.error("Error:", error);
            setCombinedData([]);
        } finally {
            setIsLoading(false);
        }
    };


    const restartQuiz = async () => {
        setIsLoading(true);
        try {
            const data = await fetchQuizData();
            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid data received');
            }

            if (data && Array.isArray(data)) {
                setCombinedData(data);
                setQuizData(data); // Asigurați-vă că quizData este actualizat
                setQuizIndex(0);
                setIndex(0);
                setSelectedAnswers({});
                setAnswersCorrectness({});
                setIsAnswerSelected(false);
                setShowCongratulationsModal(false);
                setShowQuiz(true);
                setShowModal(false);
                swiperRef.current?.snapToItem(0); // Navigați explicit la primul slide
            } else {
                throw new Error('Invalid data received');
            }
        } catch (error) {
            console.error("Error occurred: ", error);
            setCombinedData([]);
        } finally {
            setIsLoading(false);
        }
    };


    const toggleSwitchUsa = () => {
        setIsEnabledUsa((previousState) => !previousState);
        // Salvare în AsyncStorage
        AsyncStorage.setItem("isEnabledUsa", JSON.stringify(!isEnabledUsa))
            .then(() => {
                console.log("succes");
            })
            .catch((error) => {
                console.error("error:", error);
            });
    };

    // Recuperare stării din AsyncStorage la încărcarea componentei
    useEffect(() => {
        // Verificarea stării isEnabled
        AsyncStorage.getItem("isEnabled")
            .then((value) => {
                if (value !== null) {
                    setIsEnabled(JSON.parse(value));
                }
            })
            .catch((error) => {
                console.error("error", error);
            });

        // Verificarea stării isEnabledUsa
        AsyncStorage.getItem("isEnabledUsa")
            .then((value) => {
                if (value !== null) {
                    setIsEnabledUsa(JSON.parse(value));
                }
            })
            .catch((error) => {
                console.error("error:", error);
            });

        // Verificarea stării quizShown
        AsyncStorage.getItem("quizShown")
            .then((value) => {
                if (value === "true") {
                    setShowModal(false); // Nu afișa modalul dacă quiz-ul a fost deja deschis
                }
            })
            .catch((error) => {
                console.error("Eroare la citirea din AsyncStorage:", error);
            });
    }, []);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);

    // moddal deschided de jso
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
    const handleOpenPress = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={1}
            />
        ),
        []
    );

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const combinedOnPress = () => {
        handleOpenPress();
        handlePress();
    };

    useEffect(() => {
        console.log("Index changed: ", index);
        // Aici puteți adăuga orice logică suplimentară necesară când indexul se schimbă
    }, [index]);


    const ProgressBar = ({currentIndex, totalCount}) => {
        const progress = (currentIndex + 1) / totalCount;
        return (
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, {width: `${progress * 100}%`}]}/>
            </View>
        );
    };

    const playSound = async (audioUrl) => {
        // Verifică dacă sunetul curent este în curs de redare și așteaptă finalizarea
        if (currentSound && isPlaying) {
            await currentSound.stopAsync(); // Oprire înainte de a începe redarea următoare
            setIsPlaying(false);
        }

        // Descarcă sunetul curent (dacă există)
        if (currentSound) {
            await currentSound.unloadAsync();
        }

        // Crează un nou sunet și redă-l
        const newSound = new Audio.Sound();
        try {
            await newSound.loadAsync({uri: audioUrl});
            await newSound.playAsync();
            setCurrentSound(newSound);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isPlaying && status.didJustFinish) {
                    setIsPlaying(false);
                    newSound.unloadAsync();
                }
            });
        } catch (error) {
            console.error("Eroare la redarea sunetului:", error);
        }
    };

    const handleBackButtonPress = () => {
        navigation.goBack();
    };

    const updateProgressBar = (newIndex) => {
        setIndex(newIndex);

        const isAtLastSlide = newIndex === combinedData.length - 1; // Verifică dacă este ultimul slide
        setIsAtLastCarouselSlide(isAtLastSlide);
    };

    const lastCarouselIndex = combinedData.findIndex(
        (item) => item.type !== "carousel"
    );

    const handleSlideChange = (newIndex) => {

        console.log("handleSlideChange - New Index: ", newIndex);

        if (showQuiz) {
            setQuizIndex(newIndex); // Actualizăm indexul pentru quiz
            console.log(
                `Index quiz: ${newIndex + 1}, Lungime totală quiz: ${quizData.length}`
            );
        } else {
            setCarouselIndex(newIndex); // Actualizăm indexul pentru carusel
            console.log(
                `Index carousel: ${newIndex + 1}, Lungime totală carousel: ${
                    carouselData.length
                }`
            );
        }

        updateProgressBar(newIndex);
        setRandomOrder([1, 2, 3, 4].sort(() => Math.random() - 0.5));

        setIndex(newIndex);
        setIsAnswerSelected(false); // Resetați starea când se schimbă slide-ul

        // Verifică dacă este ultimul slide
        const isAtLastSlide = newIndex === combinedData.length - 1;
        setIsAtLastCarouselSlide(isAtLastSlide); // Setează starea în funcție de poziția curentă

        setIsAnswerSelected(false); // Resetați starea când se schimbă slide-ul

        // Verifică dacă quiz-ul este afișat și dacă slide-ul curent are audio
        const currentSlide = showQuiz ? quizData[newIndex] : carouselData[newIndex];
        if (!showQuiz && currentSlide && currentSlide.word_audio) {
            const audioUrl = `https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/${currentSlide.word_audio}`;
            playSound(audioUrl);
        }

        if (
            (showQuiz && newIndex === quizData.length) ||
            (!showQuiz && newIndex === carouselData.length)
        ) {
            setIndex(0);
        }
    };

    const handleRightButtonPress = () => {
        if (isAtLastCarouselSlide && !showQuiz) {
            // Dacă este ultimul slide și quiz-ul nu este afișat, afișează modalul
            setShowModal(true);
        } else if (index < totalSlides - 1) {
            // Altfel, avansează la următorul slide
            swiperRef.current?.snapToNext();
            const newIndex = index + 1;
            setIndex(newIndex); // Actualizează indexul la următorul slide
        }
    };

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answersCorrectness, setAnswersCorrectness] = useState({});
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [randomOrder, setRandomOrder] = useState([]);
    // Modificați funcția pentru a primi argumentele necesare
    const handleSelectAnswer = (questionId, answerIndex, correctAnswer) => {
        // Verificați dacă pentru această întrebare a fost deja dat un răspuns
        if (selectedAnswers[questionId] !== undefined) {
            return; // Dacă da, nu faceți nimic (nu permiteți schimbarea răspunsului)
        }

        const correctAnswerIndex = parseInt(correctAnswer, 10);
        setSelectedAnswers((prevState) => ({
            ...prevState,
            [questionId]: answerIndex,
        }));
        setAnswersCorrectness((prevState) => ({
            ...prevState,
            [questionId]: answerIndex === correctAnswerIndex,
        }));
        setIsAnswerSelected(true);
    };


    const handleFinishQuiz = () => {
        // Aici puteți seta state-ul pentru afișarea modalului de felicitări
        setShowCongratulationsModal(true);
    };

// colectam raspunsurile utilizatorilor
    const countQuizResults = () => {
        let correctCount = 0;
        let wrongCount = 0;

        Object.values(answersCorrectness).forEach(isCorrect => {
            if (isCorrect) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        return {correctCount, wrongCount};
    };
// aflam procentaj si afisam imagine 70 or 30 %
    const calculateCorrectPercentage = () => {
        const {correctCount} = countQuizResults();
        return (correctCount / quizData.length) * 100;
    };


    const renderItem = ({item}) => {
        if (showQuiz) {
            return (
                <View style={styles.slide}>
                    <View style={styles.groupBtnQuiz}>
                        <Text style={styles.headerText}>{item.question}</Text>
                        {randomOrder.map((answerIndex) => (
                            <TouchableOpacity
                                key={answerIndex}
                                style={[
                                    styles.quizBtnCtr,
                                    globalCss.buttonGry,
                                    selectedAnswers[item.id] === answerIndex &&
                                    answersCorrectness[item.id] ? globalCss.correct : null,
                                    selectedAnswers[item.id] === answerIndex &&
                                    !answersCorrectness[item.id] ? globalCss.incorrect : null,
                                    checkQuizAnswers[`${item.id}_${answerIndex}`]
                                        ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                                        : null,
                                ]}
                                onPress={() =>
                                    handleSelectAnswer(item.id, answerIndex, item.answer_correct)
                                }
                                onPressIn={() => handlePressIn(item.id, answerIndex)}
                                onPressOut={() => handlePressOut(item.id, answerIndex)}
                                activeOpacity={1}
                                disabled={selectedAnswers[item.id] !== undefined} // Dezactivați butonul dacă a fost selectat un răspuns
                            >
                                <Text style={[ styles.answerFlashcard,
                                    selectedAnswers[item.id] === answerIndex ? {color: 'white'} : globalCss.blueLight
                                ]}>
                                    {item[`answer_${answerIndex}`]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        } else {
            // Afișați slide-urile Carousel asdf
            return (
                <View style={styles.slide}>
                    <View style={styles.groupEng}>
                        <Text style={styles.word_en}>{item.word_en}</Text>
                        <Text
                            style={
                                isEnabled ? styles.tophoneticsAmerican : {display: "none"}
                            }
                        >
                            brit: / {item.tophoneticsBritish} /
                        </Text>
                        <Text
                            style={
                                isEnabledUsa ? styles.tophoneticsBritish : {display: "none"}
                            }
                        >
                            usa: / {item.tophoneticsAmerican} /
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            playSound(
                                `https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/${item.word_audio}`
                            )
                        }
                    >
                        <Text style={styles.audioWord}>
                            <FontAwesomeIcon
                                icon={isPlaying ? faCirclePause : faCirclePlay}
                                size={40}
                                style={{color: "#1f80ff"}}
                            />
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.word_ru}>{item.word_ru}</Text>
                </View>
            );
        }
    };

    return (
        <GestureHandlerRootView>
            <View style={[
              styles.swiperContent,
              { backgroundColor: showQuiz ? 'white' : 'transparent' }
            ]}>
                <Loader visible={isLoading}/>

                <View style={styles.row}>
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
                    <ProgressBar
                        currentIndex={index}
                        totalCount={showQuiz ? quizData.length : carouselData.length}
                    />

                    <TouchableOpacity
                        style={styles.settingsBtn}
                        onPress={combinedOnPress}
                    >
                        <Text>
                            <FontAwesomeIcon icon={faGear} size={30} style={globalCss.blue}/>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.carousel}>
                    <Carousel
                        key={showQuiz ? "quizCarousel" : "learningCarousel"}
                        data={showQuiz ? quizData : carouselData}
                        ref={swiperRef}
                        sliderWidth={width}
                        itemWidth={showQuiz ? width - 0 : width - 70}
                        paginationStyle={styles.pagination}
                        contentContainerCustomStyle={styles.carouselContainer}
                        layout={"default"}
                        loop={false}
                        onSnapToItem={handleSlideChange}
                        renderItem={renderItem}
                        firstItem={showQuiz ? quizIndex : carouselIndex}
                        scrollEnabled={!showQuiz} // Dezactivează scroll-ul când showQuiz este adevărat
                    />
                </View>

                <SwiperButtonsContainer
                    onRightPress={handleRightButtonPress}
                    isPressedContinue={isPressedContinue}
                    setIsPressedContinue={setIsPressedContinue}
                    swiperRef={swiperRef}
                    isAnswerSelected={isAnswerSelected}
                    showQuiz={showQuiz}
                    currentIndex={index}
                    totalSlides={showQuiz ? quizData.length : carouselData.length}
                    onFinishQuiz={handleFinishQuiz}
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
                                    calculateCorrectPercentage() >= 50
                                        ? require("./images/El/succesLesson.png")
                                        : require("./images/El/badLesson.png")
                                }
                            />

                            <View style={styles.modalContainerCenter}>
                                <View style={styles.resultQuizData}>
                                    {
                                        (() => {
                                            const {correctCount, wrongCount} = countQuizResults();
                                            return (
                                                <>
                                                    <View style={styles.quizDataContainer}>
                                                        <View style={styles.quizDataBackground1}>
                                                            <Text style={styles.quizDataLabel}>Правильно</Text>
                                                        </View>
                                                        <Text style={styles.quizDataCount}>{correctCount}</Text>
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
                                                        <Text style={styles.quizDataCount}>{quizData.length}</Text>
                                                    </View>
                                                </>
                                            );
                                        })()
                                    }
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
                                        onPress={restartQuiz}>
                                        <Text style={styles.modalText}>
                                            <FontAwesomeIcon
                                                icon={faRotateLeft}
                                                size={20}
                                                style={globalCss.blueLight}
                                            />
                                        </Text>
                                    </TouchableOpacity>
                                    {/*1111111111111111111111*/}

                                    <TouchableOpacity
                                        style={[
                                            styles.buttonEndQuiz,
                                            styles.buttonGenQuiz,
                                            isPressedQuizStart1
                                                ? [globalCss.buttonPressed, globalCss.buttonPressedGreen]
                                                : globalCss.buttonGreen,
                                        ]}
                                        onPressIn={() => setIsPressedStartQuiz1(true)}
                                        onPressOut={() => setIsPressedStartQuiz1(false)}
                                        activeOpacity={1}
                                        onPress={handleBackButtonPress}
                                    >
                                        <Text style={styles.modalText}>Дальше</Text>
                                    </TouchableOpacity>
                                </View>

                                
                            </View>
                        </View>
                    </View>
                </Modal>
            )}


            {showModal && (
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

                    <Image
                        style={styles.succesImg}
                        source={require("./images/El/succes.png")}
                    />
                    <View style={styles.modalContainerCenter}>
                        <Text style={styles.succesText}>
                            Поздравляю, вы успешно завершили урок! Нажмите на кнопку ниже,
                            чтобы начать тест.
                        </Text>
                        <TouchableOpacity
                            style={[
                                globalCss.button,
                                styles.buttonGenQuiz,
                                isPressedQuizStart
                                    ? [globalCss.buttonPressed, globalCss.buttonPressedGreen]
                                    : globalCss.buttonGreen,
                            ]}
                            onPressIn={() => setIsPressedStartQuiz(true)}
                            onPressOut={() => setIsPressedStartQuiz(false)}
                            activeOpacity={1}
                            onPress={handleShowQuiz}
                        >
                            <Text style={[styles.modalText, globalCss.textUpercase]}>начать тест</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
                index={-1}
            >
                <BottomSheetView style={styles.contentBottomSheet}>
                    <View style={styles.settingsGroup}>
                        <Text style={styles.settingsIPA}>Американское произношение</Text>

                        <Switch
                            trackColor={{false: "#d1d1d1", true: "#4ADE80"}}
                            thumbColor={isEnabledUsa ? "#ffffff" : "#f4f3f4"}
                            ios_backgroundColor="#d1d1d1"
                            onValueChange={toggleSwitchUsa}
                            value={isEnabledUsa}
                        />
                    </View>

                    <View style={styles.settingsGroup}>
                        <Text style={styles.settingsIPA}>Британское произношение</Text>

                        <Switch
                            trackColor={{false: "#d1d1d1", true: "#4ADE80"}}
                            thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
                            ios_backgroundColor="#d1d1d1"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const SwiperButtonsContainer = ({
        onRightPress,
        isPressedContinue,
        setIsPressedContinue,
        swiperRef,
        isAnswerSelected,
        showQuiz,
        currentIndex, // Indexul curent al slide-ului
        totalSlides, // Numărul total de slide-uri
        onFinishQuiz, // Funcția care va fi apelată când se finalizează quizul
    }) => (
    <View style={styles.swiperButtonsContainer}>
        {showQuiz && currentIndex === totalSlides - 1 ? (
            // Dacă este ultimul slide al quizului, afișează butonul "Finalizează quiz"
            <TouchableOpacity
                style={[
                    globalCss.button,
                    globalCss.buttonBlue,
                    !isAnswerSelected ? styles.buttonInactive : {}, // Aplică stilul inactiv dacă nu este selectat un răspuns
                ]}
                onPress={() => {
                    if (isAnswerSelected) {
                        onFinishQuiz(); // Apelarea funcției doar dacă un răspuns este selectat
                    }
                }}
                onPressIn={() => setIsPressedContinue(true)}
                onPressOut={() => setIsPressedContinue(false)}
                activeOpacity={1}
                disabled={!isAnswerSelected} // Dezactivează funcționalitatea onPress dacă nu este selectat un răspuns
            >
                <Text
                    style={[
                        styles.buttonTextNext,
                        globalCss.textUpercase,
                        !isAnswerSelected ? { color: "#8895bc" } : {}, // Schimbă culoarea textului dacă butonul este inactiv
                    ]}
                >
                    Завершить тест
                </Text>
            </TouchableOpacity>
        ) : (
            // Altfel, afișează butonul standard de navigare
            <TouchableOpacity
                style={[
                    globalCss.button,
                    isPressedContinue
                        ? [globalCss.buttonPressed, globalCss.buttonPressedBlue]
                        : globalCss.buttonBlue,
                    !isAnswerSelected && showQuiz && styles.buttonInactive,
                ]}
                onPress={() => {
                    if (swiperRef && swiperRef.current) {
                        if (!showQuiz || isAnswerSelected) {
                            onRightPress(); // Execută pentru navigarea standard în carusel sau quiz
                        }
                    }
                }}
                onPressIn={() => setIsPressedContinue(true)}
                onPressOut={() => setIsPressedContinue(false)}
                activeOpacity={1}
                disabled={!isAnswerSelected && showQuiz} // Dezactivează butonul în modul quiz fără răspuns selectat
            >
                <Text
                    style={[
                        styles.buttonTextNext, globalCss.textUpercase,
                        !isAnswerSelected && showQuiz && {color: "#8895bc"},
                    ]}
                >
                    {showQuiz ? "Продолжить" : "Продолжить"}
                </Text>
            </TouchableOpacity>
        )}
    </View>
);


const styles = StyleSheet.create({
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
    buttonTextNext: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
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
    progressBarContainer: {
        flex: 1,
        backgroundColor: "#3a464e",
        borderRadius: 10,
        alignSelf: "center",
        height: "40%",
    },
    progressBar: {
        flex: 1,
        backgroundColor: "#ffeb3b",
        borderRadius: 10,
    },
    settingsBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width: "14%",
        height: "100%",
        paddingTop: "1%",
        textAlign: "center",
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
        alignItems: "center",
        borderRadius: 14,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    contentBottomSheet: {
        height: "100%",
    },
    groupEng: {
        marginBottom: "10%",
    },
    word_en: {
        fontSize: 30,
        color: "#535353",
        textTransform: "capitalize",
        fontWeight: "500",
        textAlign: "center",
    },
    tophoneticsBritish: {
        textAlign: "center",
        color: "#0036ff",
        fontWeight: "300",
        fontSize: 20,
    },
    tophoneticsAmerican: {
        textAlign: "center",
        color: "#0036ff",
        fontWeight: "300",
        fontSize: 20,
    },
    word_ru: {
        fontSize: 30,
        color: "#535353",
        textTransform: "capitalize",
        fontWeight: "500",
        textAlign: "center",
    },
    audioWord: {
        alignSelf: "center",
        marginBottom: "10%",
    },
    settingsGroup: {
        paddingHorizontal: 20,
        marginBottom: "2%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
    settingsIPA: {
        fontSize: 18,
        fontWeight: "500",
        color: "#343541",
        flex: 1,
    }, 

    groupBtnQuiz: {
        maxWidth: "80%",
        alignContent: "center",
    },
    groupBtnQuizFinish: {
        flexDirection: 'row',
    },
    quizBtnCtr: {
        minWidth: "100%",
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: "center",
        borderRadius: 14,
        marginBottom: 20,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: "10%",
    },
    buttonInactive: {
        backgroundColor: "#f1f0f0",
        shadowColor: "#cbcbcb",
    },
    succesImg: {
        alignSelf: "center",
        marginBottom: "2.9%",
        width: "100%",
        height: "50%",
        resizeMode: "contain",
        marginTop: "4%",
    },
    modalContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        paddingTop: "10%",
        alignItems: "flex-start",
        alignContent: "flex-start",
        zIndex: 999,
    },
    modalClose: {
        height: "10%",
        paddingRight: "5%",
        paddingLeft: "2%",
        alignItems: "flex-start",
        alignContent: "flex-start",
    },
    succesText: {
        color: "#343541",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: "20%",
        textAlign: "center",
    },
    modalText: {
        textTransform: "uppercase",
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    modalContainerCenter: {
        width: "100%",
        paddingHorizontal: "5%",
        alignSelf: "center",
        paddingTop: "4%",
    },

    buttonGenQuiz: {
        alignSelf: "center",
    },

    modalView: {
        width: "100%",
        height: "100%",
        paddingTop: "0%",
        // alignItems: "flex-start",
        alignContent: "flex-start",
        backgroundColor: "white",
        alignItems: "center",
    },
    resultQuizData: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: '12%',
    },
    quizDataContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#12D18E',
        borderRadius: 10,
    },
    quizDataContainer3: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FB9400',
        borderRadius: 10,
    },
    quizDatamlmr: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FF5A5F',
        borderRadius: 10,
        marginHorizontal: "3%",
    },
    quizDataBackground1: {
        backgroundColor: '#12D18E',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        paddingVertical: '10%',
    },
    quizDataBackground2: {
        backgroundColor: '#FF5A5F',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        paddingVertical: '10%',
    },
    quizDataBackground3: {
        backgroundColor: '#FB9400',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        paddingVertical: '10%',
    },

    quizDataLabel: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },


    quizDataCount: {
        color: '#212121',
        fontSize: 24,
        paddingVertical: '10%',
        textAlign: 'center',
    },

    succesImgQuiz: {
        alignSelf: "center",
        marginBottom: "10%",
        width: "100%",
        height: "47%",
        resizeMode: "contain",
    },

    answerFlashcard: {
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 17,
        color: "#8895bc",
    },

    buttonRestartQuiz: {
      width: "30%",
      paddingVertical: 18,
      paddingHorizontal: 32,
      alignItems: "center",
      borderRadius: 14,
      marginBottom: 20,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    }, 
    buttonEndQuiz:{
      width: "67%",
      marginLeft: '3%',
      paddingVertical: 18,
      paddingHorizontal: 32,
      alignItems: "center",
      borderRadius: 14,
      marginBottom: 20,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
});
