import { useCallback, useEffect, useState } from "react"
import { 
    Heading, 
    HStack, 
    Text, 
    useToast, 
    VStack
  } from "@gluestack-ui/themed"
import { Header } from "@components/header"
import { SectionList } from 'react-native'
import {Empty} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'
import { AppError } from "../errors/app-error"
import { ToastMessage } from "@components/toast-message"
import { api } from "../api"
import { ExerciseDTO } from "@components/exercise"
import { Loading } from "@components/loading"
import { useFocusEffect } from "@react-navigation/native"

type HistoryDTO = ExerciseDTO & {
  hour: string
}

type ExerciseSection = {
  title: string, data: HistoryDTO[]
}

export const History = () => {
  const {colors} = config.tokens
  const [loading, setLoading] = useState(false)
  const [histories, setHistories] = useState<ExerciseSection[]>([])
  const toast = useToast()

  async function fetchUserHistory() {
    try {
      setLoading(true)
      const { data } = await api.get('/history')
      setHistories(data)
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

  useFocusEffect(useCallback(() => {
    fetchUserHistory()
  },[]))

return (
    <VStack flex={1}>
      <Header title='Histórico de Exercícios' />    
      {loading ? (
        <Loading />
      ): (
          <SectionList
          style={{marginTop: 16}}
          sections={histories}
          keyExtractor={(item) => String(item.id)}
          renderSectionHeader={({section}) => (
            <Heading 
              px='$4' 
              color='$gray200'
              numberOfLines={1}
            >
              {section.title}
            </Heading>
          )}
          renderItem={({item}) => (
            <VStack p='$4'>
              <HStack 
                bgColor="$gray600" 
                p='$5' 
                justifyContent="space-between" 
                alignItems="center"
                rounded='$md'
              >
                <VStack>
                  <Heading color='$gray100' numberOfLines={1}>{item.group}</Heading>
                  <Text color='$gray200' numberOfLines={1}>{item.name}</Text>
                </VStack>
                <Text color='$gray200'>{item.hour}</Text>
              </HStack>
            </VStack>
          )}
          contentContainerStyle={
            histories.length < 1 && {flex: 1, justifyContent: 'center', alignItems: 'center' }
          }
          ListEmptyComponent={() => (
            <VStack alignItems="center">
              <Heading color='$gray200' textAlign="center">Nada por aqui</Heading>
              <Text>Nao ha exercicios registrados</Text>
              <Empty size={64} color={colors.gray100} />
            </VStack>
          )}
        />
      )}
    </VStack>
  )
}