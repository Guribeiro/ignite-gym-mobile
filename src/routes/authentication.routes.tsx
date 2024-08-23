import { View } from '@gluestack-ui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Signin } from '@screens/signin';
import { Signup } from '@screens/signup';

export type RootAuthenticationRoutesParamsList = {
  Signin: undefined
  Signup: undefined
}

const { Navigator, Screen } = createNativeStackNavigator<RootAuthenticationRoutesParamsList>()

export const AuthenticationRoutes = () =>{
  return (
   <View flex={1} bg='$gray700'>
    <Navigator
      initialRouteName='Signin'
      screenOptions={{
        headerShown: false,
      }}
    > 
      <Screen 
        name='Signin'
        component={Signin}
      />
        <Screen 
        name='Signup'
        component={Signup}
      />
    </Navigator>
   </View>
  )
}