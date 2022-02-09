import { request } from '../plugins/request'

export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/profiles/${username}`
  })
}

export const followUser = username => {
  return request({
    method: 'POST',
    url: `/profiles/${username}/follow`
  })
}


export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/profiles/${username}/follow`
  })
}