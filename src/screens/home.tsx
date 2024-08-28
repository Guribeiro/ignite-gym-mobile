import { useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Center, Text, VStack, HStack, Heading, View, useToast } from "@gluestack-ui/themed"

import { StatusBar } from 'expo-status-bar';
import {SignOut} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'
import { UserAvatar } from "@components/user-avatar";
import { Group } from "@components/group";
import { Exercise, ExerciseDTO } from "@components/exercise";

import userPhotoDefault from '@assets/userPhotoDefault.png'

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useAuthentication } from "@contexts/auth";
import { api } from "../api";
import { AppError } from "../errors/app-error";
import { ToastMessage } from "@components/toast-message";
import { Loading } from "@components/loading";

export const Home = () => {
  const {colors} = config.tokens
  const [groups, setGroups] = useState(['Costas', 'Ombros', 'Biceps', 'Tricipes'])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState<String | undefined>()

  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const {authentication, signout} = useAuthentication()

  const {navigate} = useNavigation<AppNavigatorRoutesProps>()

  useEffect(function fetchGroups(){
    (async () => {
      try {
        const {data} = await api.get<string[]>('/groups')
        setGroups(data)
        setGroupSelected(data[0])
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
    })()
  },[])

  const fetchExercisesByGroup = useCallback( async () => {
    try {
      setLoading(true)
      const {data} = await api.get<ExerciseDTO[]>(`/exercises/bygroup/${groupSelected}`)

      setExercises(data)
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
     }finally{
      setLoading(false)
     }
  },[groupSelected])

  useEffect(() => {
    fetchExercisesByGroup()
  },[groupSelected])
  
  // useFocusEffect(useCallback(() => {
  //   fetchExercisesByGroup()
  // },[groupSelected]))
  
  const handleSignout = async () => {
    return Alert.alert('Logout!!', 'Deseja mesmo sair ?', [
      {
        text: 'Cancelar',
      },
      {
        text: 'Sair',
        onPress: () => signout()
      }
    ])
  }

  const exercisesCount = useMemo(() => {
    return exercises.length
  },[exercises])


  return (
    <VStack flex={1} bg='$gray700'>
      <StatusBar style="inverted" translucent />
      <HStack px='$4' pt='$16' pb='$5' bg='$gray600' alignItems="center" justifyContent="space-between">
        <HStack gap={4} alignItems="center" >
          <UserAvatar source={authentication.user.avatar ? {uri:  authentication.user.avatar }: userPhotoDefault} alt='user avatar' />
          <VStack>
            <Text color="$white">Olá,</Text>
            <Heading color="$white">{authentication.user.name}</Heading>
          </VStack>
        </HStack>

        <TouchableOpacity onPress={handleSignout}>
          <SignOut color={colors.gray100}/>
        </TouchableOpacity>

      </HStack >
      <Center>
        <FlatList 
          data={groups}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16
          }}
          style={{
            marginVertical: 40,
            maxHeight: 44,
            minHeight: 44
          }}
          renderItem={({item}) => (
            <View mr='$3'>
              <Group title={item} active={item === groupSelected} onPress={() => setGroupSelected(item)} />
            </View>
          )}
        />
      </Center>

      {loading ? <Loading /> : (
          <FlatList 
          contentContainerStyle={{
            paddingHorizontal: 16
          }}
          ListHeaderComponent={() => (
            <View mb='$4'>
               <HStack justifyContent="space-between" alignItems="center">
                <Heading color='$gray100'>Exercícios</Heading>
                <Text>{exercisesCount}</Text>
              </HStack>
            </View>
          )}
          data={exercises}
          renderItem={({item}) => (
            <TouchableOpacity style={{marginBottom: 8}} onPress={() => navigate('Exercise', {exercise_id: item.id})}>
              <Exercise exercise={item}/>
            </TouchableOpacity>
          )}
        />
      )}
    
    </VStack>
  )
}