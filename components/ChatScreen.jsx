import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const ChatScreen = ({ navigation, route: { params: { name, bgCol } } }) => {
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgCol,
    }}
    >
      <Text>Hello Chat!</Text>
    </View>
  );
};

export default ChatScreen;
