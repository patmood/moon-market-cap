import { h } from 'hyperapp'
import { currencyFormatter, percentFormatter } from '../lib/utils'

const statClass = 'col center mb2 px2 col-12 sm-col-4'

export const Stats = ({
  totalValue,
  totalPercentChange_1h,
  totalPercentChange_24h,
  totalPercentChange_7d,
}) => (
  <div class="clearfix">
    <div class={statClass}>
      <h3 class="h4">Total Value</h3>
      <div class="h2">{currencyFormatter.format(totalValue)}</div>
    </div>
    <div class={statClass}>
      <h3 class="h4">Change (24 hours)</h3>
      <div class={`h2 ${totalPercentChange_24h > 0 ? 'green' : 'red'}`}>
        {percentFormatter.format(totalPercentChange_24h)}
      </div>
    </div>
    <div class={statClass}>
      <h3 class="h4">Change (7 days)</h3>
      <div class={`h2 ${totalPercentChange_7d > 0 ? 'green' : 'red'}`}>
        {percentFormatter.format(totalPercentChange_7d)}
      </div>
    </div>
  </div>
)
