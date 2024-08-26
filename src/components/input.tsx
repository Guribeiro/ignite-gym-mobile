import {ComponentProps} from 'react'
import {Input as GluestackInput, InputField} from '@gluestack-ui/themed'

type InputProps = ComponentProps<typeof InputField>

export const Input = ({...rest}:InputProps) => {
  return (
    <GluestackInput 
      h='$14' 
      borderWidth='$0' 
      borderRadius='$md'
      $focus={{
        borderColor: '$green300',
        borderWidth: 1
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
    </GluestackInput>
  )
}  