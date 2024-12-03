import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { DeviceItem, Button, Icon, Text, Screen } from "@/components"
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
    <Screen preset="fixed" contentContainerStyle={themed($screenContentContainer)}>
      <View style={$root}>
        <Text text="Device List" style={themed($welcomeHeading)} preset="heading" />
        <DeviceItem />
      </View>
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
        onPress={() => navigation.navigate("AddDevice")}
      />
    </Screen>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.md,
  flex: 1,
})

const $root: ViewStyle = {
  flex: 1,
}

const $fab: ViewStyle = {
  position: "absolute",
  bottom: 16,
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
