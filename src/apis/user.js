import axios from 'axios';
import baseUrl from './config.js'

// 登陆
export const login = (data) => {
  return axios({
    url: `${baseUrl}/user/login`,
    method: 'post',
    data
  })
}

// 检查密码
export const checkPwd = (data) => {
  return axios({
    url: `${baseUrl}/user/pwd`,
    method: 'post',
    data
  })
}

// 更改密码
export const updatePwd = (data) => {
  return axios({
    url: `${baseUrl}/user/pwd`,
    method: 'put',
    data
  })
}

