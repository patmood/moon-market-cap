const axios = require('axios')
const fs = require('fs')

axios
  .get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
  .then(res => {
    return res.data.map(coin => {
      return {
        symbol: coin.symbol,
        id: coin.id,
        name: coin.name,
      }
    })
  })
  .then(list => {
    list = list.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      // a must be equal to b
      return 0
    })
    fs.writeFileSync(`./static/coin-list.json`, JSON.stringify(list))
  })
