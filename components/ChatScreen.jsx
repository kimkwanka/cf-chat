import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyCfKogTpqBqCIv60DMiw7i6dUnHFv2UUt4',
  authDomain: 'cf-chat-e2c85.firebaseapp.com',
  databaseURL: 'https://cf-chat-e2c85-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'cf-chat-e2c85',
  storageBucket: 'cf-chat-e2c85.appspot.com',
  messagingSenderId: '945221760315',
  appId: '1:945221760315:web:f16778cfab0aadc236331e',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const ChatScreen = ({ navigation, route: { params: { name, bgCol } } }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUser, setChatUser] = useState({ _id: null, avatar: 'https://placeimg.com/140/140/any', name });

  const firebaseMessagesRef = useRef(null);

  const onCollectionUpdate = (collection) => {
    const messages = [];

    collection.forEach((doc) => {
      const {
        user, createdAt, text, _id,
      } = doc.data();

      messages.push({
        _id,
        text,
        createdAt: createdAt.toDate(),
        user,
      });
    });
    setChatMessages(messages);
  };

  useEffect(() => {
    // Set title to user name
    navigation.setOptions({ title: name });

    // Init authentication
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      } else {
        setChatUser({
          ...chatUser,
          _id: user.uid,
        });
      }
    });

    // Init Firebase
    firebaseMessagesRef.current = firebase.firestore().collection('messages');
    const unsubscribeFB = firebaseMessagesRef.current.orderBy('createdAt', 'desc').onSnapshot(onCollectionUpdate);

    return () => {
      unsubscribeFB();
      authUnsubscribe();
    };
  }, []);

  // Append new messages on send
  const onSend = (messages = []) => {
    messages.forEach((msg) => {
      firebaseMessagesRef.current.add(msg);
    });

    setChatMessages((previousState) => (GiftedChat.append(previousState.messages, messages)));
  };

  // Customize user's speech bubble
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: bgCol,
        },
      }}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      { chatUser._id && (
      <GiftedChat
        messages={chatMessages}
        onSend={(messages) => onSend(messages)}
        user={chatUser}
        renderBubble={renderBubble}
        showUserAvatar
        renderUsernameOnMessage
      />
      )}
      { Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" /> }
    </View>
  );
};

export default ChatScreen;
