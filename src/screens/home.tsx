import { Center, Text, VStack, HStack, Avatar, AvatarImage, Box, Heading } from "@gluestack-ui/themed"
import { StatusBar } from 'expo-status-bar';
import {SignOut} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'
import { UserAvatar } from "@components/user-avatar";

import userPhotoDefault from '@assets/userPhotoDefault.png'
import { TouchableOpacity } from "react-native";

export const Home = () => {
  const {colors} = config.tokens
  return (
    <VStack flex={1} bg='$gray700'>
      <HStack px='$8' pt='$16' pb='$5' bg='$gray600' alignItems="center" justifyContent="space-between">
        <HStack gap={4} alignItems="center" >
          <UserAvatar source={userPhotoDefault} alt='user avatar' />
          <VStack>
            <Text color="$white">Olá,</Text>
            <Heading color="$white">Gustavo Henrique</Heading>
          </VStack>
        </HStack>

        <TouchableOpacity>
          <SignOut color={colors.gray100}/>
        </TouchableOpacity>

      </HStack>
    <Center>
      <StatusBar style="inverted" translucent />
      <Text>Home screen</Text>
    </Center>
    </VStack>
  )
}