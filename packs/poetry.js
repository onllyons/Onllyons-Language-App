import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PoetryScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.fs}>Poetry amus</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fs: {
        fontSize: 60,
    },
});
