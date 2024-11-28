import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface DeviceScreenProps extends BottomNavigatorProps<"Device"> {}

export const DeviceScreen: FC<DeviceScreenProps> = observer(function DeviceScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="device" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
