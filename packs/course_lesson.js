import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const YourComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://www.language.onllyons.com/ru/ru-en/HackTheSiteHere/packs/app/course_lesson.php')
      .then((response) => response.json())
      .then((responseData) => {
        // Extrageți 'rus_title' din datele primite și setați-l în stare
        const rusTitles = responseData.map((item) => item.rus_title);
        setData(rusTitles);
      })
      .catch((error) => {
        console.error('Eroare la solicitarea HTTP: ', error);
      });
  }, []);

  return (
    <View>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      <Text>Date din baza de date:</Text>
      {data.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
};

export default YourComponent;
