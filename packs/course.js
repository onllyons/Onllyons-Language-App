import React, { useState, useMemo, useEffect } from 'react';
import globalCss from './css/globalCss';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import { useAuth } from "./screens/ui/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Loader from "./components/Loader";
import CourseLesson from "./course_lesson";

export default function CourseScreen({ navigation }) {
  const { isAuthenticated, getUser, logout } = useAuth();
  const user = getUser();

  const [loader, setLoader] = useState(false);
  const [pressedCards, setPressedCards] = useState({});
  const [data, setData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setLoader(true);

    fetch('https://www.language.onllyons.com/ru/ru-en/HackTheSiteHere/packs/app/course_lesson.php')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error))
      .finally(() => setLoader(false));
  }, []);

  const onPressIn = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: true }));
  };

  const onPressOut = (id) => {
    setPressedCards(prevState => ({ ...prevState, [id]: false }));
  };

  const backgroundImageArray = [
    require('./images/background-app/bg1.png'),
    require('./images/background-app/bg2.png'),
    require('./images/background-app/bg3.png'),
  ];

  // Stilurile pentru fiecare imagine de fundal separat
  const backgroundStyles = [
    { height: 2500 }, // bg1.png
    { height: 2500 }, // bg2.png
    { height: 2500 }, // bg3.png
  ];

  const getNextBackgroundImage = () => {
    if (currentImageIndex < backgroundImageArray.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  return (
    <ScrollView style={styles.bgCourse}>
      <ImageBackground
        source={backgroundImageArray[currentImageIndex]}
        style={[styles.bgImg, backgroundStyles[currentImageIndex]]} // Folosește stilurile pentru imaginea de fundal curentă
      >
        {isAuthenticated() ? (
          <View>
            <Text>Id: {user.id}</Text>
            <Text>Имя пользователя: {user.username}</Text>
            <Text>Почта: {user.email}</Text>
            <Button
              title="Выйти из аккаунта"
              onPress={() => {
                logout()
                  .then(() => {
                    Alert.alert(
                      "Вы успешно вышли из аккаунта",
                      "Вы будете перенаправлены на начальный экран",
                      [
                        {
                          text: "Ок",
                          onPress: () => navigation.navigate('StartPageScreen'),
                          style: "default",
                        },
                      ]
                    );
                  })
                  .catch(() => {
                    Alert.alert(
                      "Ошибка",
                      "Не удалось выйти из аккаунта",
                      [
                        {
                          text: "Ок",
                          onPress: () => navigation.navigate('StartPageScreen'),
                          style: "cancel",
                        },
                      ]
                    );
                  });
              }}
            />
          </View>
        ) : (
          ""
        )}

        <View style={globalCss.container}>
          <View>
            <Text style={[globalCss.title, globalCss.textAlignCenter]}>
              Course
            </Text>
          </View>

          <View style={styles.contentFlashCards}>
            {data ? (
              data.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    {
                      width: index % 3 === 0 ? '100%' : '50%',
                    },
                    globalCss.alignItemsCenter,
                    globalCss.mb17,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.card,
                      pressedCards[item.id]
                        ? [styles.cardPressed, styles.bgGryPressed]
                        : styles.bgGry,
                    ]}
                    onPress={() =>
                      navigation.navigate('CourseLesson', { url: item.url })
                    }
                    onPressIn={() => onPressIn(item.id)}
                    onPressOut={() => onPressOut(item.id)}
                    activeOpacity={1}
                  >
                    <Text>
                      <FontAwesomeIcon
                        icon={faStar}
                        size={30}
                        style={styles.iconFlash}
                      />
                    </Text>
                  </TouchableOpacity>
                  <Text>
                    {item.title}
                  </Text>
                </View>
              ))
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgCourse: {
    backgroundColor: '#d1d1d1',
  },
  card: {
    width: 110,
    height: 110,
    marginBottom: '5%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  cardPressed: {
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateY: 4 }],
  },
  bgGry: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d8d8d8',
    shadowColor: '#d8d8d8',
  },
  bgGryPressed: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d8d8d8',
  },
  contentFlashCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  iconFlash: {},
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
    padding: 10,
  },
});
