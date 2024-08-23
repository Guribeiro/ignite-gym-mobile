import { Center, Text } from "@gluestack-ui/themed"
import Logo from '@assets/logo.svg'
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootSplashParamsList } from "@routes/splash.routes";
import { useCallback, useEffect } from "react";

type SplashScreenProps = NativeStackNavigationProp<
  RootSplashParamsList,
  'Splash'
>;

export const Splash = () => {

  const { navigate } = useNavigation<SplashScreenProps>();

  const startApp = useCallback(() => {
    navigate('App');
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    let timeout = setTimeout(() => {
      if (mounted) {
        startApp();
      }
    },1000)

    return () => {
      mounted = false;
      clearTimeout(timeout)
    };
  }, [startApp]);

  return (
    <Center flex={1} bg='$gray700' justifyContent="center">
      <Logo />
    </Center>
  )
}