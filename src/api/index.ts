import axios, { AxiosInstance, AxiosError } from 'axios'
import { AppError } from '../errors/app-error'
import { getAuthenticationStorage, setAuthenticationStorage } from '@storage/authentication-storage'

export const baseURL = 'http://172.20.0.1:3333'

type Signout = () => void

type RefreshTokenAxiosResponse = {
  refresh_token: string
  token: string
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signout: Signout) => () => void
}

type PromiseTYpe = {
  onSuccess: (token: string) => void
  onFailure: (error:AxiosError) => void
}

let failedQueue: PromiseTYpe[] = [];
let isRefreshing = false

const api = axios.create({
  baseURL,
  timeout: 5000
}) as APIInstanceProps

api.registerInterceptTokenManager = (signout) => {
  const interceptTokenManager = api.interceptors.response.use((response) => response, async (requestError)=> {
    if(requestError?.response?.status === 401){
      if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid'){
        const { refresh_token, ...authentication } = await getAuthenticationStorage()

        if(!refresh_token) {
          signout()
          return Promise.reject(requestError)
        }

        const origialRequestConfig = requestError.config

        if(isRefreshing){
          return new Promise((resolve, reject ) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                origialRequestConfig.headers = {'Authorization': `Bearer ${token}`}
                resolve(api(origialRequestConfig))
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              }
            })
          })
        }

        isRefreshing = true

        return new Promise(async (resolve, reject) => {
          try {
            const {data} = await api.post<RefreshTokenAxiosResponse>('/sessions/refresh-token', { refresh_token })

            await setAuthenticationStorage({...authentication, refresh_token: data.refresh_token, token: data.token}) 

            if(origialRequestConfig.data){
              origialRequestConfig.data = JSON.parse(origialRequestConfig.data)
            }

            origialRequestConfig.headers = {'Authorization': `Bearer ${data.token}`}
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

            failedQueue.forEach(request => {
              request.onSuccess(data.token)
            })

            resolve(api(origialRequestConfig))

          } catch (error: any) {
            failedQueue.forEach(request => {
              request.onFailure(error)
            })
            signout()
            reject(error)
          }finally {
            isRefreshing = false
            failedQueue = []
          }
        })
      }
      signout()
    }

    if(requestError.response && requestError.response.data){
      return Promise.reject(new AppError(requestError.response.data.message))
    }else {
      return Promise.reject(requestError)
    }
  })

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export {api}