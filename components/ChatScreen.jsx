/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Platform, KeyboardAvoidingView,
} from 'react-native';

import PropTypes from 'prop-types';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import MapView from 'react-native-maps';

import NetInfo from '@react-native-community/netinfo';

import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

import {
  API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID,
// eslint-disable-next-line import/no-unresolved
} from '@env';
import CustomActions from './CustomActions';

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

// const removeMessagesFromStorage = async () => {
//   try {
//     await AsyncStorage.removeItem('messages');
//   } catch (error) {
//     console.error(error.message);
//   }
// };

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

  const renderCustomActions = (props) => <CustomActions {...props} uploadImage={uploadImage} />;

  const renderCustomView = ({ currentMessage }) => {
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

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
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
      />
      )}
      { Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" /> }
    </View>
  );
};

ChatScreen.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
      bgCol: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ChatScreen;
