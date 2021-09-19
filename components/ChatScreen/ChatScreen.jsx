/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  View, Platform, KeyboardAvoidingView,
} from 'react-native';

import PropTypes from 'prop-types';

import { GiftedChat } from 'react-native-gifted-chat';

import useCustomRenderFunctions from './hooks/useCustomRenderFunctions';

import useFirebase from './hooks/useFirebase';

const ChatScreen = ({ navigation, route: { params: { name, bgCol } } }) => {
  const [showInputToolBar, setShowInputToolBar] = useState(false);

  const {
    uploadImage,
    onSend,
    chatUser,
    chatMessages,
  } = useFirebase(name, navigation, setShowInputToolBar);

  const {
    renderBubble,
    renderInputToolbar,
    renderCustomActions,
    renderCustomView,
  } = useCustomRenderFunctions(bgCol, uploadImage);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      { chatUser._id && (
      <GiftedChat
        messages={chatMessages}
        onSend={(messages) => onSend(messages)}
        user={chatUser}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar(showInputToolBar)}
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
