import { AsyncStorage } from 'react-native';
// ToDo check secure store: https://docs.expo.io/versions/latest/sdk/securestore/

const $storage = {
  items: [],
  add: async function(item) {
    if(this.items.find((o) => o.authenticator === item.authenticator))
      return

    var items = this.items.concat([item])
    await this.save(items)
    this.items = items
  },
  remove: async function(item) {
    var items = this.items.filter((o) => o.authenticator == item.authenticator)
    await this.save(items)
    this.items = items
  },
  save: async function(items) {
    await AsyncStorage.setItem('db', JSON.stringify(items))
    // ToDo encrypt storage and save to icloud
  }
}

AsyncStorage.getItem('db').then((res) => {
  if(res === null)
    return

  $storage.items = JSON.parse(res)
}).catch((err) => {
  console.error(err)
})

export default $storage