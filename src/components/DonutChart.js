import { h } from 'hyperapp'
import Chart from 'chart.js'

let myChart

const setupChart = (el, portfolio) => {
  const data = {
    datasets: [{ data: [] }],
    labels: [],
  }
  const options = {}
  myChart = new Chart(el, {
    type: 'doughnut',
    data: data,
    options: options,
  })
  handleUpdate(portfolio)
}

const handleUpdate = portfolio => {
  if (!myChart) return
  myChart.data.labels = []
  myChart.data.datasets = [{ data: [] }]
  for (const symbol in portfolio) {
    myChart.data.datasets[0].data.push(portfolio[symbol])
    myChart.data.labels.push(symbol)
  }
  myChart.update(0)
}

export const DonutChart = ({ portfolio }) => {
  return (
    <div style="position: relative">
      <canvas
        id="chart"
        oncreate={el => setupChart(el, portfolio)}
        onupdate={(el, oldProps) => handleUpdate(portfolio)}
      />
    </div>
  )
}
