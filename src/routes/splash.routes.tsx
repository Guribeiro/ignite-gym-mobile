import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Splash } from '@screens/splash';

import { AppRoutes } from '@routes/app.routes';
import { AuthenticationRoutes } from './authentication.routes';
import { useAuthentication } from '@contexts/auth';


export type RootSplashParamsList = {
  Splash: undefined
  App: undefined
}

const { Navigator, Screen } = createNativeStackNavigator<RootSplashParamsList>()

export const SplashRoutes = () =>{
  const {authentication} = useAuthentication()
  return (
    <Navigator
      initialRouteName='Splash'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen 
        name='Splash'
        component={Splash}
      />
      
      <Screen 
        name='App'
        component={!authentication.token ? AuthenticationRoutes  : AppRoutes }
      />
    </Navigator>
  )
}