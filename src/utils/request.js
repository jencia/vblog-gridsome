const axios = require('axios')
const config = require('../config')

const request = axios.create({
  baseURL: "https://api.github.com",
  timeout: 15000,
  headers: {
    // xxx 需换成真实的 token
    Authorization: 'token xxx'
  }
})

module.exports = request
