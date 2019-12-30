import axios from 'axios';
import baseUrl from './config.js'

export const carouselSearch = (page, size, searchMap) => {
  return axios({
    url: `${baseUrl}/carousel/carousel-search/${page}/${size}`,
    method: 'post',
    data: {...searchMap}
  })
}

export const getCarouselById = (id) => {
  return axios({
    url: `${baseUrl}/carousel/carousel-getbyid?id=${id}`,
    method: 'get'
  })
}

export const carouselUpdate = (data) => {
  return axios({
    url: `${baseUrl}/carousel/carousel-update`,
    method: 'post',
    data
  })
}

export const carouselIsExist = (carousel_name) => {
  return axios({
    url: `${baseUrl}/carousel/carousel-exist`,
    method: 'post',
    data: {carousel_name: carousel_name}
  })
}

export const carouselDeleteById = (data) => {
  return axios({
    url: `${baseUrl}/carousel/carousel-delete`,
    method: 'delete',
    data
  })
}