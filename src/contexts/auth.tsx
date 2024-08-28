import {createContext, useContext, ReactNode, useState, useEffect} from 'react'
import { api } from '../api'
import {getAuthenticationStorage, setAuthenticationStorage, removeAuthenticationStorage} from '@storage/authentication-storage'

export type Authentication = {
  user: User
  token: string
  refresh_token: string
}

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type SignupDTO = {
  name: string
  email: string
  password: string
}

type SigninDTO = {
  email: string
  password: string
}

type SigninResponseDTO = {
  user: User
  token: string
  refresh_token: string
}

type AuthContextData = {
  authentication: Authentication
  loading: boolean
  signup: (data: SignupDTO) => Promise<void>
  signin: (data: SigninDTO) => Promise<void>
  signout: () => Promise<void>
  updateUserProfile: (user: User)=> Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}



const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({children}:AuthProviderProps ) => {
  const [authentication, setAuthentication] = useState<Authentication>({} as Authentication)
  const [loading, setLoading] = useState(false)
  const [storageLoading, setStorageLoading] = useState(false)

  const signup = async ({name, email, password}: SignupDTO) => {
    try {
      setLoading(true)
        await api.post('/users', {
          name,
          email, 
          password
        })
    } catch (error) {
      throw error
    }finally{
      setLoading(false)
    }
  } 

  const signin = async ({email, password}: SigninDTO) => {
    try {
      setLoading(true)
      const { data } = await api.post<SigninResponseDTO>('/sessions', {
        email,
        password
      })

      const {user, token, refresh_token} = data

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAuthentication({
        user, 
        token, 
        refresh_token
      })

      await setAuthenticationStorage({
        user, 
        token, 
        refresh_token
      })
    } catch (error) {
      throw error
    }finally{
      setLoading(false)
    }
  }

  const signout = async () => {
    try {
      await removeAuthenticationStorage()
      setAuthentication({} as Authentication)
      delete api.defaults.headers.common.Authorization 

    } catch (error) {
        throw error
    }
  }

  const updateUserProfile = async (user: User) => {
    try {
      setAuthentication({...authentication, user})
      await setAuthenticationStorage(authentication)
    } catch (error) {
      throw error
    }
  }

  const fetchStoragedAuthentication = async () => {
    try {
      setStorageLoading(true)
      const storagedAuthentication = await getAuthenticationStorage()

      if(storagedAuthentication) {
        setAuthentication(storagedAuthentication)

        api.defaults.headers.common['Authorization'] = `Bearer ${storagedAuthentication.token}`;

      }
    } catch (error) {
      throw error
    }finally{
      setStorageLoading(false)
    }
  }
   
  useEffect(() => {
    fetchStoragedAuthentication()
  },[])

  return (
    <AuthContext.Provider value={{
      authentication,
      loading,
      signin,
      signup,
      signout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuthentication() {
  const context = useContext(AuthContext)

  if(!context) {
    throw new Error('useAuthentication should be used within an AuthProvider')
  }

  return context
}

export {useAuthentication, AuthProvider}