import axios, { AxiosError } from 'axios'
import { AppError } from '../errors/app-error'

export const baseURL = 'http://172.20.0.1:3333'

const api = axios.create({
  baseURL,
  timeout: 5000
})

api.interceptors.response.use((response) => response, (error)=> {
  if(error.response && error.response.data){
    console.log(error.response.data)
    return Promise.reject(new AppError(error.response.data.message))
  }
  return Promise.reject(error)
})

export {api}