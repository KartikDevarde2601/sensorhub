import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Text, Card, Icon } from "@/components"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { AppStackParamList } from "@/navigators/AppNavigator"
import { Device } from "@/models/Device"

export interface DeviceItemProps {
  onPress?: () => void
  device: Device
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const DeviceItem = observer(function DeviceItem(props: DeviceItemProps) {
  const { style, onPress, device } = props
  const $styles = [$container, style]
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()

  return (
    <Card
      onPress={() => navigation.navigate("AddDevice", { device_id: device.id })}
      style={themed($item)}
      LeftComponent={
        <View style={$iconContainer}>
          <Icon icon="device" size={50} color={theme.colors.tint} />
        </View>
      }
      heading={device.name}
      ContentComponent={
        <View style={$contentContainer}>
          <View style={$topicTextContainer}>
            <Text text="Num of Topics :" />
            <Text text={device.numTopics.toString()} />
          </View>
          <View style={$topicTextContainer}>
            <Text text="Num of Session :" />
            <Text text={device.numSessions.toString()} />
          </View>
        </View>
      }
    />
  )
})
const $item: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
  backgroundColor: colors.palette.neutral100,
})

const $iconContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $container: ViewStyle = {
  justifyContent: "center",
}

const $topicTextContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $contentContainer: ViewStyle = {
  flexDirection: "column",
  justifyContent: "space-between",
}
