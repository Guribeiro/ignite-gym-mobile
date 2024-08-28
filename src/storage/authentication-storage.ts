import AsyncStorage from '@react-native-async-storage/async-storage'
import {AUTHENTICATION_STORAGE_KEY} from './config'
import { Authentication } from '@contexts/auth'

const setAuthenticationStorage = async (authentication: Authentication ) => {
  await AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, JSON.stringify(authentication))
}

const getAuthenticationStorage = async () => {
  const storaged = await AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY)

  const authentication: Authentication =  storaged ? JSON.parse(storaged) : {}

  return authentication
}

const removeAuthenticationStorage = async () => {
  await AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY)
}

export {setAuthenticationStorage, getAuthenticationStorage, removeAuthenticationStorage}