import axios from 'axios';
import baseUrl from './config.js'

export const showSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/show/show-search/${page}/${size}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const showUpdate = (data) => {
  return axios({
    url: `${baseUrl}/show/show-update`,
    method: 'post',
    data
  })
}

export const getshowById = (id) => {
  return axios({
    url: `${baseUrl}/show/show-getbyid?id=${id}`,
    method: 'get'
  })
}

export const showDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/show/show-delete`,
    method: 'delete',
    data
  })
}

// -------------------宠物秀评论管理---------------------
export const commentSearch = (page, size, searchMap, id) => {
  return axios({
    url: `${baseUrl}/show/comment-search/${page}/${size}/${id}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const getCommentById = (id) => {
  return axios({
    url: `${baseUrl}/show/comment-getbyid?id=${id}`,
    method: 'get'
  })
}

export const commentUpdate = (data) => {
  return axios({
    url: `${baseUrl}/show/comment-update`,
    method: 'post',
    data
  })
}

export const commentDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/show/comment-delete`,
    method: 'delete',
    data
  })
}
