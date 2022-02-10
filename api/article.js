import { request } from '../plugins/request'

export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/articles',
    params
  })
}

export const getYourFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/articles/feed',
    // headers: {
    //   Authorization: `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN5bDQ2ODUyMDI1M0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6InlhbmxpbmNoYW4iLCJwYXNzd29yZCI6IiQyYSQxMCRMbmRUdUdDL1hoTm1jSERKMlNoQ0YubTNpUi92NkVKdVdHWXpuTzdnakhrdklMdHFJZmhHTyIsImJpbyI6bnVsbCwiaW1hZ2UiOiJodHRwczovL2FwaS5yZWFsd29ybGQuaW8vaW1hZ2VzL3NtaWxleS1jeXJ1cy5qcGVnIiwiaWF0IjoxNjQ0MjQ2MDgyLCJleHAiOjE2NDk0MzAwODJ9.BYJXsVZDCCbWuvKDPa6v8R5RlGOBLepL6uc6q67wo6g`
    // },
    params
  })
}

export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `/articles/${slug}/favorite`
  })
}

export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `/articles/${slug}/favorite`
  })
}

export const addArticle = data => {
  return request({
    method: 'POST',
    url: `/articles`,
    data
  })
}

export const updateArticle = data => {
  return request({
    method: 'PUT',
    url: `/articles/${data.slug}`,
    data
  })
}

export const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/articles/${slug}`,
  })
}

export const deleteArticle = slug => {
  return request({
    method: 'DELETE',
    url: `/articles/${slug}`,
  })
}

export const getComments = slug => {
  return request({
    method: 'GET',
    url: `/articles/${slug}/comments`
  })
}

export const postComment = data => {
  return request({
    method: 'POST',
    url: `/articles/${data.slug}/comments`,
    data
  })
}

export const deleteComment = data => {
  return request({
    method: 'DELETE',
    url: `/articles/${data.slug}/comments/${data.id}`,
  })
}