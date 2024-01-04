import React from 'react';
import { View, Text, Button } from 'react-native';
import globalCss from './css/globalCss';

export default function BooksScreen({ navigation }) {
  return (

    <View style={globalCss.container}>
      <View style={globalCss.row}>
        <View style={globalCss.card}>
          <Text>books_reading</Text>
        </View>
      </View>
    </View>



  );
}
