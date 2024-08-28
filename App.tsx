import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { loadAsync } from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider} from '@gluestack-ui/themed'
import { config } from '@config/gluestack-ui.config'
import { Routes } from '@routes/index';

import { AuthProvider } from '@contexts/auth';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await loadAsync({
          Roboto_400Regular, 
          Roboto_700Bold
        });

        await new Promise(resolve => setTimeout(resolve, 4000));

      } catch (e) {
        console.log(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <GluestackUIProvider config={config}>
        <StatusBar style="auto" translucent />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
