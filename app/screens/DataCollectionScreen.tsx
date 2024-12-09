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
  Switch,
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
    console.log("mqtt_client", mqtt.client)
    const [session, setSession] = useState<Session | null>(null)
    // Pull in navigation via hook
    const navigation = useNavigation()

    useEffect(() => {
      if (route.params?.session_id) {
        const session = sessions.getSessionById(route.params.session_id)
        if (session) {
          setSession(session)
        }
      }
    }, [route.params?.session_id])

    const {
      themed,
      theme: { colors },
    } = useAppTheme()

    const TopicItem: FC<{ topic: Topic; onPress: () => void }> = ({ topic, onPress }) => {
      return (
        <Card
          style={themed($item)}
          LeftComponent={
            <View style={$iconContainer}>
              <Icon icon="sensorIndicators" size={36} color={colors.tint} />
            </View>
          }
          RightComponent={
            <View style={themed($switchContainer)}>
              <Switch
                value={topic.isMessageDisplay}
                editable={true}
                label="Display"
                labelPosition="left"
                containerStyle={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
              <Switch
                value={topic.isMessageDisplay}
                editable={false}
                label="Subcribe"
                labelPosition="left"
                containerStyle={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
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
    }

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={themed([$screenContentContainer, $styles.flex1])}
      >
        <View style={themed($topContainer)}>
          <Icon icon="mqtt" color="green" size={36} />
          <Icon icon="sensor" color="green" size={36} />
          <Timer />
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
          ListHeaderComponent={
            <View style={themed($heading)}>
              <Text text="Sensors" preset="heading" />
            </View>
          }
          renderItem={({ item }) => (
            <TopicItem topic={item} onPress={() => console.log("device item")} />
          )}
        />
        <View style={themed($buttonContainer)}>
          <Button text="connect" style={themed($button)} onPress={() => mqtt.client?.connect()} />
          <Button text="start" style={themed($button)} />
          <Button text="subscribe" style={themed($button)} />
          <Button text="complete" style={themed($button)} />
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

const $switchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "column",
  height: 30,
})

const $rightContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "column",
  justifyContent: "space-between",
})
