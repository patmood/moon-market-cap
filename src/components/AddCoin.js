import { h } from 'hyperapp'

export const AddCoin = ({ state, actions }) => (
  <form
    onsubmit={actions.addCoin}
    oncreate={actions.fetchAllCoins}
    class="bg-darken-1 rounded p2"
  >
    <p>Add an asset to your portfolio:</p>
    <div>
      <label for="id">Coin:</label>
      <select name="id" class="input" id="id">
        <option value="" disabled selected>
          Select a coin
        </option>
        {state.allCoins.map(coin => (
          <option key={coin.symbol} value={coin.id}>
            {`${coin.name} (${coin.symbol})`}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label>Quantity:</label>
      <input placeholder="0" name="amount" class="input" />
    </div>
    <div>
      <button class="btn btn-primary" type="submit">
        Add to portfolio
      </button>
    </div>
  </form>
)
