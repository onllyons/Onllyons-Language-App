import React, {useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';

import globalCss from "../css/globalCss";
import Toast from "react-native-toast-message";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

// fonts
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// icons
import { faCamera, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SubscriptionOption = ({title, price, imageUrl, isSelected, onPress}) => {
    return (
        <AnimatedButtonShadow
            styleButton={[styles.card, globalCss.bgGry]}
            shadowColor={"gray"}
            onPress={() => onPress(true)}
            permanentlyActive={isSelected}
            permanentlyActiveOpacity={0.5}
            size={"full"}
        >
            <Image source={imageUrl} style={styles.image}/>
            <View style={styles.details}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.price}>{price}</Text>
            </View>
        </AnimatedButtonShadow>
    );
};


export default function SubscribeScreen({navigation}) {
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const handleContinuePress = () => {
        if (selectedSubscription) {
            Toast.show({
                type: "info",
                text1: "Подписки скоро появляться"
            });
        } else {
            Toast.show({
                type: "error",
                text1: "Пожалуйста, выберите вариант подписки"
            });
        }
    };

    return (
        <View  style={styles.container}>

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


            <ScrollView style={styles.containerScroll}>
             
                <Text style={styles.titlePageTxt}>Откройте для себя мир эксклюзивных преимуществ и уникальных
                    возможностей</Text>

                <SubscriptionOption
                    title="By Monthly"
                    price="Try for free"
                    imageUrl={require('../images/other_images/diamond-yellow.png')}
                    isSelected={selectedSubscription === "Free"}
                    onPress={() => setSelectedSubscription("Free")}
                />

                <SubscriptionOption
                    title="By Year"
                    price="€ 1.69 в месяц"
                    imageUrl={require('../images/other_images/diamond-green.png')}
                    isSelected={selectedSubscription === "Pro"}
                    onPress={() => setSelectedSubscription("Pro")}
                />
                <SubscriptionOption
                    title="Lifetime card"
                    price="€ 1.00 в месяц"
                    imageUrl={require('../images/other_images/diamond-red.png')}
                    isSelected={selectedSubscription === "Standard"}
                    onPress={() => setSelectedSubscription("Standard")}
                />

                <AnimatedButtonShadow
                    styleButton={[globalCss.button, globalCss.buttonBlue]}
                    shadowColor={"blue"}
                    onPress={handleContinuePress}
                    size={"full"}
                >
                    <Text style={globalCss.buttonText}>CONTINUE</Text>
                </AnimatedButtonShadow>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerScroll: {
      padding: '5%',
      backgroundColor: '#fff',
      flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        marginBottom: '5%',
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2
    },
    optionSelected: {
        backgroundColor: 'red',
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
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        color: '#666',
    },

    titlePageTxt: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: '5%',
    },

});