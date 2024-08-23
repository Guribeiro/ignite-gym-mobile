import { Image } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof Image>

export const UserAvatar = ({...rest}:Props) => {
  return (
    <Image 
      rounded='$full' 
      borderWidth='$2' 
      borderColor="$gray400"
      backgroundColor="$gray400"
      w='$16'
      h='$16'
      {...rest}
    />
  )
}