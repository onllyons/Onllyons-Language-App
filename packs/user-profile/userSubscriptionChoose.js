import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';

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

const UserSubscriptionChoose = () => {
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Join Membership</Text>
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
        <TouchableOpacity style={styles.payButton} onPress={() => {
          if (selectedSubscription) {
            // Aici poți adăuga logica pentru procesarea plății pentru abonamentul selectat
          } else {
            // Afișează un mesaj de eroare sau solicită utilizatorului să selecteze un abonament
          }
        }}>
          <Text style={styles.payButtonText}>Pay Now</Text>
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
  payButton: {
    marginTop: 20,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 20,
  },
  payButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserSubscriptionChoose;
