import { useState } from "react";
import { Center, Heading, ScrollView, Text, VStack, useToast } from "@gluestack-ui/themed"
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Header } from "@components/header";
import { UserAvatar } from "@components/user-avatar";
import { Alert, TouchableOpacity } from "react-native";
import { Input } from "@components/input";
import { Button } from "@components/button";
import DefaultAvatarPng from '@assets/userPhotoDefault.png'
import { ToastMessage } from "@components/toast-message";

export const Profile = () => {
  const [userAvatar, setUserAvatar] = useState<string>()
  const toast = useToast()

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
                <Input placeholder="Nome" bg='$gray600'/>
                <Input placeholder="Email" bg='$gray600' />
              </VStack>
              <VStack gap='$4'>
                <Heading color='$gray100'>Alterar senha</Heading>
                <Input placeholder="Senha antiga" bg='$gray600' secureTextEntry/>
                <Input placeholder="Nova senha" bg='$gray600' secureTextEntry />
                <Input placeholder="Confirmar nova senha" bg='$gray600' secureTextEntry />
              </VStack>
            </VStack>
            <Button mt='$12' title="Atualizar"/>
          </VStack>
        </ScrollView>
      </VStack>
  )
}