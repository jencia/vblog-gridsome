const axios = require('axios')
const config = require('../config')

const request = axios.create({
  baseURL: "https://api.github.com",
  timeout: 15000,
  headers: {
    Authorization: 'token a75382a194c726139fb2ce42ca499bf61477e4ce'
  }
})

module.exports = request
