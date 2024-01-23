import React, {useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

import globalCss from "../css/globalCss";
import Toast from "react-native-toast-message";

const SubscriptionOption = ({title, price, imageUrl, isSelected, onPress, isCardPressed}) => {
    return (
        <TouchableOpacity
            style={[styles.card, isCardPressed ? [globalCss.cardPressed, styles.bgGryPressed] : globalCss.bgGry]}
            onPressIn={() => onPress(true)}
            onPressOut={() => onPress(false)}
            onPress={() => onPress(true)}
            activeOpacity={1}
        >
            <Image source={imageUrl} style={styles.image}/>
            <View style={styles.details}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.price}>{price}</Text>
            </View>
            {isSelected && <View style={styles.checkmark}/>}
        </TouchableOpacity>
    );
};


export default function SubscribeScreen({navigation}) {
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isPressedContinue, setIsPressedContinue] = useState(false);
    const [isCardPressed1, setIsCardPressed1] = useState(false);
    const [isCardPressed2, setIsCardPressed2] = useState(false);
    const [isCardPressed3, setIsCardPressed3] = useState(false);

    const handleCardPress = (value, cardNumber) => {
        if (cardNumber === 1) {
            setIsCardPressed1(value);
            setIsCardPressed2(false);
            setIsCardPressed3(false);
        } else if (cardNumber === 2) {
            setIsCardPressed1(false);
            setIsCardPressed2(value);
            setIsCardPressed3(false);
        } else if (cardNumber === 3) {
            setIsCardPressed1(false);
            setIsCardPressed2(false);
            setIsCardPressed3(value);
        }
    };

    const handleContinuePress = () => {
        if (selectedSubscription) {
            // Aici poți adăuga logica pentru procesarea plății pentru abonamentul selectat
        } else {
            Toast.show({
                type: "error",
                text1: "Пожалуйста, выберите вариант подписки"
            });
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                    <Text><FontAwesomeIcon icon={faXmark} size={30} style={styles.iconClose}/></Text>
                </TouchableOpacity>
                <Text style={styles.titlePageTxt}>Откройте для себя мир эксклюзивных преимуществ и уникальных
                    возможностей</Text>

                <SubscriptionOption
                    title="By Monthly"
                    price="Try for free"
                    imageUrl={require('../images/other_images/free.png')}
                    isSelected={selectedSubscription === "Free"}
                    onPress={(value) => handleCardPress(value, 1)}
                    isCardPressed={isCardPressed1}
                />

                <SubscriptionOption
                    title="By Year"
                    price="€ 1.69 в месяц"
                    imageUrl={require('../images/other_images/free.png')}
                    isSelected={selectedSubscription === "Pro"}
                    onPress={(value) => handleCardPress(value, 2)}
                    isCardPressed={isCardPressed2}
                />
                <SubscriptionOption
                    title="Lifetime card"
                    price="€ 1.00 в месяц"
                    imageUrl={require('../images/other_images/free.png')}
                    isSelected={selectedSubscription === "Standard"}
                    onPress={(value) => handleCardPress(value, 3)}
                    isCardPressed={isCardPressed3}
                />

                <TouchableOpacity
                    style={[
                        globalCss.button,
                        isPressedContinue ? [globalCss.buttonPressed, globalCss.buttonPressedBlue] : globalCss.buttonBlue
                    ]}
                    onPressIn={() => setIsPressedContinue(true)}
                    onPressOut={() => setIsPressedContinue(false)}
                    activeOpacity={1}
                    onPress={handleContinuePress}
                >
                    <Text style={globalCss.buttonText}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
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
        borderRightWidth: 2,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,

    },
    bgGryPressed: {
        backgroundColor: '#f0f5ff',
        borderColor: '#1cb0f6',
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
    checkmark: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000',
    },

    titlePageTxt: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: '5%',
    },
    closeBtn: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignContent: 'flex-start',
        marginBottom: '5%',
        width: '100%',
        height: 80,
    },
    iconClose: {
        color: '#a7a7a7'
    },

});