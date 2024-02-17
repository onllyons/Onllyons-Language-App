import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import globalCss from "../css/globalCss";
import Toast from "react-native-toast-message";
import { AnimatedButtonShadow } from "../components/buttons/AnimatedButtonShadow";

import Carousel from "react-native-new-snap-carousel";

// fonts
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// icons
import { faCamera, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const { width } = Dimensions.get("window");

const SubscriptionOption = ({
  title,
  price,
  imageUrl,
  isSelected,
  onPress,
}) => {
  return (
    <AnimatedButtonShadow
      styleButton={[styles.card, globalCss.bgGry]}
      shadowColor={"gray"}
      onPress={() => onPress(true)}
      permanentlyActive={isSelected}
      size={"full"}
    >
      <Image source={imageUrl} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </AnimatedButtonShadow>
  );
};

export default function SubscribeScreen({ navigation }) {
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const handleContinuePress = () => {
    if (selectedSubscription) {
      Toast.show({
        type: "info",
        text1: "Подписки скоро появляться",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Пожалуйста, выберите вариант подписки",
      });
    }
  };

  const renderItem = ({ item }) => {
    switch (item) {
      case 1:
        return (
          <View style={styles.slide}>
            <SubscriptionOption
              title="Pro"
              price="€ 1.69 в месяц"
              imageUrl={require("../images/other_images/diamond-red.png")}
              isSelected={selectedSubscription === "Standard"}
              onPress={() => setSelectedSubscription("Standard")}
            />

            <View style={styles.sectionMenu}>
              <View style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}>
                <Text style={styles.btnText}>Справка и поддержка</Text>
              </View>

              <View style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}>
                <Text style={styles.btnText}>Пол. соглашение</Text>
              </View>
              <View style={[styles.btnMenuProfile, styles.btnBBR]}>
                <Text style={styles.btnText}>Пол. конфиденциаль.</Text>
              </View>
            </View>

            
          </View>
        );
      case 2:
        return (
          <View style={styles.slide}>
            <SubscriptionOption
              title="Standard"
              price="€ 1.00 в месяц"
              imageUrl={require("../images/other_images/diamond-green.png")}
              isSelected={selectedSubscription === "Pro"}
              onPress={() => setSelectedSubscription("Pro")}
            />

            <View style={styles.sectionMenu}>
              <View style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}>
                <Text style={styles.btnText}>Справка и поддержка</Text>
              </View>

              <View style={[styles.btnMenuProfile, styles.btnBTR, styles.btnBB]}>
                <Text style={styles.btnText}>Пол. соглашение</Text>
              </View>
              <View style={[styles.btnMenuProfile, styles.btnBBR]}>
                <Text style={styles.btnText}>Пол. конфиденциаль.</Text>
              </View>
            </View>

          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={globalCss.navTabUser}>
        <TouchableOpacity
          style={globalCss.itemNavTabUserBtnBack}
          onPress={() => navigation.navigate("MenuScreen")}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={30}
            style={globalCss.blue}
          />
        </TouchableOpacity>
        <View style={globalCss.itemNavTabUserTitleCat}>
          <Text style={globalCss.dataCategoryTitle}>Подписка</Text>
        </View>
      </View>

      <View style={styles.containerCarousel}>
        <Carousel
          itemWidth={width - 70}
          sliderWidth={width}
          data={[1, 2]}
          renderItem={renderItem}
          layout={"default"}
          loop={false}
        />
      </View>

      {/*

                <Text style={styles.titlePageTxt}>Откройте для себя мир эксклюзивных преимуществ и уникальных
                    возможностей</Text>
                <SubscriptionOption
                    title="Free"
                    price="Try for free"
                    imageUrl={require('../images/other_images/diamond-yellow.png')}
                    isSelected={selectedSubscription === "Free"}
                    onPress={() => setSelectedSubscription("Free")}
                />
                */}

      <View style={styles.buttonBuy}>
        <AnimatedButtonShadow
          styleButton={[globalCss.button, globalCss.buttonBlue]}
          shadowColor={"blue"}
          onPress={handleContinuePress}
          size={"full"}
        >
          <Text style={globalCss.buttonText}>ВЫБРАТЬ</Text>
        </AnimatedButtonShadow>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonBuy: {
    width: "85%",
    alignSelf: "center",
    marginTop: "7%",
  },
  containerCarousel: {
    justifyContent: "center",
    alignItems: "center",
    height: "70%",
  },
  slide: {
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    height: "100%",
    borderRadius: "15%",
    padding: "5%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#666",
  },

  titlePageTxt: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: "5%",
  },

  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "grey",
    marginBottom: 5,
  },
  sectionMenu: {
    backgroundColor: "#ffffff",
    borderColor: "#d8d8d8",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: '8%',
    width: '100%',
  },
  btnMenuProfile: {
    backgroundColor: "white",
    paddingVertical: "6%",
    paddingHorizontal: "5%",
    alignItems: "flex-start",
  },

  btnBTR: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  btnBBR: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  btnBB: {
    borderBottomWidth: 2,
    borderColor: "#d8d8d8",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
});
