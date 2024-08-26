import { Box, Heading } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof Box> & {
  title: string
}

export const Header = ({title, ...rest}: Props) => {
  return (
    <Box justifyContent="center" alignItems='center' pt='$16' pb='$8' bgColor="$gray500" {...rest}>
      <Heading color='$gray100'>{title}</Heading>
    </Box>
  )
}