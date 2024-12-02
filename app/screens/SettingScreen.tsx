import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { BottomNavigatorProps } from "@/navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface SettingScreenProps extends BottomNavigatorProps<"Setting"> {}

export const SettingScreen: FC<SettingScreenProps> = observer(function SettingScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="fixed">
      <Text text="setting" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
