import { firestore } from './lib/fire'

export const actionDefs = {
  setUser: user => (state, actions) => ({ user }),
  setPortfolio: portfolio => (state, actions) => ({ portfolio }),
  setAllCoins: allCoins => (state, actions) => ({ allCoins }),

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
        actions.setCoin({ [name]: coinData[0] })
        actions.calculateStats()
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
    actions.savePortfolio(newPortfolio)
  },

  savePortfolio: portfolio => (state, actions) => {
    // Save portfolio in firebase
    if (state.user) {
      firestore
        .collection('portfolios')
        .doc(state.user.uid)
        .set(portfolio)
        .then(() => console.log('saved to firebase'))
        .catch(err => console.error(err))
    }

    return actions.setPortfolio(portfolio)
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

  deleteCoin: id => (state, actions) => {
    const shouldDelete = confirm(
      `Are you sure you want to delete ${id} from your portfolio?`
    )
    if (!shouldDelete) return
    const portfolio = Object.assign({}, state.portfolio)
    delete portfolio[id]
    actions.savePortfolio(portfolio)
  },

  calculateStats: () => (state, actions) => {
    let totalValue = 0
    let totalPercentChange_1h = 0
    let totalPercentChange_24h = 0
    let totalPercentChange_7d = 0

    for (const coin in state.portfolioCoinData) {
      totalValue +=
        state.portfolioCoinData[coin].price_usd * state.portfolio[coin]
    }

    for (const coin in state.portfolioCoinData) {
      const {
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
      } = state.portfolioCoinData[coin]

      const percentPortfolio =
        state.portfolioCoinData[coin].price_usd *
        state.portfolio[coin] /
        totalValue

      totalPercentChange_1h +=
        percentPortfolio * parseFloat(percent_change_1h) / 100
      totalPercentChange_24h +=
        percentPortfolio * parseFloat(percent_change_24h) / 100
      totalPercentChange_7d +=
        percentPortfolio * parseFloat(percent_change_7d) / 100
    }

    return {
      portfolioStats: {
        totalValue,
        totalPercentChange_1h,
        totalPercentChange_24h,
        totalPercentChange_7d,
      },
    }
  },
}
