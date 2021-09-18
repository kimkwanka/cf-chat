/* eslint-disable no-console */
import React from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet,
} from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

const CustomActions = ({ onSend, uploadImage }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.error(error));

      if (!result.cancelled) {
        const imageURL = await uploadImage(result.uri);
        if (imageURL) {
          console.log(imageURL);
          onSend({ image: imageURL });
        }
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({}).catch((error) => console.error(error));

      if (!result.cancelled) {
        const imageURL = await uploadImage(result.uri);
        if (imageURL) {
          console.log(imageURL);
          onSend({ image: imageURL });
        }
      }
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      // https://github.com/expo/expo/issues/5504#issuecomment-913354765
      const result = await Location.getCurrentPositionAsync({ accuracy: 1 })
        .catch((error) => console.error(error));

      if (result) {
        const { latitude, longitude } = result.coords;
        onSend({
          location: {
            latitude,
            longitude,
          },
        });
        console.log(result);
      }
    }
  };

  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await pickImage();
            return;
          case 1:
            await takePhoto();
            return;
          case 2:
            await getLocation();
            break;
          default:
        }
      },
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => onActionPress()}
    >
      <View style={[styles.wrapper]}>
        <Text style={[styles.iconText]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

CustomActions.propTypes = {
  onSend: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

export default CustomActions;
