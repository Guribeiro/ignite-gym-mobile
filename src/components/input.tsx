import {ComponentProps} from 'react'
import {Input as GluestackInput, InputField, Text} from '@gluestack-ui/themed'

type InputProps = ComponentProps<typeof InputField> & {
  error?: string
}

export const Input = ({error, ...rest}:InputProps) => {
  return (
    <GluestackInput 
      h='$14' 
      borderWidth='$1' 
      borderRadius='$md'
      borderColor={error ? '$red500' : '$gray700'}
      $focus={{
        borderColor: '$green300',
      }}
    >
      <InputField
        px='$4' 
        bg='$gray700' 
        color='$white'
        fontFamily='$body'
        placeholderTextColor='$gray300' 
        {...rest}
      />
      {error && (
        <Text 
        position='absolute' 
        right='$2' 
        bottom='$2' 
        fontSize={'$xs'}
        color='$red500'
        >
         {error}
       </Text>
      )}
     
    </GluestackInput>
  )
}  