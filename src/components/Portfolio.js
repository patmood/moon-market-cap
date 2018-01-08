import { h } from 'hyperapp'
import { DonutChart } from './DonutChart'
import { PortfolioRow } from './PortfolioRow'
import { AddCoin } from './AddCoin'
import { Stats } from './Stats'

export const Portfolio = ({ state, actions }) => {
  const portfolioValues = {}

  for (const id in state.portfolioCoinData) {
    portfolioValues[id] =
      state.portfolioCoinData[id].price_usd *
      state.portfolio[id] /
      state.portfolioStats.totalValue
  }

  return (
    <div>
      <h2>Your Portfolio</h2>
      <Stats {...state.portfolioStats} />
      {!!Object.keys(state.portfolio).length && (
        <DonutChart portfolioValues={portfolioValues} />
      )}
      <div>
        <table class="table mt1 mx-auto mb2">
          <thead>
            <tr>
              <th class="left-align">Symbol</th>
              <th class="right-align">Quantity</th>
              <th class="right-align">Total Value (USD)</th>
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
}
