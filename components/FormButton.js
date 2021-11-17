import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { windowHeight, windowWidth } from '../utils/Dimentions';

export default function FormButton({buttonTitle, ...rest}) {
    return (
        <TouchableOpacity style={styles.buttonContainer} {...rest}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: windowHeight /15,
        backgroundColor: '#2e64e5',
        padding: 10,
        borderRadius: 3
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#ffffff",
        fontFamily: 'Lato-Regular'
    }
})
