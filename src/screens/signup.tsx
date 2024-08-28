import { Center, Heading, Image, Text, VStack, ScrollView, useToast } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { AuthenticationNavigatorProps } from "@routes/authentication.routes"

import { Input } from "@components/input"
import { Button } from "@components/button"

import backgroundImage from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { useAuthentication } from "@contexts/auth"
import { AppError } from "../errors/app-error"
import { ToastMessage } from "@components/toast-message"

const signupSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirm: z.string().min(8)
}).refine(({password, password_confirm}) => {
  return password === password_confirm
}, {
  message: "Don't match",
  path: ['password_confirm'],
})

type SignupFormData = z.infer<typeof signupSchema>

export const Signup = () => {
  const {goBack, navigate} = useNavigation<AuthenticationNavigatorProps>()
  const {signup, loading} = useAuthentication()
  const toast = useToast()
  
  const {control, handleSubmit, reset} = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async ({name, email, password}:SignupFormData) => {
    try {
      await signup({
        name, 
        email, 
        password
      })

      toast.show({
        placement: 'top',
        render: ({id}) => (
          <ToastMessage 
            id={`toast-${id}`} 
            title={'Conta criada com sucesso'}
            description="voce ja pode realizar seu logon" 
            action={'success'}
            onClose={() => toast.close(id)}
          />
        )
      })

      reset()

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Nao foi possivel concluir a requisicao. Tente novamente mais tarde'

      toast.show({
        placement: 'top',
        render: ({id}) => (
          <ToastMessage 
            id={`toast-${id}`} 
            title={title} 
            action={'error'}
            onClose={() => toast.close(id)}
          />
        )
      })
    }
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
            <Heading color="$gray100">Crie a sua conta</Heading>
            <Controller 
              control={control}
              name='name'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <Input 
                  placeholder="Nome" 
                  autoCapitalize="words" 
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />
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
           <Controller 
              control={control}
              name='password_confirm'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <Input 
                  placeholder="Confirmar senha" 
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />
            <Button title='Acessar' mt='$4' onPress={handleSubmit(onSubmit)} disabled={loading} loading={loading}/>
          </Center>
          <Center gap='$2' flex={1} justifyContent="flex-end" mt='$4'>
            <Button title='Voltar para o login' variation="outlined" onPress={goBack} />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>

  )
}