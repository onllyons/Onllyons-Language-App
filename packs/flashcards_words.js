import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import Carousel from 'react-native-new-snap-carousel';

const { width } = Dimensions.get("window");

export default function BooksCategoryScreen({ route }) {
  const data = [
    {
      id: 1,
      author: "Autor 1",
      title: "Titlu 1",
    },
    {
      id: 2,
      author: "Autor 2",
      title: "Titlu 2",
    },
    {
      id: 3,
      author: "Autor 3",
      title: "Titlu 3",
    },
    {
      id: 4,
      author: "Autor 4",
      title: "Titlu 4",
    },
  ];

  const category = "Categoria Exemplu";

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{category}</Text>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Carousel
          data={data}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width - 70}
          layout={'default'}
          loop={true}
          paginationStyle={styles.pagination}
          contentContainerCustomStyle={styles.carouselContainer}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  categoryTitle: {
    fontSize: 24,
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
