import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Clipboard } from 'react-native';
import { Header, Text } from 'react-native-elements';
import { CircularProgress } from 'react-native-circular-progress';
import Toast from 'react-native-easy-toast'
import Ripple from 'react-native-material-ripple'
import hmac from './hmac.js'
import storage from './storage.js'

// ------------------

// ToDo rename list item
// ToDo remove from list
// ToDo import secret directly
// ToDo backup to icloud / authscorp

export default class CodesView extends Component {
  constructor(e) {
    super(e)

    this.renderItem = this.renderItem.bind(this)
    this.state = {
      progress: 0
    }
  }

  componentDidMount() {
    this.$interval = setInterval(() => {
      this.setState({
        progress: (Date.now() % (30 * 1000)) / (300)
      })
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.$interval)
  }

  getCode(item) {
    var currenTime = Math.floor(Date.now() / 30000)
    if(item.lastTime === currenTime)
      return item.code

    item.lastTime = currenTime
    if(!item.secret)
      item.secret = new hmac(item.authenticator, true)

    item.code = item.secret.authenticator(currenTime)
    return item.code
  }

  onCopy(code) {
    Clipboard.setString(code)
    this.refs.toast.show('Authenticator code copied!')
  }

  renderItem({ item }) {
    var color = "#212121"
    if(this.state.progress > 80 && Math.round(this.state.progress) % 4 < 2) {
      color = "#d32f2f"
    } else if(this.state.progress > 80) {
      color = "#8e0000"
    }

    var code = this.getCode(item)
    return (<Ripple rippleColor="#0034b2" onPress={() => this.onCopy(code)}>
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text h2 style={{paddingBottom: 5, color }}>{code}</Text>
                <View style={{marginTop: 15}}>
                    <CircularProgress size={20} width={10} fill={this.state.progress} rotation={0} tintColor={color} />
                </View>
            </View>
            <Text>{item.name}</Text>
        </View>
    </Ripple>)
  }

  render() {
    return (
        <View style={styles.container}>
            <Header
                backgroundColor="#095CE5"
                centerComponent={{ text: 'Authenticator', style: { color: '#fff' } }}
                rightComponent={{ icon: 'add', color: '#fff', onPress: () => this.props.navigation.navigate('Scanner') }}
            />
            {
              storage.items.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                  <Text h4 style={{textAlign: 'center'}}>Scan a new authenticator code to get started</Text>
                </View>
              ) : (<FlatList
                keyExtractor={(item) => item.authenticator}
                data={storage.items}
                renderItem={this.renderItem}
              />)
            }
            <Toast ref="toast" />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});
  