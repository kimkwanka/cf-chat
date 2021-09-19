/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useRef } from 'react';

import { GiftedChat } from 'react-native-gifted-chat';

import NetInfo from '@react-native-community/netinfo';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

import {
  API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID,
// eslint-disable-next-line import/no-unresolved
} from '@env';

import {
  loadUserIDFromStorage, saveUserIDToStorage, loadMessagesFromStorage, saveMessagesToStorage,
} from '../ChatScreenService';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const uploadImage = async (uri) => {
  const imageNameBefore = uri.split('/');
  const imageName = imageNameBefore[imageNameBefore.length - 1];

  const storageRef = firebase.storage().ref().child(`images/${imageName}`);

  const response = await fetch(uri);
  const blob = await response.blob();

  let imageURL = '';

  try {
    const snapshot = await storageRef.put(blob);
    imageURL = await snapshot.ref.getDownloadURL();
  } catch (err) {
    console.error(err);
  }

  return imageURL;
};

const useFirebase = (name, navigation, setShowInputToolBar) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUser, setChatUser] = useState({ _id: null, avatar: 'https://placeimg.com/140/140/any', name });

  const firebaseMessagesRef = useRef(null);

  const onCollectionUpdate = (collection) => {
    const messages = [];

    collection.forEach((doc) => {
      const {
        user, createdAt, text, _id, image, location,
      } = doc.data();

      messages.push({
        _id,
        text,
        createdAt: createdAt.toDate(),
        user,
        image,
        location,
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

  return {
    uploadImage,
    onSend,
    chatUser,
    chatMessages,
  };
};

export default useFirebase;
