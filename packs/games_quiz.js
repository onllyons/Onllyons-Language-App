import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import globalCss from './css/globalCss';

export default function GameQuiz({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isHelpUsed, setIsHelpUsed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
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
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const shuffleAnswers = (item) => {
    let answers = [
      { text: item.answer_1, correct: item.answer_correct === "1" },
      { text: item.answer_2, correct: item.answer_correct === "2" },
      { text: item.answer_3, correct: item.answer_correct === "3" },
      { text: item.answer_4, correct: item.answer_correct === "4" },
    ];

    // Amestecă răspunsurile
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    return answers;
  };

  const handleAnswerSelect = (selected, item) => {
    const correctAnswer = item.answers.find(answer => answer.correct).text;
    setSelectedAnswer(selected);
    setIsAnswerCorrect(selected === correctAnswer);
    setIsHelpUsed(false); // Resetare la selectarea unui răspuns
  };

  const handleHelp = () => {
    setIsHelpUsed(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setIsHelpUsed(false);
  };

const handleRepeat = () => {
  setSelectedAnswer(null);
  setIsAnswerCorrect(null);
  setIsHelpUsed(false);
};

return (
<View style={styles.container}>
  {data.length > 0 && (
    <View style={styles.buttonGroup} key={data[currentQuestionIndex].id}>
      <Text style={styles.headerText}>{data[currentQuestionIndex].survey_questions}</Text>
      {data[currentQuestionIndex].answers.map((answer, answerIndex) => (
        <TouchableOpacity
          key={answerIndex}
          style={[
            styles.button,
            // Verifică dacă răspunsul este selectat și corect
            selectedAnswer === answer.text &&
              (isAnswerCorrect ? styles.correct : styles.incorrect),
            // Verifică dacă butonul help a fost apăsat și răspunsul este corect
            isHelpUsed && answer.correct && styles.correct
          ]}
          onPress={() =>
            handleAnswerSelect(answer.text, data[currentQuestionIndex])
          }
        >
          <Text style={styles.buttonText}>{answer.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}

  
<View style={globalCss.row}>
  {/* Butonul repeat va fi afișat după selectarea unui răspuns sau utilizarea butonului help.
      Este vizibil atât după selectarea unui răspuns, indiferent dacă este corect sau greșit, cât și după utilizarea butonului help. */}
  {(selectedAnswer || isHelpUsed) && (
    <TouchableOpacity style={styles.button} onPress={handleRepeat}>
      <Text style={styles.buttonText}>repeat</Text>
    </TouchableOpacity>
  )}

  {/* Butonul help va fi afișat doar dacă nu s-a selectat un răspuns sau răspunsul selectat este greșit.
      Nu va fi afișat dacă un răspuns corect a fost deja selectat. */}
  {(!selectedAnswer || (selectedAnswer && !isAnswerCorrect)) && !isHelpUsed && (
    <TouchableOpacity style={styles.button} onPress={handleHelp}>
      <Text style={styles.buttonText}>help</Text>
    </TouchableOpacity>
  )}

  {/* Butonul next va fi afișat după selectarea unui răspuns sau utilizarea butonului help.
      Este utilizat pentru a trece la următoarea întrebare. */}
  {(selectedAnswer || isHelpUsed) && (
    <TouchableOpacity style={styles.button} onPress={handleNext}>
      <Text style={styles.buttonText}>next</Text>
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
    backgroundColor: "#F5FCFF",
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
  button: {
    backgroundColor: "#E7E7E7",
    padding: 15,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
  },
  correct: {
    backgroundColor: "green",
  },
  incorrect: {
    backgroundColor: "red",
  },
});
