import { Button, Text } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type Props = ComponentProps<typeof Button> & {
  title: string
  active: boolean
  onPress() : void
}

export const Group = ({title, active, onPress}:Props) => {
  return (
    <Button
      minWidth='$24'
      h='$10'
      bg='$gray600'
      rounded='$md'
      justifyContent='center'
      alignItems='center'
      borderColor={active ? 'green500': '$gray600'}
      borderWidth={1}
      $active={{
        borderColor: '$green500'
      }}
      onPress={onPress}
    >
      <Text 
        color={active ? '$green500' : '$gray200'} 
        textTransform='uppercase'
        fontFamily='$heading'
        fontSize='$sm'
      >
        {title}
      </Text>
    </Button>
  )
}