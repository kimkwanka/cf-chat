/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, Pressable, ImageBackground,
} from 'react-native';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
  },
  bgImg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperHalf: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 0.56,
    width: '100%',
  },
  floatingBox: {
    flex: 0.44,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4%',
    margin: '4%',
    height: '44%',
    width: '88%',
  },
  appTitle: {
    paddingTop: '20%',
    fontSize: 45,
    fontWeight: '700',
    color: '#fff',
  },
  tInput: {
    color: '#757083',
    borderColor: '#757083',
    borderWidth: 1,
    padding: 8,
    width: '100%',
  },
  chooseBGContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  chooseBGText: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
  },
  colCircleContainer: {
    flexDirection: 'row',
  },
  colCircle: {
    borderRadius: 25,
    borderWidth: 4,
    margin: 8,
    height: 50,
    width: 50,
  },
  colCircle1: {
    backgroundColor: '#090C08',
  },
  colCircle2: {
    backgroundColor: '#474056',
  },
  colCircle3: {
    backgroundColor: '#8A95A5',
    borderColor: 'black',
    borderWidth: 4,
  },
  colCircle4: {
    backgroundColor: '#B9C6AE',
  },
  startChatButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
  },
  startChatButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: 0.25,
    color: 'white',
  },
});

const StartScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgCol, setBGCol] = useState('#8A95A5');

  const ColorButton = ({ color }) => {
    const buttonStyle = {
      backgroundColor: color,
      borderWidth: bgCol === color ? 4 : 0,
    };

    return (
      <Pressable
        style={[styles.colCircle, buttonStyle]}
        onPress={() => setBGCol(color)}
      />
    );
  };

  ColorButton.propTypes = {
    color: PropTypes.string.isRequired,
  };

  return (
    <View style={styles.pageContent}>
      <ImageBackground style={styles.bgImg} source={require('../../assets/background.png')}>
        <View style={styles.upperHalf}>
          <Text style={styles.appTitle}>CF Chat</Text>
        </View>
        <View style={styles.floatingBox}>
          <TextInput
            style={styles.tInput}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Your Name"
          />
          <View style={styles.chooseBGContainer}>
            <Text style={styles.chooseBGText}>{`Choose Background Color${bgCol}`}</Text>
            <View style={styles.colCircleContainer}>
              <ColorButton color="#090C08" />
              <ColorButton color="#474056" />
              <ColorButton color="#8A95A5" />
              <ColorButton color="#B9C6AE" />
            </View>
          </View>
          <Pressable
            style={styles.startChatButton}
            onPress={() => navigation.navigate('Chat', { name, bgCol })}
          >
            <Text style={styles.startChatButtonText}>Start Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

StartScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default StartScreen;
