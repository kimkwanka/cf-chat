import React, { useState, useEffect } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const ChatScreen = ({ navigation, route: { params: { name, bgCol } } }) => {
  const [state, setState] = useState({ messages: [] });

  useEffect(() => {
    // Set title to user name
    navigation.setOptions({ title: name });

    // Init state
    setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'You entered the chat.',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }, []);

  // Append new messages on send
  const onSend = (messages = []) => {
    setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
      <GiftedChat
        messages={state.messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
      />
      { Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" /> }
    </View>
  );
};

export default ChatScreen;
