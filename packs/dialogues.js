import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DialoguesScreen({ navigation }) {
    const fileName = 'DialoguesScreen'; // Numele fișierului

    return (
        <View style={styles.container}>
            <Text style={styles.fs}>{fileName}</Text>
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
