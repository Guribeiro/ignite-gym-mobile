import { Heading, HStack, Image, VStack, Text } from "@gluestack-ui/themed"
import {CaretRight} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'

export const Exercise = () => {
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
          source={{uri: `https://global.cdn.magazord.com.br/epulari/img/2021/12/blog/6445/blog-puxada-frontal.jpg`}} 
          alt='Remada frontal'
          rounded='$md'
          h='$16'
          w='$16'
          resizeMode="cover"
        />
        <VStack>
          <Heading color='$gray100'>Puxada frontal</Heading>
          <Text numberOfLines={2}>3 séries x 12 repetições</Text>
        </VStack>
      </HStack>
      <CaretRight color={colors.gray100} />
    </HStack>
  )
}