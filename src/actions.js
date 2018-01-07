import { firestore } from './lib/fire'

export const actionDefs = {
  setUser: user => (state, actions) => {
    return { user }
  },

  setPortfolio: portfolio => (state, actions) => {
    return { portfolio }
  },

  setAllCoins: allCoins => (state, actions) => {
    return { allCoins }
  },

  setTopList: ({ list, listOffset }) => (state, actions) => {
    const newList = listOffset ? state.list.concat(list) : list
    return {
      list: newList,
      loading: false,
      listOffset,
    }
  },

  setCoin: coinData => (state, actions) => {
    const portfolioCoinData = Object.assign(
      {},
      state.portfolioCoinData,
      coinData
    )
    return { portfolioCoinData }
  },

  fetchTopList: (listOffset = 0) => (state, actions) => {
    const count = 10
    fetch(
      `https://api.coinmarketcap.com/v1/ticker/?limit=${count}&start=${listOffset}`
    )
      .then(res => res.json())
      .then(list => {
        return actions.setTopList({ list, listOffset })
      })
    return { loading: true }
  },

  fetchCoin: name => (state, actions) => {
    fetch(`https://api.coinmarketcap.com/v1/ticker/${name}/`)
      .then(res => res.json())
      .then(coinData => {
        return actions.setCoin({ [name]: coinData[0] })
      })
  },

  fetchAllCoins: () => (state, actions) => {
    fetch(`/coin-list.json`)
      .then(res => res.json())
      .then(actions.setAllCoins)
  },

  addCoin: e => (state, actions) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('id')
    const amount = parseFloat(formData.get('amount') || 0)

    const portfolio = state.portfolio
    const newPortfolio = { ...portfolio }
    newPortfolio[name] = amount

    // Get the latest price for this coin
    actions.fetchCoin(name)

    // Save portfolio in firebase
    if (state.user) {
      firestore
        .collection('portfolios')
        .doc(state.user.uid)
        .set(newPortfolio)
        .then(() => console.log('saved to firebase'))
        .catch(err => console.error(err))
    }

    return { portfolio: newPortfolio }
  },

  fetchPortfolio: () => (state, actions) => {
    if (!state.user) return
    firestore
      .collection('portfolios')
      .doc(state.user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()
          actions.setPortfolio(data)

          for (const coinId in data) {
            actions.fetchCoin(coinId)
          }
        } else {
          console.log('No such document!')
        }
      })
      .catch(err => console.error(err))
  },
}
