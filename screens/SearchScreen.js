/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native'; 
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';

export default function SearchScreen(props) {
    const [post, setPost] = useState([]);

    const fetchPosts = (search) => {
        firestore()
        .collection('posts')
        .where('address', '>=', search)
        .get()
        .then((snapshot) => {
            let post = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data};
            });
            setPost(post);
        });
    };


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={styles.imagebackground}>
            <TextInput style={styles.TextInput}
                placeholder="Type here..."
                onChangeText={(search) => fetchPosts(search)}
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={post}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('HomeProfile', {userId: item.userId})}
                    >
                        {item.price > 100 ?
                        <View>
                            <Text style={styles.Text}>Expensive Price</Text>
                        <PostCard key={item.id} item={item}/>
                        </View>
                        :
                        <View>
                            <Text style={styles.Text}>Cheap Price</Text>
                        <PostCard key={item.id} item={item}/>
                        </View> 
                        }
                    </TouchableOpacity>
                )}
            />
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    imagebackground: {
        flex: 1,
        justifyContent: 'center',
      },
    TextInput: {
        fontSize: 20,
        backgroundColor: '#ffffff',
        width: 370,
        marginLeft: 10,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    Text: {
        fontSize: 20,
        marginBottom: 10,
        marginLeft: 10,
        color: '#000000'
    }
});
