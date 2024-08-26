import { VStack, HStack, Heading, Image } from "@gluestack-ui/themed"
import {ArrowLeft} from 'phosphor-react-native'
import { ScrollView, TouchableOpacity } from "react-native"
import {config} from '@config/gluestack-ui.config'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'

import { Text } from "@gluestack-ui/themed"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { useNavigation } from "@react-navigation/native"
import { Button } from "@components/button"

export const Exercise = () => {
  const {colors} = config.tokens
  const {goBack} = useNavigation<AppNavigatorRoutesProps>()

  return (
    <VStack>
      <VStack pt='$16' px='$4' pb='$8' bgColor="$gray600">
        <HStack>
          <TouchableOpacity onPress={goBack}>
            <ArrowLeft color={colors.green500}/>
          </TouchableOpacity>
        </HStack>
        <HStack mt='$4' justifyContent="space-between" alignItems="center">
          <Heading color='$gray200'>Puxada fronta</Heading>
          <HStack gap='$2'>
            <BodySvg />
            <Text color="$gray200">Costas</Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack mt={'$4'} px='$4' gap={'$4'}>
          <Image 
            source={{uri: `https://global.cdn.magazord.com.br/epulari/img/2021/12/blog/6445/blog-puxada-frontal.jpg`}} 
            alt='Exercisio'
            rounded='$md'
            h='$80'
            w='$full'
            resizeMode="cover"
          />
          <VStack bgColor="$gray600" gap='$4' p={'$4'} rounded='$md'>
            <HStack alignItems="center" justifyContent="space-evenly">
              <HStack gap={'$2'}>
                <SeriesSvg />
                <Text color='$gray200'>3 séries</Text>
              </HStack>
              <HStack gap={'$2'}>
                <RepetitionsSvg />
                <Text color='$gray200'>12 repetições</Text>
              </HStack>
            </HStack>
            <Button title="Marcar como realizado" />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  )
}