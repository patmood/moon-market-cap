import { h } from 'hyperapp'
import Chart from 'chart.js'
import { percentFormatter } from '../lib/utils'

let myChart

const setupChart = (el, portfolio) => {
  const data = {
    datasets: [{ data: [] }],
    labels: [],
  }
  const options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const percent = percentFormatter.format(
            data.datasets[0].data[tooltipItem.index]
          )
          return `${data.labels[tooltipItem.index]} ${percent}`
        },
      },
    },
  }

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

export const DonutChart = ({ portfolioValues }) => {
  return (
    <div style="position: relative">
      <canvas
        id="chart"
        oncreate={el => setupChart(el, portfolioValues)}
        onupdate={(el, oldProps) => handleUpdate(portfolioValues)}
      />
    </div>
  )
}
