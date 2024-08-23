import {ComponentProps} from 'react'
import {Input as GluestackInput, InputField} from '@gluestack-ui/themed'

type InputProps = ComponentProps<typeof InputField>

export const Input = ({...rest}:InputProps) => {
  return (
    <GluestackInput 
      bg='$gray700' 
      h='$14' 
      px='$4' 
      borderWidth='$0' 
      borderRadius='$md'
      $focus={{
        borderColor: '$green300',
        borderWidth: 1
      }}
    >
      <InputField
        color='$white'
        fontFamily='$body'
        placeholderTextColor='$gray300' 
        {...rest}
      />
    </GluestackInput>
  )
}  