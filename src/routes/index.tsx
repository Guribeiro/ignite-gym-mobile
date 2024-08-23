import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SplashRoutes } from './splash.routes';
import {gluestackUIConfig} from '@config/gluestack-ui.config'

export const Routes = () => {
  const theme = DefaultTheme

  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  return (
    <NavigationContainer theme={theme}>
      <SplashRoutes />
    </NavigationContainer>
  )
}