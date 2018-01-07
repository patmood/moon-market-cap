import { h } from 'hyperapp'
import { CoinRow } from './CoinRow'

export const TopList = ({ state, actions }) => (
  <div>
    <h2>Top Coins</h2>
    <table class="table mt1 mx-auto">
      <thead>
        <tr>
          <th class="center xs-hide">Rank</th>
          <th class="left-align">Symbol</th>
          <th class="right-align">Price (USD)</th>
          <th class="right-align">24h Change</th>
          <th class="right-align xs-hide">Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {state.list.map(coin => <CoinRow key={coin.symbol} {...coin} />)}
      </tbody>
    </table>
    <div class="center">
      <button
        class="btn btn-primary"
        disabled={!!state.loading}
        onclick={() => actions.fetchTopList(state.listOffset + 10)}
      >
        {state.loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  </div>
)
