/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://api.realworld.io/api',
})

export default ({ store }) => {
  request.interceptors.request.use(function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}