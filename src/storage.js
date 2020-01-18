import * as SecureStore from 'expo-secure-store';

const $storage = {
  items: [],
  add: async function(item) {
    if(this.items.find((o) => o.secret === item.secret))
      return

    var items = this.items.concat([item])
    await this.save(items)
    this.items = items
  },
  remove: async function(item) {
    var items = this.items.filter((o) => o.secret != item.secret)
    await this.save(items)
    this.items = items
  },
  update: async function(item) {
    // Make copy of items to prevent updating ui till db is saved
    var items = JSON.parse(JSON.stringify(this.items))
    var index = items.findIndex((o) => o.secret == item.secret)
    if(index == -1)
      items.push(item)
    else
      items[index] = item

    await this.save(items)
    this.items = items
  },
  save: async function(items) {
    items = JSON.parse(JSON.stringify(items))
    for(var i in items)
      delete items[i].secretObj

    await SecureStore.setItemAsync('authscorp-authenticator', JSON.stringify(items), {
      keychainService: 'authscorp',
    })
  }
}

SecureStore.getItemAsync('authscorp-authenticator', {
  keychainService: 'authscorp'
}).then((res) => {
  if(res === null)
    return

  $storage.items = JSON.parse(res).filter((r) => r.secret)
}).catch((err) => {
  console.error(err)
})

export default $storage