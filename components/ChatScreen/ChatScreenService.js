import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadUserIDFromStorage = async () => {
  try {
    const uid = await AsyncStorage.getItem('uid');
    return JSON.parse(uid);
  } catch (error) {
    console.error(error.message);
  }
  return -1;
};

export const saveUserIDToStorage = async (uid) => {
  if (!uid) {
    return;
  }
  try {
    await AsyncStorage.setItem('uid', JSON.stringify(uid));
  } catch (error) {
    console.error(error.message);
  }
};

export const loadMessagesFromStorage = async () => {
  try {
    const messages = await AsyncStorage.getItem('messages') || [];
    return JSON.parse(messages);
  } catch (error) {
    console.error(error.message);
  }
  return [];
};

export const saveMessagesToStorage = async (messages) => {
  if (messages.length <= 0) {
    return;
  }
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(messages));
  } catch (error) {
    console.error(error.message);
  }
};
