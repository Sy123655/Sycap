/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost';

import { AuthContext } from '../navigation/AuthProvider';

const AddPostScreen = (props) => {
  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState('');
  const [badroom, setBadroom] = useState('');
  const [address, setAddress] = useState();
  const [furniture, setFurniture] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [note, setNote] = useState('');

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };
  
  const submitPost = async () => {
    const imageUrl = await uploadImage();
    if (!post.trim()) {
        Alert.alert('Please Enter Property Name');
      return;
    }
  else if(!badroom.trim()){
    Alert.alert('Please Enter Bedroom');
    return;
  }
  else if(!price.trim()){
    Alert.alert('Please Enter Bedroom');
    return;
  }
  else if(address == 0){
    Alert.alert('Please Enter Address');
    return;
  }
  else if(type == 0){
    Alert.alert('Please Enter Type');
    return;
  } else {
      firestore()
    .collection('posts')
    .add({
      userId: user.uid,
      post: post,
      type: type,
      badroom: badroom,
      address: address,
      furniture: furniture,
      price: price,
      note: note,
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Post published!',
        'Your post has been published Successfully!',
      );
      setPost(null);
      props.navigation.navigate('Rental House');
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
    }
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={styles.imagebackground}>
      <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}
        <InputField
          placeholder="Property Name..."
          multiline
          numberOfLines={1}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
        <Picker
        style ={{backgroundColor: "#ffffff",fontSize: 15,
          width:360,
        marginBottom: 10}}
          selectedValue={type}
          onValueChange={(itemValue, itemIndex) =>
            setType(itemValue)
          }>
          <Picker.Item label="Select Type....." value="0" />
          <Picker.Item label="Flat" value="Flat" />
          <Picker.Item label="House" value="House" />
          <Picker.Item label="Bungalow" value="Bungalow" />
      </Picker>
        <InputField
          placeholder="Price..."
          multiline
          numberOfLines={1}
          value={price}
          onChangeText={(content) => setPrice(content)}
        />
        <InputField
          placeholder="Bedrooms..."
          multiline
          numberOfLines={1}
          value={badroom}
          onChangeText={(content) => setBadroom(content)}
        />
        <InputField
          placeholder="Note..."
          multiline
          numberOfLines={1}
          value={note}
          onChangeText={(content) => setNote(content)}
        />
        <Picker
        style ={{backgroundColor: "#ffffff",fontSize: 15,
          width:360,
        marginBottom: 10}}
          selectedValue={address}
          onValueChange={(itemValue, itemIndex) =>
            setAddress(itemValue)
          }>
          <Picker.Item label="Select Address....." value="0" />
          <Picker.Item label="HCM" value="HCM" />
          <Picker.Item label="BRVT" value="BRVT" />
          <Picker.Item label="Nha Trang" value="Nha Trang" />
          <Picker.Item label="Cần thơ" value="Cần thơ" />
          <Picker.Item label="Hà nội" value="Hà nội" />
          <Picker.Item label="Bình thuận" value="Bình thuận" />
          <Picker.Item label="Đồng nai" value="Đồng nai" />
          <Picker.Item label="Hòa bình" value="Hòa bình" />
          <Picker.Item label="Quảng trị" value="Quảng trị" />
          <Picker.Item label="Huế" value="Huế" />
          <Picker.Item label="Long an" value="Long an" />
        </Picker>
        <Picker
        style ={{backgroundColor: "#ffffff",fontSize: 15,
          width:360,
          marginBottom: 10}}
          selectedValue={furniture}
          onValueChange={(itemValue, itemIndex) =>
            setFurniture(itemValue)
          }>
          <Picker.Item label="Furniture....." value="0" />
          <Picker.Item label="Furnished" value="Furnished" />
          <Picker.Item label="Unfurnished" value="Unfurnished" />
          <Picker.Item label="Part Furnished" value="Part Furnished" />
      </Picker>
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      <ActionButton buttonColor="#2e64e5">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
      </ImageBackground>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  imagebackground: {
    flex: 1,
    justifyContent: 'center',
    width: 400,
  },
});