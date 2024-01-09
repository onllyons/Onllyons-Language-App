import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

import globalCss from "../css/globalCss";

const SubscriptionOption = ({ title, price, imageUrl, isSelected, onPress }) => {

	

  return (
    <TouchableOpacity
      style={[styles.option, isSelected ? styles.optionSelected : null]}
      onPress={onPress}
    >
      <Image source={imageUrl} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
      {isSelected && <View style={styles.checkmark} />}
    </TouchableOpacity>
  );
};

export default function UserSubscriptionChoose({ navigation }) {

  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isPressedContinue, setIsPressedContinue] = useState(false);

  const handleContinuePress = () => {
    if (selectedSubscription) {
      // Aici poți adăuga logica pentru procesarea plății pentru abonamentul selectat
    } else {
      Alert.alert("Eroare", "Пожалуйста, выберите вариант подписки.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>

      	

	
			<TouchableOpacity style={styles.closeBtn} onPress={() => navigation.navigate('MenuScreen')}>
		      <Text><FontAwesomeIcon icon={faXmark} size={30} style={styles.iconClose}/></Text>
		    </TouchableOpacity>
			<Text style={styles.titlePageTxt}>Откройте для себя мир эксклюзивных преимуществ и уникальных возможностей</Text>


        <SubscriptionOption
          title="By Monthly"
          price="$9.90"
          imageUrl={require('../images/other_images/free.png')}
          isSelected={selectedSubscription === "By Monthly"}
          onPress={() => {
            if (selectedSubscription === "By Monthly") {
              setSelectedSubscription(null);
            } else {
              setSelectedSubscription("By Monthly");
            }
          }}
        />
        <SubscriptionOption
          title="By Year"
          price="$129.90"
          imageUrl={require('../images/other_images/free.png')}
          isSelected={selectedSubscription === "By Year"}
          onPress={() => {
            if (selectedSubscription === "By Year") {
              setSelectedSubscription(null);
            } else {
              setSelectedSubscription("By Year");
            }
          }}
        />
        <SubscriptionOption
          title="Lifetime card"
          price="$329.90"
          imageUrl={require('../images/other_images/free.png')}
          isSelected={selectedSubscription === "Lifetime card"}
          onPress={() => {
            if (selectedSubscription === "Lifetime card") {
              setSelectedSubscription(null);
            } else {
              setSelectedSubscription("Lifetime card");
            }
          }}
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
};

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
	option: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  padding: 20,
	  marginVertical: 8,
	  borderWidth: 1,
	  borderColor: '#ccc',
	  borderRadius: 10,
	},
	optionSelected: {
	  backgroundColor: '#e0f7fa',
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
	
	titlePageTxt:{
		fontSize: 20,
		textAlign: 'center',
		fontWeight: '500',
    	marginBottom: '5%',
	},
	closeBtn:{
		justifyContent: 'flex-end',
  		alignItems: 'flex-end',
  		alignContent: 'flex-start',
    	marginBottom: '5%',
    	width: '100%',
    	height: 80,
	},
	iconClose:{
		color: '#a7a7a7'
	},

});







