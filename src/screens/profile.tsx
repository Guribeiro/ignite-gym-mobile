import { Center, Text } from "@gluestack-ui/themed"
import { StatusBar } from 'expo-status-bar';

export const Profile = () => {
  return (
    <Center>
      <StatusBar style="inverted" translucent />
      <Text>Profile screen</Text>
    </Center>
  )
}