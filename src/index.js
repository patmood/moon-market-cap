// import './service-worker'
import { app } from 'hyperapp'
import { actionDefs } from './actions'
import state from './state'
import { View } from './view'
import { auth } from './lib/fire'

import logger from '@hyperapp/logger'

const moon = logger()(app)(state, actionDefs, View, document.body)
const { fetchTopList, setUser, fetchPortfolio } = moon

window.moon = moon // DEBUG

// Get initial data
fetchTopList()

// Save user in state
auth.onAuthStateChanged(user => {
  setUser(user)
  fetchPortfolio()
})
