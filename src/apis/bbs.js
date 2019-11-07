import axios from 'axios';
import baseUrl from './config.js'

export const bbsSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/bbs/bbs-search/${page}/${size}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const bbsUpdate = (data) => {
  return axios({
    url: `${baseUrl}/bbs/bbs-update`,
    method: 'post',
    data
  })
}

export const getbbsById = (id) => {
  return axios({
    url: `${baseUrl}/bbs/BBS-getbyid?id=${id}`,
    method: 'get'
  })
}

export const bbsDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/bbs/bbs-delete`,
    method: 'delete',
    data
  })
}

// -------------------论坛文章评论管理---------------------
export const commentSearch = (page, size, searchMap, id) => {
  return axios({
    url: `${baseUrl}/bbs/comment-search/${page}/${size}/${id}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const getCommentById = (id) => {
  return axios({
    url: `${baseUrl}/bbs/comment-getbyid?id=${id}`,
    method: 'get'
  })
}

export const commentUpdate = (data) => {
  return axios({
    url: `${baseUrl}/bbs/comment-update`,
    method: 'post',
    data
  })
}

export const commentDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/bbs/comment-delete`,
    method: 'delete',
    data
  })
}

