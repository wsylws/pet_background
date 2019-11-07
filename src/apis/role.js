import axios from 'axios';
import baseUrl from './config.js'

// ----------------角色管理------------------
// ----------------用户管理------------------
export const userSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/role/user-search/${page}/${size}`,
    method: 'post',
    data: {username: searchMap.username}
  })
}

// 重置密码
export const resetPassword = (data) => {
  return axios({
    url: `${baseUrl}/role/reset-password`,
    method: 'post',
    data
  })
}

// 删除用户
export const deleteByName = (data) => {
  return axios({
    url: `${baseUrl}/role/user-delete`,
    method: 'delete',
    data
  })
}

// -----------管理员管理------------------
export const adminSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/role/admin-search/${page}/${size}`,
    method: 'post',
    data: {username: searchMap.username}
  })
}

export const getAdminById = (id) => {
  return axios({
    url: `${baseUrl}/role/admin-getbyid?id=${id}`,
    method: 'get'
  })
}

export const adminIsExist = (username) => {
  return axios({
    url: `${baseUrl}/role/admin-exist`,
    method: 'post',
    data: {username: username}
  })
}

export const adminUpdate = (data) => {
  return axios({
    url: `${baseUrl}/role/admin-update`,
    method: 'post',
    data
  })
}

// 删除管理员
export const adminDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/role/admin-delete`,
    method: 'delete',
    data
  })
}
