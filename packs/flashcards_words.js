import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import Carousel from 'react-native-new-snap-carousel';

const { width } = Dimensions.get("window");

export default function FlashCardsLearning({ route }) {
  const { url } = route.params;
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCarousel = await fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-carousel.php');
        const dataCarousel = await responseCarousel.json();

        const responseQuiz = await fetch('https://www.language.onllyons.com/ru/ru-en/backend/mobile_app/sergiu/flascard-words-quiz.php');
        const dataQuiz = await responseQuiz.json();

        const filteredCarouselData = dataCarousel.filter((item) => item.url_display === url);
        const filteredQuizData = dataQuiz.filter((item) => item.quiz_url === url);

        // Adăugăm o proprietate "type" pentru a marca fiecare element ca aparținând "carousel" sau "quiz"
        const combinedData = [
          ...filteredCarouselData.map((item) => ({ ...item, type: "carousel" })),
          ...filteredQuizData.map((item) => ({ ...item, type: "quiz" })),
        ];

        setCombinedData(combinedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [url]);

  return (
    <ScrollView>
      <View style={styles.container}>

        <Carousel
          data={combinedData}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.type === "carousel" ? (
                <View>
                  <Text style={styles.categoryTitle}>{item.word_en}</Text>
                  <Text style={styles.categoryTitle}>{item.tophoneticsBritish}</Text>
                  <Text style={styles.categoryTitle}>{item.tophoneticsAmerican}</Text>
                  <Text style={styles.categoryTitle}>https://www.language.onllyons.com/ru/ru-en/packs/assest/game-card-word/content/audio/{item.word_audio}</Text>
                  <Text style={styles.categoryTitle}>{item.word_ru}</Text>
                </View>
              ) : (
                <Text style={styles.categoryTitle}>quiz: {item.answer_1}</Text>
              )}
            </View>
          )}
          sliderWidth={width}
          itemWidth={width - 70}
          paginationStyle={styles.pagination}
          contentContainerCustomStyle={styles.carouselContainer}
          layout={'default'}
          loop={false}
        />

      </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 116,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    height: 500,
    marginBottom: 16,
    alignItems: "center",
  },
  author: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  pagination: {
    marginTop: 16,
  },
});
