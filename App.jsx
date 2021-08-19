import { StatusBar } from 'expo-status-bar';
import React from 'react';

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';

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
