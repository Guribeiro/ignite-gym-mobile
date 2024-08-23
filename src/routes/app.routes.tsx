import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { gluestackUIConfig } from '@config/gluestack-ui.config'
import { Platform } from 'react-native';

import HomeSvg from '@assets/home.svg'
import ProfileSvg from '@assets/profile.svg'

import { Home } from '@screens/home';
import { Profile } from '@screens/profile';

export type RootAppParamsList = {
  Home: undefined
  Profile: undefined
}

const {Navigator, Screen} = createBottomTabNavigator<RootAppParamsList>()

export const AppRoutes = () => {
  const {colors, space} = gluestackUIConfig.tokens
  const iconSize = space['6']
  
  return (
    <Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 55: 96,
        },
        tabBarActiveTintColor: colors.green700,
        tabBarInactiveTintColor: colors.gray100
      }}
    >
      <Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color}) => <HomeSvg fill={color} width={iconSize} height={iconSize} />
        }}
      />
      <Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color}) => <ProfileSvg fill={color} width={iconSize} height={iconSize} />
        }}
      />
    </Navigator>
  )
}