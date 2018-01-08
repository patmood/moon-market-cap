import { h } from 'hyperapp'
import { DonutChart } from './DonutChart'
import { PortfolioRow } from './PortfolioRow'
import { AddCoin } from './AddCoin'

export const Portfolio = ({ state, actions }) => (
  <div>
    <h2>Your Portfolio</h2>
    {!!Object.keys(state.portfolio).length && (
      <DonutChart portfolio={state.portfolio} />
    )}
    <div>
      <table class="table mt1 mx-auto mb2">
        <thead>
          <tr>
            <th class="left-align">Symbol</th>
            <th class="right-align">Total Value (USD)</th>
            <th class="right-align">Quantity</th>
            <th class="right-align">Price (USD)</th>
            <th class="right-align">24h Change</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {Object.keys(state.portfolio).map(id => (
            <PortfolioRow
              key={id}
              amount={state.portfolio[id]}
              data={state.portfolioCoinData[id]}
              actions={actions}
            />
          ))}
        </tbody>
      </table>

      <AddCoin actions={actions} state={state} />
    </div>
  </div>
)
