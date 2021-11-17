/* eslint-disable prettier/prettier */
import React,{ useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { Container } from '../styles/FeedStyles';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import PostCard from '../components/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


export default function HomeScreen({navigation}) {
    const [ posts, setPosts ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ deleted, setDeleted ] = useState(false);
    const fetchPosts = async() => {
      try {
        const list = [];
        await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            const {userId, post, postImg, postTime, type, furniture, address, badroom, price, note} = doc.data();
            list.push(
              {id: doc.id,
              userId,
              userName: 'Test Name',
              userImg: postImg,
              postTime: postTime,
              post:
                post,
              postImg,
              price: price,
              type: type,
              address: address,
              badroom: badroom,
              furniture: furniture,
              note: note
            }
            );
          });
        });

        setPosts(list);

        if(loading) {
          setLoading(false);
        }
        console.log('Post: ', list)
      }catch(e){
        console.log(e);
      }
    };

    useEffect(() => {
      fetchPosts();
    },[]);

    useEffect(() => {
      fetchPosts();
      setDeleted(false);
    }, [deleted]);

    useEffect(() => {
      fetchPosts();
      navigation.addListener("focus", () => setLoading(!loading));
    }, [navigation, loading]);

    const handleDelete = (postId) => {
      Alert.alert(
        'Delete post',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => deletePost(postId),
          },
        ],
        {cancelable: false},
      );
    };

  const deletePost = (postId) => {
    firestore().collection('posts')
    .doc(postId)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
      const {postImg} = documentSnapshot.data();

      if (postImg !== null) {
        const storageRef = storage().refFromURL(postImg);
        const imageRef = storage().ref(storageRef.fullPath);

        imageRef
        .delete()
        .then(() => {
          console.log(`${postImg} has been deleted successfully.`);
          deleteFirestoreData(postId);
          setDeleted(true);
        })
        .catch((e) => {
          console.log('Error while deleting the image. ', e)
        });
        // IF the post image is not availible
      } else {
        deleteFirestoreData(postId);
      }
    }
    });
  };

  const deleteFirestoreData = (postId) => {
    firestore()
    .collection('posts')
    .doc(postId)
    .delete()
    .then(() => {
      Alert.alert(
        'Post deleted!',
        'Your post has been deleted successfully.'
      )
    })
    .catch(e => console.log('Error deleting post.', e))
  }
  const ListHeader = () => {
    return null;
  };
    return (
      <SafeAreaView style={styles.container}>
        
      {loading ? (
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}>
          <SkeletonPlaceholder>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
      ) : (
        <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={styles.imagebackground}>
        <Container>
          <FlatList
          style={{width:'100%'}}
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
                onPress={() =>
                  navigation.navigate('CommentScreen')
                }
              />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListHeader}
            showsVerticalScrollIndicator={false}
          />
        </Container>
        </ImageBackground>
      )}
    
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagebackground: {
    flex: 1,
    justifyContent: "center",
  },
})

