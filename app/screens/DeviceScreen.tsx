import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { Screen, Button, Icon, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors } from "@/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface DeviceScreenProps extends BottomNavigatorProps<"Device"> {}

export const DeviceScreen: FC<DeviceScreenProps> = observer(function DeviceScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const { themed, theme } = useAppTheme()
  const { navigation } = _props
  return (
    <View style={$root}>
      <Button
        RightAccessory={(props) => (
          <Icon
            icon="plus"
            style={props.style}
            size={props.pressableState.pressed ? 35 : 30}
            color={props.pressableState.pressed ? colors.tintactive : colors.tint}
          />
        )}
        preset="default"
        style={[$fab, { backgroundColor: theme.colors.palette.primary100 }]}
        pressedStyle={$fabpress}
        onPress={() => console.log("add device")}
      ></Button>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $fab: ViewStyle = {
  position: "absolute",
  bottom: 30,
  right: 30,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}

const $fabpress: ViewStyle = {
  backgroundColor: colors.palette.primary200,
}
