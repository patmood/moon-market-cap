import { h } from 'hyperapp'
import { currencyFormatter } from '../lib/utils'

const STALE_THRESHOLD = 600 // 10 mins

export const PortfolioRow = props => {
  if (!props.data) return null

  const rowClass =
    props.data.last_updated < Date.now() / 1000 - STALE_THRESHOLD ? 'muted' : ''
  const colorClass = props.data.percent_change_24h > 0 ? 'green' : 'red'

  return (
    <tr class={rowClass}>
      <td>
        <div>{props.data.symbol}</div>
        <small class="muted">{props.data.name}</small>
      </td>
      <td class="right-align">{props.amount}</td>
      <td class="right-align">
        {currencyFormatter.format(props.amount * props.data.price_usd)}
      </td>
      <td class="right-align">
        {currencyFormatter.format(props.data.price_usd)}
      </td>
      <td class={`right-align ${colorClass}`}>
        {props.data.percent_change_24h}%
      </td>
      <td>
        <button
          class="btn"
          style={{ padding: 0 }}
          onclick={() => props.actions.deleteCoin(props.data.id)}
        >
          <img
            src="/images/cross.svg"
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </td>
    </tr>
  )
}
