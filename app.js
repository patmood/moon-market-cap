const STALE_THRESHOLD = 600 // 10 mins

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
})

class TopList {
  constructor(el) {
    this.fetchTopList = this.fetchTopList.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.render = this.render.bind(this)
    this.list = []
    this.fetchPosition = 0
    this.el = el

    this.el.addEventListener('click', this.nextPage)

    try {
      const cachedList = JSON.parse(localStorage.getItem('list'))
      this.list = cachedList || []
      console.log('cached list:', cachedList)
      this.render()
    } catch (error) {
      console.error(error)
    }

    this.fetchTopList()
      .then(json => {
        try {
          localStorage.setItem('list', JSON.stringify(json))
        } catch (error) {
          console.error(error)
        }
        return json
      })
      .then(this.render)
  }

  nextPage(e) {
    if (e.target.id === 'load-more') {
      this.fetchPosition += 10
      this.fetchTopList(this.fetchPosition).then(this.render)
    }
  }

  fetchTopList(start = 0, count = 10) {
    return fetch(
      `https://api.coinmarketcap.com/v1/ticker/?limit=${count}&start=${start}`
    )
      .then(res => res.json())
      .then(json => {
        this.list = start ? this.list.concat(json) : json
        return json
      })
  }

  renderRow(data) {
    const rowClass =
      data.last_updated < Date.now() / 1000 - STALE_THRESHOLD ? 'muted' : ''
    const colorClass = data.percent_change_24h > 0 ? 'green' : 'red'

    return `
      <tr class="${rowClass}">
        <td class="center xs-hide">${data.rank}</td>
        <td>
          <div>${data.symbol}</div>
          <small class="muted">${data.name}</small>
        </td>
        <td class="align-right">${formatter.format(data.price_usd)}</td>
        <td class="align-right ${colorClass}">${data.percent_change_24h}%</td>
        <td class="align-right xs-hide">${formatter.format(
          data.market_cap_usd
        )}</td>
      </tr>
    `
  }

  render() {
    const template = `
      <table class="table mt1 mx-auto">
        <thead>
          <tr>
            <th class="center xs-hide">Rank</th>
            <th class="align-left">Symbol</th>
            <th class="align-right">Price (USD)</th>
            <th class="align-right">24h Change</th>
            <th class="align-right xs-hide">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          ${this.list.map(coin => this.renderRow(coin)).join('')}
        </tbody>
      </table>
      <div class="center">
        <button class="btn" id="load-more">Load More</button>
      </div>
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
