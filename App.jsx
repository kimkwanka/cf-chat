import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { LogBox } from 'react-native';

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
LogBox.ignoreLogs(['Setting a timer']);

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <StatusBar style="auto" />
    <Stack.Navigator
      initialRouteName="Screen1"
    >
      <Stack.Screen
        name="Start"
        component={StartScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
