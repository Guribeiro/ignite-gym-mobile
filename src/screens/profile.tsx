import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { 
  Center, 
  Heading, 
  ScrollView, 
  Text, 
  VStack, 
  useToast
} from "@gluestack-ui/themed"
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

import { Input } from "@components/input";
import { Header } from "@components/header";
import { Button } from "@components/button";
import { UserAvatar } from "@components/user-avatar";
import { ToastMessage } from "@components/toast-message";

import DefaultAvatarPng from '@assets/userPhotoDefault.png'
import { useAuthentication } from "@contexts/auth";
import { api } from "../api";
import { AppError } from "../errors/app-error";

const profileSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  old_password: z.string().optional(),
  password: z.string().optional(),
  password_confirm: z.string().optional()
})
.refine(({password, password_confirm}) => {
  if(password !== password_confirm){
    return password === password_confirm
  }
  return true
}, {
  message: "Don't match",
  path: ['password_confirm'],
})

type ProfileFormData = z.infer<typeof profileSchema>

export const Profile = () => {
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const {authentication, updateUserProfile} = useAuthentication()

  const { user } = authentication

  const {control, handleSubmit} = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: zodResolver(profileSchema)
  })

  const onSubmit = async ({name, password, old_password}:ProfileFormData) => {
    try {
      setLoading(true)
      user.name = name
      await api.put('/users', {
        name,
        password,
        old_password
      })

      toast.show({
        placement: 'top',
        render: ({id}) => (
          <ToastMessage 
            id={`toast-${id}`} 
            title={'Sucesso!!'}
            description="Seu perfil foi atualizado com sucesso" 
            action={'success'}
            onClose={() => toast.close(id)}
          />
        )
      })

      await updateUserProfile(user)
      
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
    }finally {
      setLoading(false)
    }  
  }

  const userPhotoSelect = async () => {
    try {
      const {canceled, assets} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
        allowsEditing: true
      })
  
      if(canceled) return
  
      const [photo] = assets
  
      const { uri } = photo
  
      const { size } = (await FileSystem.getInfoAsync(uri) as { size: number })
  
      if(size && (size / 1024 / 1024) > 5) {
        return toast.show({
          placement: 'top',
          render: ({id}) => (
            <ToastMessage 
              id={`toast-${id}`} 
              title="Imagem muito grande" 
              description="Selecione uma imagem de ate 5mb"
              action="error"
              onClose={() => toast.close(id)}
            />
          )
        })
      }
  
      const imageExtension = uri.split('.').pop()

      const photoFile = {
        name: `${user.name.split(' ').join('_')}.${imageExtension}`.toLocaleLowerCase(),
        type: `${photo.type}/${imageExtension}`,
        uri,
      } as any
      
      const form = new FormData()

      form.append('avatar', photoFile)

      const {data: userAvatarUpdated} = await api.patch('/users/avatar', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const userUpdated = user

      userUpdated.avatar = userAvatarUpdated.avatar

      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({id}) => (
          <ToastMessage 
            id={`toast-${id}`} 
            title="Sucesso" 
            description="Avatar atualizado com sucesso"
            action="success"
            onClose={() => toast.close(id)}
          />
        )
      })

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
      <VStack flex={1}>
        <Header title='Perfil' />
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
          <Center mt='$8'>
            <TouchableOpacity onPress={userPhotoSelect}>
              <Center gap='$2'>
                <UserAvatar
                  w='$32'
                  h='$32'
                  source={user.avatar ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : DefaultAvatarPng}
                  alt='user photo profile'
                />  
                <Text color='$green500' fontFamily="$heading">Alterar foto</Text>
              </Center>
            </TouchableOpacity>
          </Center>
          <VStack flex={1} px='$4' pb='$4'>
            <VStack gap='$8' mt='$12'>
              <VStack gap='$4'>
                <Controller 
                  control={control}
                  name='name'
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <Input 
                      placeholder="Nome" 
                      bg='$gray600'
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
                      bg='$gray600'
                      autoCapitalize="none"
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </VStack>
              <VStack gap='$4'>
                <Heading color='$gray100'>Alterar senha</Heading>
                <Controller 
                  control={control}
                  name='old_password'
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <Input 
                      placeholder="Senha antiga" 
                      secureTextEntry
                      bg='$gray600'
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
                      placeholder="Nova senha" 
                      bg='$gray600' 
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
                      bg='$gray600' 
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </VStack>
            </VStack>
            <Button mt='$12' title="Atualizar" onPress={handleSubmit(onSubmit)} loading={loading} disabled={loading}/>
          </VStack>
        </ScrollView>
      </VStack>
  )
}