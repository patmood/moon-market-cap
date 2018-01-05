const STALE_THRESHOLD = 300 // 5 mins

function fetchTop(count = 10) {
  return fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=${count}`).then(
    res => res.json()
  )
}

function renderRow(data) {
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

function renderList(coinList) {
  const el = document.getElementById('coin-list')
  coinList.forEach(coin => {
    const row = renderRow(coin)
    el.appendChild(row)
  })
}

function init() {
  fetchTop().then(renderList)
}

init()
