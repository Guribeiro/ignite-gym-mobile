import { useState } from "react";
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

const profileSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password_old: z.string().min(8),
  password: z.string().min(8),
  password_confirm: z.string().min(8)
}).refine(({password, password_confirm}) => {
  return password === password_confirm
}, {
  message: "Don't match",
  path: ['password_confirm'],
})

type ProfileFormData = z.infer<typeof profileSchema>

export const Profile = () => {
  const [userAvatar, setUserAvatar] = useState<string>()
  const toast = useToast()

  const {control, handleSubmit} = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  })

  const onSubmit = ({name, email, password, password_confirm}:ProfileFormData) => {
    console.log({name, email, password, password_confirm})
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
  
      setUserAvatar(uri)
    } catch (error) {
      console.log(error)
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
                  source={userAvatar ? {uri: userAvatar} : DefaultAvatarPng}
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
                  name='password_old'
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
            <Button mt='$12' title="Atualizar" onPress={handleSubmit(onSubmit)}/>
          </VStack>
        </ScrollView>
      </VStack>
  )
}