import React, {useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

import globalCss from "../css/globalCss";
import Toast from "react-native-toast-message";
import {AnimatedButtonShadow} from "../components/buttons/AnimatedButtonShadow";

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
        <ScrollView contentContainerStyle={{minHeight: "100%"}}>
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
                    onPress={() => setSelectedSubscription("Free")}
                />

                <SubscriptionOption
                    title="By Year"
                    price="€ 1.69 в месяц"
                    imageUrl={require('../images/other_images/free.png')}
                    isSelected={selectedSubscription === "Pro"}
                    onPress={() => setSelectedSubscription("Pro")}
                />
                <SubscriptionOption
                    title="Lifetime card"
                    price="€ 1.00 в месяц"
                    imageUrl={require('../images/other_images/free.png')}
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