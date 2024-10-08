import { ComponentProps } from 'react'
import {Toast, ToastTitle, ToastDescription, VStack, Icon, Pressable} from '@gluestack-ui/themed'
import {config} from '@config/gluestack-ui.config'
import { TouchableOpacity } from 'react-native'
import {X} from 'phosphor-react-native'

const {colors} = config.tokens

export type Action = 'success' | 'error'

type Props = ComponentProps<typeof Toast> & {
  id: string
  title: string
  description?:string
  action: Action
  onClose() : void
}

type StylesVariations = {
  bgColor: string
}

const variations: Record<Action, StylesVariations> = {
  error: {
    bgColor: colors.red500
  },
  success: {
    bgColor: colors.green500
  }
}

export const ToastMessage = ({id, title, description, action, onClose, ...rest}: Props) => {
  return (
    <Toast nativeID={id} bgColor={variations[action].bgColor} mt='$10' {...rest}>
      <VStack w='$full'>
        <Pressable alignSelf='flex-end' onPress={onClose}>
          <X color={colors.gray100} />
        </Pressable>
        <ToastTitle color='$white' fontFamily='$heading'>{title}</ToastTitle>
        <ToastDescription color='$white'>{description}</ToastDescription>
      </VStack>
    </Toast>
  )
}