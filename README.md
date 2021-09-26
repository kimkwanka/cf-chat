# CF-Chat

A React Native messenger app inspired by the likes of Whatsapp and Co.

## Built With
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/)

## Prerequisites
### Expo CLI
As this app relies on [Expo](https://expo.dev/) it is recommended to install
expo-cli globally via

``npm install --global expo-cli``

or

``yarn global add expo-cli``

### Expo Go App
To run the app on a physical device (iOS or Android) or an emulator, you need to install the [Expo Go](https://expo.dev/client) on that device.

### Firebase
The app uses [Firebase](https://firebase.google.com/) to store its data so in order to use it you will need a Firebase account and set up a Firestore database as outlined in the [Firebase Documentation](https://firebase.google.com/docs).

### Environment Variables
The app depends on the following environment variables (supplied as a [.env file](https://www.npmjs.com/package/react-native-dotenv)) to be able to connect to [Firebase](https://firebase.google.com/).

  **API_KEY**=YOUR_API_KEY

  **AUTH_DOMAIN**=YOUR_AUTH_DOMAIN

  **DATABASE_URL**=YOUR_DATABASE_URL

  **PROJECT_ID**=YOUR_PROJECT_ID

  **STORAGE_BUCKET**=YOUR_STORAGE_BUCKET

  **MESSAGING_SENDER_ID**=YOUR_MESSAGING_SENDER_ID

  **APP_ID**=YOUR_APP_ID

Just create a file named ``.env`` in the project root, copy the above lines into it and replace the placeholders with your credentials. These can be found in the **"Project Settings"** in the Firebase console.

## Installation
After cloning the repository run either
``yarn`` or ``npm install`` to install all dependencies.

## Usage
Use ``expo start`` to run the Expo development server and start the Expo Go app on the device of your choice.
