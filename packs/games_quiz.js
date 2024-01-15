import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DotIndicator } from "react-native-indicators"; // Importați DotIndicator sau alt tip de indicator dorit
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTrophy,
  faClock,
  faCheck,
  faXmark,
  faLightbulb,
  faRotateLeft,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";

import globalCss from "./css/globalCss";
import Loader from "./components/Loader";

export default function GameQuiz({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Inițial, loader-ul este activat
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isHelpUsed, setIsHelpUsed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isPressedRepeatBtn, setIsPressedRepeatBtn] = useState(false);
  const [isPressedHelpBtn, setIsPressedHelpBtn] = useState(false);
  const [isPressedNextBtn, setIsPressedNextBtn] = useState(false);
const [showIncorrectStyle, setShowIncorrectStyle] = useState(false);

  const [isPressedAnswer, setIsPressedAnswer] = useState([]);


const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerComponent = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <Text>
      <FontAwesomeIcon icon={faClock} size={30} style={globalCss.gry} />
      {formatTime(time)}
    </Text>
  );
};




const handlePressIn = (answerIndex) => {
  const newIsPressedAnswer = [...isPressedAnswer];
  newIsPressedAnswer[answerIndex] = true;
  setIsPressedAnswer(newIsPressedAnswer);
};


const handlePressOut = (answerIndex) => {
  const newIsPressedAnswer = [...isPressedAnswer];
  newIsPressedAnswer[answerIndex] = false;
  setIsPressedAnswer(newIsPressedAnswer);
};


  useEffect(() => {
    setLoading(true);
    fetch(
      "https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/game_play_chose.php"
    )
      .then((response) => response.json())
      .then((json) => {
        const shuffledData = json.map((item) => ({
          ...item,
          answers: shuffleAnswers(item),
        }));
        setData(shuffledData);

        const initialPressedAnswerState = Array(
          shuffledData[currentQuestionIndex].answers.length
        ).fill(false);
        setIsPressedAnswer(initialPressedAnswerState);

        setTimeout(() => {
          setLoading(false);
        }, 5000);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

const shuffleAnswers = (item) => {
  let initialAnswers = [
    { text: item.answer_1, correct: item.answer_correct === "1" },
    { text: item.answer_2, correct: item.answer_correct === "2" },
    { text: item.answer_3, correct: item.answer_correct === "3" },
    { text: item.answer_4, correct: item.answer_correct === "4" },
  ];

  // Amestecă răspunsurile inițiale
  for (let i = initialAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [initialAnswers[i], initialAnswers[j]] = [initialAnswers[j], initialAnswers[i]];
  }

  return initialAnswers;
};

const handleAnswerSelect = (selected, item) => {
  if (!isAnswerSubmitted) {
    const correctAnswer = item.answers.find((answer) => answer.correct).text;
    setSelectedAnswer(selected);
    const isCorrect = selected === correctAnswer;
    setIsAnswerCorrect(isCorrect);
    setShowIncorrectStyle(!isCorrect); // Setează stilul "incorrect" dacă răspunsul este greșit
    setIsHelpUsed(false);
    setIsAnswerSubmitted(true);
  }
};

const handleHelp = () => {
  setIsHelpUsed(true);
  setShowIncorrectStyle(false); // Resetează stilul "incorrect"
};



const handleNext = () => {
  setSelectedAnswer(null);
  setIsAnswerCorrect(null);
  setIsHelpUsed(false);
  setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru următoarea întrebare
};

const handleRepeat = () => {
  setSelectedAnswer(null);
  setIsAnswerCorrect(null);
  setIsHelpUsed(false);
  setIsAnswerSubmitted(false); // Resetarea isAnswerSubmitted la false pentru a permite repetarea întrebării
};

  if (loading) {
    // Dacă datele sunt în proces de încărcare, afișați pagina cu fundal galben și textul corespunzător
    return (
      <LinearGradient
        colors={["#8f69cc", "#8f69cc"]}
        style={styles.startContent}
      >
        <Image
          source={require("./images/other_images/quiz-logo.png")}
          style={styles.logoQuiz}
        />
        <Text style={styles.textContainerMess}>Quiz Time</Text>

        <View style={styles.loaderContainer}>
          <DotIndicator color="white" size={30} count={3} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionTop}>
        <View>
          <Text>
            <FontAwesomeIcon icon={faTrophy} size={30} style={globalCss.gry} />
            1124 CR
          </Text>
        </View>

        <View>
          <Text>+4</Text>
        </View>

        <TimerComponent />

        <View>
          <Text>ser</Text>
        </View>

        <View>
          <Text>
            <FontAwesomeIcon icon={faCheck} size={30} style={globalCss.gry} />
            Cor
          </Text>
        </View>

        <View>
          <Text>
            <FontAwesomeIcon icon={faXmark} size={30} style={globalCss.gry} />
            Gres
          </Text>
        </View>
      </View>
      {data.length > 0 && (
        <View style={styles.buttonGroup} key={data[currentQuestionIndex].id}>
          {data.length > 0 && (
            <View
              style={styles.buttonGroup}
              key={data[currentQuestionIndex].id}
            >
              <Text style={styles.headerText}>
                {data[currentQuestionIndex].survey_questions}
              </Text>
              {data[currentQuestionIndex].answers.map((answer, answerIndex) => (
                <TouchableOpacity
                  key={answerIndex}
                  style={[
                    globalCss.button,
                    isPressedAnswer[answerIndex]
                      ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                      : globalCss.buttonGry,

                    selectedAnswer === answer.text &&
                      (isAnswerCorrect ? styles.correct : styles.incorrect),
                    // Verifică dacă butonul help a fost apăsat și răspunsul este corect
                    isHelpUsed && answer.correct && styles.correct,
                  ]}
                  onPressIn={() => handlePressIn(answerIndex)}
                  onPressOut={() => handlePressOut(answerIndex)}
                  onPress={() =>
                    handleAnswerSelect(answer.text, data[currentQuestionIndex])
                  }
                  activeOpacity={1}
                >
                  <Text style={[
                    styles.buttonTextBlack,
                    selectedAnswer === answer.text && isAnswerCorrect ? styles.correctTxt : 
                    selectedAnswer === answer.text ? styles.incorrectTxt : null,
                    isHelpUsed && answer.correct ? styles.correctTxt : null // Adăugați condiția pentru starea "Help" și corectitudinea răspunsului
                  ]}>
                    {answer.text}
                  </Text>



                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.groupBtnQuiz}>
{(selectedAnswer || isHelpUsed) && (
  <TouchableOpacity
    style={[
      styles.quizBtnCtr,
      isPressedRepeatBtn
        ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
        : globalCss.buttonGry,
      showIncorrectStyle && styles.incorrect // Aplică stilul "incorrect" dacă este necesar
    ]}
    onPressIn={() => setIsPressedRepeatBtn(true)}
    onPressOut={() => setIsPressedRepeatBtn(false)}
    activeOpacity={1}
    onPress={handleRepeat}
  >
    <Text style={styles.buttonText}>
      <FontAwesomeIcon
        icon={faRotateLeft}
        size={18}
        style={showIncorrectStyle ? styles.correctTxt : globalCss.blueLight}
      />
    </Text>
  </TouchableOpacity>
)}



        {(!selectedAnswer || (selectedAnswer && !isAnswerCorrect)) &&
          !isHelpUsed && (
            <TouchableOpacity
              style={[
                styles.quizBtnCtr,
                isPressedHelpBtn
                  ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                  : globalCss.buttonGry,
              ]}
              onPressIn={() => setIsPressedHelpBtn(true)}
              onPressOut={() => setIsPressedHelpBtn(false)}
              activeOpacity={1}
              onPress={handleHelp}
            >
              <Text style={styles.buttonText}>
                <FontAwesomeIcon
                  icon={faLightbulb}
                  size={18}
                  style={globalCss.blueLight}
                />
              </Text>
            </TouchableOpacity>
          )}

          {(selectedAnswer || isHelpUsed) && (
            <TouchableOpacity
              style={[
                styles.quizBtnCtr,
                isPressedNextBtn
                  ? [globalCss.buttonPressed, globalCss.buttonPressedGry]
                  : globalCss.buttonGry,
                (isAnswerCorrect || isHelpUsed) && styles.correct, // Adăugarea clasei "corect" aici
              ]}
              onPressIn={() => setIsPressedNextBtn(true)}
              onPressOut={() => setIsPressedNextBtn(false)}
              activeOpacity={1}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  size={18}
                  style={(isAnswerCorrect || isHelpUsed) ? styles.correctTxt : globalCss.blueLight}
                />
              </Text>
            </TouchableOpacity>
          )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  groupBtnQuiz: {
    maxWidth: "80%",
    marginBottom: "13%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "center",
  },
  quizBtnCtr: {
    flex: 1,
    marginHorizontal: "1%",
    paddingTop: "6%",
    paddingBottom: "5%",
    //paddingVertical: 18,
    alignItems: "center",
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  startContent: {
    flex: 1,
    justifyContent: "center",
  },
  loaderContainer: {
    position: "absolute",
    bottom: "5%",
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainerMess: {
    fontSize: "45%",
    textAlign: "center",
    color: "#E4D3FF",
  },
  logoQuiz: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginBottom: "2.9%",
  },
  sectionTop: {
    width: "100%",
    paddingTop: "10%",
    backgroundColor: "red",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "center",
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    margin: 10,
  },
  buttonGroup: {
    justifyContent: "center",
    maxWidth: "97%",
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  buttonTextBlack:{
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 18,
    color: "#8895bc",
  },
  correctTxt:{
    color: "white",
  },
  incorrectTxt:{
    color: "white",
  },
  correct: {
    backgroundColor: "#81b344",
  },
  incorrect: {
    backgroundColor: "#ca3431",
  },
});
