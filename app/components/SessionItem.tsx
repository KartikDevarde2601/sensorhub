import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, type ThemedStyle } from "@/theme"
import { Text, Card, Icon } from "@/components"
import { Session } from "@/models"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { AppStackParamList } from "@/navigators/AppNavigator"

export interface SessionItemProps {
  onPress?: () => void
  session: Session
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const SessionItem = observer(function SessionItem(props: SessionItemProps) {
  const { style, onPress, session } = props
  const $styles = [$container, style]
  const { themed, theme } = useAppTheme()

  const navigation = useNavigation<NavigationProp<AppStackParamList>>()

  return (
    <Card
      onPress={() => navigation.navigate("EditSession", { session_id: session.id })}
      onLongPress={() => navigation.navigate("DataCollection", { session_id: session.id })}
      style={themed($item)}
      LeftComponent={
        <View style={$iconContainer}>
          <Icon icon="session" size={50} color={theme.colors.tint} />
        </View>
      }
      heading={session.sessionName}
      ContentComponent={
        <View style={$contentContainer}>
          <View style={$topicTextContainer}>
            <Text text="Num of Topics :" />
            <Text text={session.deviceTopicsNumber.toString()} />
          </View>
          <View style={$topicTextContainer}>
            <Text text="Device ref :" />
            <Text text={session.deviceName.toString()} />
          </View>
          <View style={$topicTextContainer}>
            <Text
              text={session.description}
              preset="default"
              style={{ color: colors.palette.neutral500 }}
            />
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
