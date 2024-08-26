import { useState } from "react"
import { 
    Heading, 
    HStack, 
    Text, 
    VStack
  } from "@gluestack-ui/themed"
import { Header } from "@components/header"
import { SectionList } from 'react-native'
import {Empty} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'

type ExerciseSection = {
  title: string, data: string[]
}

export const History = () => {
  const {colors} = config.tokens
  const [histories, setHistories] = useState<ExerciseSection[]>([
    {
      title: `20.04.2022`,
      data: ['Puxada Frontal']
    }
  ])
return (
    <VStack flex={1}>
      <Header title='Histórico de Exercícios' />    

      <SectionList
        style={{marginTop: 16}}
        sections={histories}
        keyExtractor={(item) => String(item)}
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
                <Heading color='$gray100' numberOfLines={1}>Costas</Heading>
                <Text color='$gray200' numberOfLines={1}>Puxada frontal</Text>
              </VStack>
              <Text color='$gray200'>08:56</Text>
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
    </VStack>
  )
}