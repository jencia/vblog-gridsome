// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require('axios')
const config = require('./src/config')
const moment = require('moment')
const MarkdownIt = require('markdown-it');

const request = axios.create({
  baseURL: "https://api.github.com",
  timeout: 15000
})

module.exports = api => {
  
  // 加载 gist
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('gist')
    const { data } = await request(`/users/${config.USERNAME}/gists?access_token=${config.TOKEN}`)
    // const md = new MarkdownIt();

    for (let i = 0; i < data.length; i++) {
      for (let key in data[i].files) {
        collection.addNode({
          title: key,
          url: data[i].files[key],
          // content: md.render(data[i].files[key]['content']),
          description: data[i]['description'],
          createTime: moment(data[i]['created_at']).format('YYYY-MM-DD mm:HH:SS'),
          updateTime: moment(data[i]['updated_at']).format('YYYY-MM-DD mm:HH:SS'),
        })
        break
      }
    }
  })

  // 加载 project
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('project')
    const { data } = await request(`users/${config.USERNAME}/repos?access_token=${config.TOKEN}`)

    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      
      collection.addNode({
        id: item['id'],
        name: item['name'],
        url: item['html_url'],
        description: item['description'],
        stargazersCount: item['stargazers_count'],
        watchersCount: item['watchers_count'],
        forksCount: item['forks_count'],
        language: item['language'],
        license: item['license'] ? item['license']['spdx_id'] : '',
        createTime: moment(item['created_at']).format('YYYY-MM-DD mm:HH:SS'),
        updateTime: moment(item['updated_at']).format('YYYY-MM-DD mm:HH:SS'),
      })
    }
  })

  // 加载 followers
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('followers')
    const { data } = await request(`/users/${config.USERNAME}/followers?access_token=${config.TOKEN}`)

    data.forEach(item => {
      collection.addNode({
        name: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
      })
    })
  })

  // 加载 following
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('following')
    const { data } = await request(`/users/${config.USERNAME}/following?access_token=${config.TOKEN}`)

    data.forEach(item => {
      collection.addNode({
        name: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
      })
    })
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
    createPage({
      path: '/',
      component: './src/pages/News.vue'
    })
  })
}
