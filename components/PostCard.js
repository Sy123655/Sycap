/* eslint-disable prettier/prettier */
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  InteractionWrapper1,
  Interaction,
  Interaction1,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';

import ProgressiveImage from './ProgressiveImage';

import {AuthContext} from '../navigation/AuthProvider';

import moment from 'moment';

import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native';

const PostCard = ({item, onDelete, onPress, navigation}) => {
  const [comments, setComments] = useState(null);
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [text, setText] = useState("");
  const [ loading, setLoading ] = useState(true);



  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Card key={item.id}>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <UserInfoText>
          <TouchableOpacity onPress={onPress
                }>
            <UserName>
              {userData ? userData.fname || 'Test' : 'Test'}{' '}
              {userData ? userData.lname || 'User' : 'User'}
            </UserName>
          </TouchableOpacity>
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostText> <Ionicons name="play-forward-outline" size={20} /> {item.post}</PostText>
      <PostText> <Ionicons name="cash-outline" size={20} /> {item.price}$/1 month</PostText>
      <PostText> Note: {item.note}</PostText>
      <InteractionWrapper1>
      <Interaction1>
      <PostText> <Ionicons name="keypad-outline" size={20} />{item.type}</PostText>
      <PostText> <Ionicons name="folder-outline" size={20} />{item.furniture}</PostText>
        </Interaction1>
      </InteractionWrapper1>
      {/* {item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : <Divider />} */}
      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../assets/default-img.jpg')}
          source={{uri: item.postImg}}
          style={{width: 400, height: 250}}
          resizeMode="cover"
        />
      ) : (
        <Divider />
      )}
      <InteractionWrapper>
        <Interaction>
        <Ionicons name="earth-outline" size={25} />
          <InteractionText>{item.address}</InteractionText>
        </Interaction>
        <Interaction>
        <Ionicons name="bed-outline" size={25} />
          <InteractionText>{item.badroom}</InteractionText>
        </Interaction>
        <Interaction>
        <Ionicons name="call-outline" size={25} />
          <InteractionText>{userData ? userData.phone || 'phone' : 'phone'}</InteractionText>
        </Interaction>
        {user.uid == item.userId ? (
          <Interaction onPress={() => onDelete(item.id)}>
            <Ionicons name="md-trash-bin" size={25} />
          </Interaction>
        ) : null}
      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;