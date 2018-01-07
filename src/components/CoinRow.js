import { h } from 'hyperapp'
import { currencyFormatter } from '../lib/utils'

const STALE_THRESHOLD = 600 // 10 mins

export const CoinRow = props => {
  const rowClass =
    props.last_updated < Date.now() / 1000 - STALE_THRESHOLD ? 'muted' : ''
  const colorClass = props.percent_change_24h > 0 ? 'green' : 'red'

  return (
    <tr class={rowClass}>
      <td class="center xs-hide">{props.rank}</td>
      <td>
        <div>{props.symbol}</div>
        <small class="muted">{props.name}</small>
      </td>
      <td class="right-align">{currencyFormatter.format(props.price_usd)}</td>
      <td class={`right-align ${colorClass}`}>{props.percent_change_24h}%</td>
      <td class="right-align xs-hide">
        {currencyFormatter.format(props.market_cap_usd)}
      </td>
    </tr>
  )
}
