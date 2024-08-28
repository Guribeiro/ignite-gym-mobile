import { useCallback, useEffect, useMemo, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import {ArrowLeft} from 'phosphor-react-native'
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { VStack, HStack, Heading, Image, useToast, Text, Center, Box } from "@gluestack-ui/themed"

import { AppNavigatorRoutesProps, RootAppParamsList } from "@routes/app.routes"
import { api } from "../api"

import { AppError } from "../errors/app-error"

import { ToastMessage } from "@components/toast-message"
import { ExerciseDTO } from "@components/exercise"
import { Button } from "@components/button"
import { Loading } from "@components/loading"

import {config} from '@config/gluestack-ui.config'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'

export const Exercise = () => {
  const {colors} = config.tokens
  const {goBack, navigate} = useNavigation<AppNavigatorRoutesProps>()
  const [exercise, setExercise] = useState<ExerciseDTO>()
  const [loading, setLoading] = useState(false)
  const [registerHistoryLoading, setRegisterHistoryLoading] = useState(false)
  const toast = useToast()

  const {params} = useRoute<RouteProp<RootAppParamsList, 'Exercise'>>()

  const {exercise_id} = params

  const registerHistory = useCallback(async () => {
      try {
        setRegisterHistoryLoading(true)
        await api.post('/history', {exercise_id})

        toast.show({
          placement: 'top',
          render: ({id}) => (
            <ToastMessage 
              id={`toast-${id}`} 
              title={'Sucesso!'} 
              description="Exericio adicionado ao seu historico"
              action={'success'}
              onClose={() => toast.close(id)}
            />
          )
        })

        navigate('History')
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
        setRegisterHistoryLoading(false)
      }
  },[exercise_id])

  useEffect(function fetchExercise() {
    (
      async () => {
       try {
        setLoading(true)
        const {data} = await api.get<ExerciseDTO>(`/exercises/${exercise_id}`)
        setExercise(data)
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
    )()
  },[exercise_id])

  return (
    <VStack>
      <VStack pt='$16' px='$4' pb='$8' bgColor="$gray600">
        <HStack>
          <TouchableOpacity onPress={goBack}>
            <ArrowLeft color={colors.green500}/>
          </TouchableOpacity>
        </HStack>
        <HStack mt='$4' justifyContent="space-between" alignItems="center">
          <Heading color='$gray200'>{exercise?.name}</Heading>
          <HStack gap='$2'>
            <BodySvg />
            <Text color="$gray200">{exercise?.group}</Text>
          </HStack>
        </HStack>
      </VStack>
      {loading ? (
        <Loading />
      ): (
        <>
        {!exercise ? (
        <Center flex={1}>
          <Heading color='$gray100'>Exercisio nao encontrado</Heading>
        </Center>
        ): (
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack mt={'$4'} px='$4' gap={'$4'}>
                <Box
                  rounded='$md'
                  overflow="hidden"
                  >
                  <Image 
                    source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}} 
                    alt='Exercisio'
                    rounded='$md'
                    h='$80'
                    w='$full'
                    resizeMode="cover"
                    />
                </Box>
                <VStack bgColor="$gray600" gap='$4' p={'$4'} rounded='$md'>
                  <HStack alignItems="center" justifyContent="space-evenly">
                    <HStack gap={'$2'}>
                      <SeriesSvg />
                      <Text color='$gray200'>{exercise.series} series</Text>
                    </HStack>
                    <HStack gap={'$2'}>
                      <RepetitionsSvg />
                      <Text color='$gray200'>{exercise.repetitions} repetições</Text>
                    </HStack>
                  </HStack>
                  <Button title="Marcar como realizado" onPress={registerHistory} disabled={registerHistoryLoading} loading={registerHistoryLoading} />
                </VStack>
              </VStack>
            </ScrollView>
          )}
        </>
      )}
     
    </VStack>
  )
}