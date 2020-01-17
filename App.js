import React from 'react';
import CodesScreen from './src/codes-screen'
import ScannerScreen from './src/scanner-screen'
import Authentication from './src/authentication-screen'
import { ThemeProvider } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const theme = {
  colors: {
    primary: '#095CE5'
  }
};

// https://snack.expo.io/@wiloke/fingerprint-example

const AppNavigator = createSwitchNavigator({
  Lock: Authentication,
  Main: createStackNavigator({
    Codes:   CodesScreen,
    Scanner: ScannerScreen,
  }, {
    headerMode: 'none'
  }),
}, {
  initialRouteName: 'Main'
});

const Container = createAppContainer(AppNavigator)

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container />
    </ThemeProvider>
  );
}