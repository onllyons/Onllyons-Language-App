import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


export default function GameQuiz({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>id</Text>
      <Text style={styles.headerText}>survey_questions</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>answer_1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>answer_2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>answer_3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>answer_4</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  buttonGroup: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '80%',
  },
  button: {
    backgroundColor: '#E7E7E7',
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
});
