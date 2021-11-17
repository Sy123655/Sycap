/* eslint-disable prettier/prettier */
import React,{ useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import SocialButton from '../components/SocialButton';



export default function CommentScreen({navigation, item}) {
    const {user, logout} = useContext(AuthContext);
    const [comments, setComments] = useState(null);
    const [text, setText] = useState("");
    const [ loading, setLoading ] = useState(true);
    
    const fetchComments = async() => {
      try {
        const list = [];
        await firestore()
        .collection('comments')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            const {userId, text} = doc.data();
            list.push(
              {id: doc.id,
                userId,
                text
            }
            );
          });
        });

        setComments(list);

        if(loading) {
          setLoading(false);
        }
        console.log('Post: ', list)
      }catch(e){
        console.log(e);
      }
    };

    useEffect(() => {
      fetchComments();
    },[]);


    const onCommentSend = () => {
        firestore()
        .collection('comments')
        .add({
            userId: user.uid,
            text
        })
    }

    return (

        <View style={styles.container}>
            <FlatList
                numColumns={1}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                )}
            />
            <View>
            <TextInput style={styles.textinput}
                placeholder='comment...'
                onChangeText={(text) => setText(text)} />
            <SocialButton
                buttonTitle="Send"
                color="#de4d41"
                backgroundColor="#f5e7ea"
                onPress={() => onCommentSend()}
            />

            </View>
        </View>


    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50
  },
  imagebackground: {
    flex: 1,
    justifyContent: "center",
  },
  textinput: {
      fontSize: 20
  },
  text: {
      fontSize: 20
  }
})

