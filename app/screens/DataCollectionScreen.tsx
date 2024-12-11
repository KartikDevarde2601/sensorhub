import { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import {
  Screen,
  Text,
  Icon,
  Timer,
  ListView,
  ListItemProps,
  EmptyState,
  Button,
  Card,
  Radio,
} from "@/components"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { useStores } from "@/models"
import { Session, Topic, Device } from "@/models"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
import { $styles } from "../theme"
import { ContentStyle } from "@shopify/flash-list"

interface DataCollectionScreenProps extends AppStackScreenProps<"DataCollection"> {}

export const DataCollectionScreen: FC<DataCollectionScreenProps> = observer(
  function DataCollectionScreen() {
    const route = useRoute<RouteProp<{ EditSession: { session_id?: string } }, "EditSession">>()
    const { sessions, mqtt } = useStores()
    const [session, setSession] = useState<Session | null>(null)
    // Pull in navigation via hook
    const navigation = useNavigation()

    useEffect(() => {
      if (route.params?.session_id) {
        const session = sessions.getSessionById(route.params.session_id)
        if (session) {
          mqtt.replaceTopic(session.deviceTopics)
          setSession(session)
        }
      }
    }, [route.params?.session_id])

    useEffect(() => {
      return () => {
        mqtt.unsubscribe()
      }
    }, [session])

    const {
      themed,
      theme: { colors },
    } = useAppTheme()

    const TopicItem: FC<{ topic: Topic; onPress: () => void }> = observer(({ topic, onPress }) => {
      return (
        <Card
          style={themed($item)}
          LeftComponent={
            <View style={$iconContainer}>
              <Icon
                icon={topic.Issubscribed ? "sensor" : "sensorIndicators"}
                size={36}
                color={colors.tint}
              />
            </View>
          }
          RightComponent={
            <Radio
              value={topic.isMessageDisplay}
              onValueChange={() => topic.updateMessageDisplay()}
            />
          }
          heading={topic.topicName}
          ContentComponent={
            <View style={themed($contentContainer)}>
              <Text text="data :" />
              <Text text={topic.message} />
            </View>
          }
        />
      )
    })

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={themed([$screenContentContainer, $styles.flex1])}
      >
        <View style={themed($topContainer)}>
          <Icon
            icon="mqtt"
            color={mqtt.isconnected ? colors.palette.angry100 : colors.palette.angry500}
            size={36}
          />
          <Timer />
        </View>
        <View style={themed($statusContainer)}>
          <Text text="status:" preset="subheading" />
          <Text text={mqtt.status} />
        </View>
        <ListView
          contentContainerStyle={themed($listContentContainer)}
          estimatedItemSize={130}
          extraData={session?.deviceTopicLength}
          data={session?.deviceTopics.slice() as Topic[]}
          ListEmptyComponent={
            <EmptyState
              preset="generic"
              style={themed($emptyState)}
              heading="No Devices Found"
              content="Add a new device to get started Click Right Bottom Button"
            />
          }
          renderItem={({ item }) => (
            <TopicItem topic={item} onPress={() => console.log("device item")} />
          )}
        />
        <View style={themed($buttonContainer)}>
          <Button text="connect" style={themed($button)} onPress={() => mqtt.connect()} />
          <Button text="start" style={themed($button)} onPress={() => console.log("start")} />
          <Button text="subscribe" style={themed($button)} onPress={() => mqtt.subscribe()} />
          <Button text="unsubscribe" style={themed($button)} onPress={() => mqtt.unsubscribe()} />
        </View>
      </Screen>
    )
  },
)
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginHorizontal: spacing.xl,
})

const $listContentContainer: ThemedStyle<ContentStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  bottom: 10,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-around",
  gap: spacing.md,
})

const $button: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  width: "40%",
})

const $iconContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}
const $item: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 80,
  backgroundColor: colors.palette.neutral100,
})

const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginHorizontal: spacing.xl,
})
