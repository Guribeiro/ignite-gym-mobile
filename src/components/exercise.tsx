import { Heading, HStack, Image, VStack, Text } from "@gluestack-ui/themed"
import {CaretRight} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'
import { api, baseURL } from "../api"

export type ExerciseDTO = {
  id: number
  name: string
  series: number
  repetitions: string
  thumb: string
  demo: string
  group: string
  created_at: string
  updated_at: string
}


interface ExerciseProps {
  exercise: ExerciseDTO
}

export const Exercise = ({exercise}: ExerciseProps) => {
  const {colors} = config.tokens
  return  (
    <HStack 
      alignItems="center" 
      justifyContent="space-between"
      backgroundColor="$gray600"  
      p='$4'
      rounded='$md'
    >
      <HStack gap='$4' alignItems="center">
        <Image 
          source={{uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`}} 
          alt='Remada frontal'
          rounded='$md'
          h='$16'
          w='$16'
          resizeMode="cover"
        />
        <VStack>
          <Heading color='$gray100'>{exercise.name}</Heading>
          <Text numberOfLines={2}>{exercise.series} x {exercise.repetitions}</Text>
        </VStack>
      </HStack>
      <CaretRight color={colors.gray100} />
    </HStack>
  )
}