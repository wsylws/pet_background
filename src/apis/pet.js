import axios from 'axios';
import baseUrl from './config.js'

export const adoptSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/pet/adopt-search/${page}/${size}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const getAdoptById = (id) => {
  return axios({
    url: `${baseUrl}/pet/adopt-getbyid?id=${id}`,
    method: 'get'
  })
}

export const adoptUpdate = (data) => {
  return axios({
    url: `${baseUrl}/pet/adopt-update`,
    method: 'post',
    data
  })
}

export const adoptDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/pet/adopt-delete`,
    method: 'delete',
    data
  })
}

// --------------------breed--------------------
export const breedSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/pet/breed-search/${page}/${size}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const getBreedById = (id) => {
  return axios({
    url: `${baseUrl}/pet/breed-getbyid?id=${id}`,
    method: 'get'
  })
}

export const breedUpdate = (data) => {
  return axios({
    url: `${baseUrl}/pet/breed-update`,
    method: 'post',
    data
  })
}

export const breedIsExist = (breed_name) => {
  return axios({
    url: `${baseUrl}/pet/breed-exist`,
    method: 'post',
    data: {breed_name: breed_name}
  })
}

export const breedDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/pet/breed-delete`,
    method: 'delete',
    data
  })
}

// -------------------领养文章评论管理---------------------
export const commentSearch = (page, size, searchMap, id) => {
  return axios({
    url: `${baseUrl}/pet/comment-search/${page}/${size}/${id}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const getCommentById = (id) => {
  return axios({
    url: `${baseUrl}/pet/comment-getbyid?id=${id}`,
    method: 'get'
  })
}

export const commentUpdate = (data) => {
  return axios({
    url: `${baseUrl}/pet/comment-update`,
    method: 'post',
    data
  })
}

export const commentDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/pet/comment-delete`,
    method: 'delete',
    data
  })
}

// ----------------领养文章喜欢管理-------------------
export const likeSearch = (page, size, searchMap, id) => {
  return axios({
    url: `${baseUrl}/pet/like-search/${page}/${size}/${id}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const likeDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/pet/like-delete`,
    method: 'delete',
    data
  })
}