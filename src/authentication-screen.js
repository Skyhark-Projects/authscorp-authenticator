import React, { Component } from 'react';
import * as LocalAuthentication from 'expo-local-authentication'
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native'
import { Header, Text } from 'react-native-elements';

export default class AuthenticationScreen extends Component {

  state = {
    compatible: false,
    fingerprints: false,
  };

  componentDidMount() {
    Promise.all([
      this.checkDeviceForHardware(),
      this.checkForFingerprints(),
    ]).then(
      Platform.OS === 'android'
      ? this.showAndroidAlert
      : this.scanFingerprint
    )
  }

  checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    this.setState({ compatible });
  };

  checkForFingerprints = async () => {
    let fingerprints = await LocalAuthentication.isEnrolledAsync();
    this.setState({ fingerprints });
  };

  scanFingerprint = async () => {
    let result = await LocalAuthentication.authenticateAsync(
      'Scan your finger.'
    );

    if(result.success)
      this.props.navigation.navigate('Codes')
  };

  showAndroidAlert = () => {
    Alert.alert(
      'Fingerprint Scan',
      'Place your finger over the touch sensor and press scan.',
      [
        {
          text: 'Scan',
          onPress: () => {
            this.scanFingerprint();
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  render() {
    return (
        <View style={{ background: '#fff', flex: 1 }}>
          <Header
              backgroundColor="#095CE5"
              centerComponent={{ text: 'Authenticator', style: { color: '#fff' } }}
            />
          <View style={styles.container}>
            <TouchableOpacity
              onPress={
                Platform.OS === 'android'
                  ? this.showAndroidAlert
                  : this.scanFingerprint
              }
              style={styles.button}>
              <Text style={styles.buttonText}>Unlock screen</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 15,
    backgroundColor: '#ecf0f1',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 60,
    backgroundColor: '#056ecf',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});