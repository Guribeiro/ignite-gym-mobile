import { Button as GluestackButton, Text, ButtonSpinner } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'
import { gluestackUIConfig } from '@config/gluestack-ui.config'

type Variant = 'outlined' | 'solid' 

type Props = ComponentProps<typeof GluestackButton> & {
  title: string
  variation?: Variant
  loading?: boolean
}

type VariationStyle = {
  button: {
    bg: string
    borderWidth: "$0" | "$1" | "$2" | "$4" | "$8"
    borderColor: string
    $active: {
      bgColor: string
    }
  }
} 

const variations: Record<Variant, VariationStyle> = {
  outlined: {
    button: {
      bg: 'transparent',
      borderWidth: '$1',
      borderColor: '$green700',
      $active: {
        bgColor: '$green700',  
      }
    },
    
  },
  solid: {
    button: {
      bg: '$green700',
      borderWidth: '$0',
      borderColor: '',
      $active: {
        bgColor: '$green500',  
      }
    },
  }
}
 

export const Button = ({title, variation = 'solid', loading,...rest}:Props) => {
  return (
    <GluestackButton 
      bg={variations[variation].button.bg} 
      h='$14' 
      px='$4' 
      borderWidth={variations[variation].button.borderWidth}
      borderColor={variations[variation].button.borderColor}
      borderRadius='$md'
      w='$full'
      $active={variations[variation].button.$active}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ButtonSpinner color='$white' />
      ): (
        <Text 
          color={'$white'} 
          fontFamily='$heading'
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}