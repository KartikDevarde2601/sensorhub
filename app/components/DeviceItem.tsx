import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Text, Card, AutoImage, Button, Icon } from "@/components"

export interface DeviceItemProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const DeviceItem = observer(function DeviceItem(props: DeviceItemProps) {
  const { style } = props
  const $styles = [$container, style]
  const { themed, theme } = useAppTheme()

  return (
    <View style={$styles}>
      <Card
        onPress={() => console.log("device item")}
        style={{
          paddingHorizontal: 30,
          paddingVertical: 10,
          alignContent: "center",
          justifyContent: "center",
        }}
        LeftComponent={
          <View style={$iconContainer}>
            <Icon icon="device" size={50} color={theme.colors.tint} />
          </View>
        }
        heading="Device Name"
        ContentComponent={
          <View style={$contentContainer}>
            <View style={$topicTextContainer}>
              <Text text="Num of Topics :" />
              <Text text="34" />
            </View>
            <View style={$topicTextContainer}>
              <Text text="Num of Session :" />
              <Text text="34" />
            </View>
          </View>
        }
      />
    </View>
  )
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
