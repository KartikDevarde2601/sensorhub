import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface SessionScreenProps extends BottomNavigatorProps<"Session"> {}

export const SessionScreen: FC<SessionScreenProps> = observer(function SessionScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="session" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
