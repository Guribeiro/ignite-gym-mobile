import { Center, Heading, Image, Text, VStack, ScrollView } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"

import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { AuthenticationNavigatorProps} from "@routes/authentication.routes"

import { Input } from "@components/input"
import { Button } from "@components/button"

import backgroundImage from '@assets/background.png'
import Logo from '@assets/logo.svg'

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type SigninFormData = z.infer<typeof signinSchema>

export const Signin = () => {
  const {navigate} = useNavigation<AuthenticationNavigatorProps>()

  const {control, handleSubmit} = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema)
  })

  const onSubmit = ({email, password}:SigninFormData) => {
    console.log({email, password})
  }

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
        <VStack flex={1} px='$4' pb='$16'>
          <Center my='$24'>
            <Logo />
            <Text color='$gray100' fontSize='$sm'>Treine sua mente e seu corpo</Text>
          </Center>
          <Center gap='$2'>
            <Heading color="$gray100">Acesse sua conta</Heading>
            <Controller 
              control={control}
              name='email'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <Input 
                  placeholder="Email" 
                  keyboardType="email-address" 
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />
            <Controller 
              control={control}
              name='password'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <Input 
                  placeholder="Senha" 
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />
            <Button title='Acessar' onPress={handleSubmit(onSubmit)} />
          </Center>
          <Center gap='$2' flex={1} justifyContent="flex-end" mt='$4'>
            <Text color='$gray100' fontSize='$sm'>Ainda não tem acesso?</Text>
            <Button title='Criar conta' variation="outlined" onPress={() => navigate('Signup')} />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>

  )
}