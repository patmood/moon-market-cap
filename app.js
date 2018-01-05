const STALE_THRESHOLD = 600 // 10 mins

class TopList {
  constructor(el) {
    this.fetchTopList = this.fetchTopList.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.render = this.render.bind(this)
    this.list = []
    this.el = el

    // check for cached data
    // TODO: use indexDb
    try {
      this.list = JSON.parse(localStorage.getItem('list'))
      this.render()
    } catch (error) {
      console.error(error)
    }

    this.fetchTopList().then(this.render)
  }

  fetchTopList(count = 10) {
    return fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=${count}`)
      .then(res => res.json())
      .then(json => {
        try {
          localStorage.setItem('list', JSON.stringify(json))
        } catch (error) {
          console.error(error)
        }
        this.list = json
        return json
      })
  }

  renderRow(data) {
    const rowClass =
      data.last_updated < Date.now() / 1000 - STALE_THRESHOLD ? 'muted' : ''
    const colorClass = data.percent_change_24h > 0 ? 'green' : 'red'

    return `
      <tr class="${rowClass}">
        <td class="center">${data.rank}</td>
        <td>
          <div>${data.symbol}</div>
          <small class="muted">${data.name}</small>
        </td>
        <td class="align-right">$${data.price_usd}</td>
        <td class="align-right ${colorClass}">${data.percent_change_24h}%</td>
      </tr>
    `
  }

  render() {
    const template = `
      <table class="table mt1 mx-auto">
        <thead>
          <tr>
            <th class="center">Rank</th>
            <th class="align-left">Symbol</th>
            <th class="align-right">Price (USD)</th>
            <th class="align-right">24h Change</th>
          </tr>
        </thead>
        <tbody>
          ${this.list.map(coin => this.renderRow(coin)).join('')}
        </tbody>
      </table>

    `
    this.el.innerHTML = template
  }
}

function init() {
  const el = document.getElementById('coin-list')
  new TopList(el)

  // Register ServiceWorker
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/service-worker.js').then(() => {
  //     console.log('serivceWorker registered')
  //   })
  // }
}

init()
