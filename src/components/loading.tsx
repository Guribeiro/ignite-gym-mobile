import { Center, Spinner } from "@gluestack-ui/themed"
import {config} from '@config/gluestack-ui.config'

const {colors} = config.tokens

export const Loading = () => {
  return (
    <Center flex={1}>
      <Spinner color={colors.green500} />
    </Center>
  )
}