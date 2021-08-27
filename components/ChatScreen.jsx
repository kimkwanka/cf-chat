import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import NetInfo from '@react-native-community/netinfo';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

const removeMessagesFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('messages');
  } catch (error) {
    console.error(error.message);
  }
};

const loadUserIDFromStorage = async () => {
  try {
    const uid = await AsyncStorage.getItem('uid');
    return JSON.parse(uid);
  } catch (error) {
    console.error(error.message);
  }
  return -1;
};

const saveUserIDToStorage = async (uid) => {
  if (!uid) {
    return;
  }
  try {
    await AsyncStorage.setItem('uid', JSON.stringify(uid));
  } catch (error) {
    console.error(error.message);
  }
};

const loadMessagesFromStorage = async () => {
  try {
    const messages = await AsyncStorage.getItem('messages') || [];
    return JSON.parse(messages);
  } catch (error) {
    console.error(error.message);
  }
  return [];
};

const saveMessagesToStorage = async (messages) => {
  if (messages.length <= 0) {
    return;
  }
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(messages));
  } catch (error) {
    console.error(error.message);
  }
};

const ChatScreen = ({ navigation, route: { params: { name, bgCol } } }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUser, setChatUser] = useState({ _id: null, avatar: 'https://placeimg.com/140/140/any', name });
  const [showInputToolBar, setShowInputToolBar] = useState(false);

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

  const checkIfAppIsOnline = async () => {
    try {
      const connection = await NetInfo.fetch();
      if (connection.isConnected) {
        return true;
      }
    } catch (error) {
      console.error(error.message);
    }
    return false;
  };

  useEffect(() => {
    // Set title to user name
    navigation.setOptions({ title: name });

    let authUnsubscribe = () => {};
    let unsubscribeFB = () => {};

    const doAsyncThings = async () => {
      const isOnline = await checkIfAppIsOnline();
      setShowInputToolBar(isOnline);

      if (!isOnline) {
        const loadedMessages = await loadMessagesFromStorage();
        setChatMessages(loadedMessages);

        const loadedUID = await loadUserIDFromStorage();
        setChatUser({
          ...chatUser,
          _id: loadedUID,
        });
      } else {
        // Init authentication
        authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
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
        unsubscribeFB = firebaseMessagesRef.current.orderBy('createdAt', 'desc').onSnapshot(onCollectionUpdate);
      }
    };

    doAsyncThings();

    return () => {
      unsubscribeFB();
      authUnsubscribe();
    };
  }, []);

  useEffect(() => {
    saveMessagesToStorage(chatMessages);
    saveUserIDToStorage(chatUser._id);
  }, [chatMessages]);

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

  // Customize user's speech bubble
  const renderInputToolbar = (props) => (
    showInputToolBar
      ? (
        <InputToolbar
          {...props}
        />
      )
      : null);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      { chatUser._id && (
      <GiftedChat
        messages={chatMessages}
        onSend={(messages) => onSend(messages)}
        user={chatUser}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        showUserAvatar
        renderUsernameOnMessage
      />
      )}
      { Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" /> }
    </View>
  );
};

export default ChatScreen;
