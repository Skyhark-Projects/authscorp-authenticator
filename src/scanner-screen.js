import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner'
import { parse as querystring } from 'querystring'
import storage from './storage'

export default class ScannerView extends Component {
    constructor(e) {
        super(e)
        this.state = {
            hasPermission: false,
        }

        Camera.requestPermissionsAsync().then(({ status }) => {
            this.setState({
                hasPermission: status === 'granted'
            })
        })
    }

    onBarCodeScanned(code) {
        code = code.data
        if(code.substr(0,15) !== 'otpauth://totp/')
            return

        var index = code.indexOf('?')
        if(index == -1)
            return

        var name = code.substr(15, index-15)
        var query = querystring(code.substr(index+1))
        if(!query.secret || !ScannerView.isBase32(query.secret.toUpperCase()))
            return

        storage.add({
            name: name,
            authenticator: query.secret,
            // subname ?         
        }).then(() => {
            this.props.navigation.goBack()
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor="#095CE5"
                    centerComponent={{ text: 'Scan QR code', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'close', color: '#fff', onPress: () => this.props.navigation.goBack() }}
                />
                {
                    this.state.hasPermission ? (
                        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} barCodeScannerSettings={{barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]}} onBarCodeScanned={this.onBarCodeScanned.bind(this)} />
                    ): (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Camera permission required</Text>
                        </View>
                    )
                }
            </View>
          )
    }

    static isBase32(data) {
        // A-Z and 2-7 repeated, with optional `=` at the end
        let b32_regex = /^[A-Z2-7]+=*$/;

        var b32_yes = 'AJU3JX7ZIA54EZQ=';
        var b32_no  = 'klajcii298slja018alksdjl';

        if (b32_yes.length % 8 === 0 && b32_regex.exec(b32_yes))
            return true

        if (b32_no % 8 === 0 && b32_regex.exec(b32_no))
            return true

        return false
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
});
  