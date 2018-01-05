const STALE_THRESHOLD = 600 // 10 mins

class TopList {
  constructor(el) {
    this.fetchTopList = this.fetchTopList.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.renderList = this.renderList.bind(this)
    this.el = el
    // check for cached stuff

    this.fetchTopList().then(this.renderList)
  }

  fetchTopList(count = 10) {
    return fetch(
      `https://api.coinmarketcap.com/v1/ticker/?limit=${count}`
    ).then(res => res.json())
  }

  renderRow(data) {
    const tr = document.createElement('tr')

    if (data.last_updated < Date.now() / 1000 - STALE_THRESHOLD) {
      tr.classList.add('muted')
    }

    const colorClass = data.percent_change_24h > 0 ? 'green' : 'red'
    tr.innerHTML = `
      <td class="center">${data.rank}</td>
      <td>
        <div>${data.symbol}</div>
        <small class="muted">${data.name}</small>
      </td>
      <td class="align-right">$${data.price_usd}</td>
      <td class="align-right ${colorClass}">${data.percent_change_24h}%</td>
    `
    return tr
  }

  renderList(coinList) {
    coinList.forEach(coin => {
      const row = this.renderRow(coin)
      this.el.appendChild(row)
    })
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
