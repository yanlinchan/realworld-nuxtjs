import { request } from '../plugins/request'

export const getTags = params => {
  return request({
    method: 'GET',
    url: '/tags',
    params
  })
}