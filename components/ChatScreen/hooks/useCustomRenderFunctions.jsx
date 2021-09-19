/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { Bubble, InputToolbar } from 'react-native-gifted-chat';

import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

const useCustomRenderFunctions = (bgCol, uploadImage) => {
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
  const renderInputToolbar = (showInputToolBar) => (props) => (
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

  return {
    renderBubble,
    renderInputToolbar,
    renderCustomActions,
    renderCustomView,
  };
};

export default useCustomRenderFunctions;
