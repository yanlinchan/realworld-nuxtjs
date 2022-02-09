import { request } from '../plugins/request'

export const login = data => {
  return request({
    method: 'POST',
    url: '/users/login',
    data
  })
}

export const register = data => {
  return request({
    method: 'POST',
    url: '/users',
    data
  })
}

export const update = data => {
  return request({
    method: 'PUT',
    url: '/user',
    data
  })
}