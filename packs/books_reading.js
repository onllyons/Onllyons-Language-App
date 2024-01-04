import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import globalCss from "./css/globalCss";

const { width } = Dimensions.get("window");

export default function BooksScreen({ navigation }) {
  const goBackToBooks = () => {
    navigation.navigate("Книги");
  };

  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const containerHeight = event.nativeEvent.layoutMeasurement.height;

    const newScrollY = offsetY < 0 ? 0 : offsetY;

    setScrollY(newScrollY);
    setContentHeight(contentHeight);
    setContainerHeight(containerHeight);
  };

useEffect(() => {
  const maxScroll = contentHeight - containerHeight;
  const newScrollY = scrollY < 0 ? 0 : Math.min(scrollY, maxScroll);
  const newScrollPercentage = (newScrollY / maxScroll) * 100;
  setScrollY(newScrollY);
  setScrollProgress(newScrollPercentage);
  if (initialLoad && newScrollPercentage > 0) {
    setInitialLoad(false);
  }
}, [scrollY, contentHeight, containerHeight, initialLoad]);


  const [scrollProgress, setScrollProgress] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  return (
    <View style={globalCss.container}>
      <TouchableOpacity onPress={goBackToBooks} style={styles.closeButton}>
        <FontAwesomeIcon icon={faTimes} size={30} color="red" />
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View
          style={{
            width: initialLoad ? "0%" : `${scrollProgress}%`,
            height: 5,
            backgroundColor: initialLoad ? "lightgray" : "red",
          }}
        />
      </View>

      <Text style={styles.scrollPercentageText}>{`${Math.round(scrollProgress)}%`}</Text>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={styles.scrollView}>
        <Text style={styles.titleBook}>Title book</Text>
        <Text style={styles.textBook}>
          În decembrie, vântul rece sufla și Teresa Osborne își încrucișă
          brațele în timp ce privea spre apă. Era singură pe plajă. Oceanul,
          reflectând culoarea cerului, arăta ca un lichid de fier, iar valurile
          se rostogoleau constant pe mal. Ea venise aici în dimineața aceasta
          când luase decizia să vină.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  progressBarContainer: {
    width: '70%',
    height: 5,
    backgroundColor: "lightgray",
  },
  scrollPercentageText: {
    alignSelf: 'center',
    marginTop: 5,
  },
  scrollView: {
    marginTop: 40, // Adjust the spacing as needed
    paddingHorizontal: 20,
  },
  titleBook: {
    fontSize: 21,
    marginBottom: 10,
  },
  textBook: {
    fontSize: 18,
    lineHeight: 155,
  },
});
