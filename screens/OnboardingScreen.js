/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, Image, TouchableOpacity, Button, View } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';

const Dots = ({selected}) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View  
            style={{
                width: 5,
                height: 5,
                marginHorizontal: 3,
                backgroundColor
            }}
        />
    )
}

const Skip = ({...props}) => (
    <TouchableOpacity 
        style={{marginHorizontal:8}}
        {...props}
    >
        <Text style={{fontSize:16}}>Skip</Text>
    </TouchableOpacity>
)

const Next = ({...props}) => (
    <TouchableOpacity 
        style={{marginHorizontal:8}}
        {...props}
    >
        <Text style={{fontSize:16}}>Next</Text>
    </TouchableOpacity>
)

const Done = ({...props}) => (
    <TouchableOpacity 
        style={{marginHorizontal:8}}
        {...props}
    >
        <Text style={{fontSize:16}}>Done</Text>
    </TouchableOpacity>
)


const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dots}
            onSkip={() => navigation.replace("Login")}
            onDone={() => navigation.navigate("Login")}
            pages={[
                {
                backgroundColor: '#a6e4d0',
                image: <Image source={require('../assets/logo1.jpg')} />,
                title: 'Rent House',
                subtitle: 'Commercial with you, sell with wards. Meeting each other is a predestined... Greet each other back and forth, maybe we are each other is customers...',
                },
                {
                    backgroundColor: '#fdeb93',
                    image: <Image source={require('../assets/logo2.jpg')} />,
                    title: 'Rent House',
                    subtitle: 'Cheap as dirt, poor also have rent!',
                },
                {
                    backgroundColor: '#e9bcbe',
                    image: <Image source={require('../assets/logo3.png')} />,
                    title: 'Rent House',
                    subtitle: 'Let me know if there is any way I can help you',
                },
            ]}
            />
    )
}

export default OnboardingScreen;

