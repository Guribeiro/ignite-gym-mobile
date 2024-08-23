import { Center, Heading, Image, Text, VStack, ScrollView } from "@gluestack-ui/themed"
import backgroundImage from '@assets/background.png'
import Logo from '@assets/logo.svg'

import { Input } from "@components/input"
import { Button } from "@components/button"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootAuthenticationRoutesParamsList } from "@routes/authentication.routes"
import { useNavigation } from "@react-navigation/native"

type SignupScreenProps = NativeStackNavigationProp<
  RootAuthenticationRoutesParamsList,
  'Signup'
>;


export const Signup = () => {
  const {goBack} = useNavigation<SignupScreenProps>()
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg='$gray700'>
        <Image
          w='$full'
          h={624}
          defaultSource={backgroundImage} 
          source={backgroundImage} 
          alt="Pessoas treinando"
          position="absolute"
        />
        <VStack flex={1} px='$10' pb='$16'>
          <Center my='$24'>
            <Logo />
            <Text color='$gray100' fontSize='$sm'>Treine sua mente e seu corpo</Text>
          </Center>
          <Center gap='$2'>
            <Heading color="$gray100">Crie a sua conta</Heading>
            <Input placeholder="Nome" autoCapitalize="words" />
            <Input placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
            <Input placeholder="Senha" secureTextEntry />
            <Input placeholder="Confirme a Senha" secureTextEntry />
            <Button title='Acessar' mt='$4' />
          </Center>
          <Center gap='$2' flex={1} justifyContent="flex-end" mt='$4'>
            <Button title='Voltar para o login' variation="outlined" onPress={goBack} />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>

  )
}