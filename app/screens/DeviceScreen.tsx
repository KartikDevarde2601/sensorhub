import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, SafeAreaView, TextStyle } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { DeviceItem, Button, Icon, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors } from "@/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import type { ThemedStyle } from "@/theme"

interface DeviceScreenProps extends BottomNavigatorProps<"Device"> {}

export const DeviceScreen: FC<DeviceScreenProps> = observer(function DeviceScreen(_props) {
  const { themed, theme } = useAppTheme()
  const { navigation } = _props
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, $root]}>
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
      <Text text="Device List" style={themed($welcomeHeading)} preset="heading" />
      <DeviceItem />
    </SafeAreaView>
  )
})

const $root: ViewStyle = {
  flex: 1,
  position: "relative",
  marginHorizontal: 10,
  marginVertical: 10,
}

const $fab: ViewStyle = {
  position: "absolute",
  bottom: 30,
  right: 24,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}

const $fabpress: ViewStyle = {
  backgroundColor: colors.palette.primary200,
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
