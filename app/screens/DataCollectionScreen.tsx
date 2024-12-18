import { FC, useState, useEffect, useMemo, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text, Icon, Timer, ListView, EmptyState, Button, Card, Radio } from "@/components"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { useStores } from "@/models"
import { Session, Topic } from "@/models"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
import { $styles } from "../theme"
import { ContentStyle } from "@shopify/flash-list"
import { MqttClient } from "@kartik2601/rn-mqtt-android/dist/Mqtt/MqttClient"
import { DatabaseService } from "@/op-sql/databaseRepository"
import { create_csv_andSave } from "@/utils/csvGenerator"
import { useEventListeners } from "@/hooks/useEventListernMqtt"

interface DataCollectionScreenProps extends AppStackScreenProps<"DataCollection"> {}

export const DataCollectionScreen: FC<DataCollectionScreenProps> = observer(
  function DataCollectionScreen() {
    const route = useRoute<RouteProp<{ EditSession: { session_id?: string } }, "EditSession">>()
    const { sessions, mqtt, timer } = useStores()
    const [session, setSession] = useState<Session | null>(null)
    // Pull in navigation via hook
    const navigation = useNavigation()
    const dbService = useMemo(() => DatabaseService.getInstance(), [])

    useEffect(() => {
      if (route.params?.session_id) {
        const session = sessions.getSessionById(route.params.session_id)
        if (session) {
          setSession(session)
          mqtt.setSessionName(session.sessionName)
        }
      }
    }, [route.params?.session_id])

    useEffect(() => {
      return () => {
        console.log("DataCollectionScreen Unmounted")
        handleUnSubscibeTopic()
        if (mqtt.isConnected) {
          mqtt.disconnect()
        }
      }
    }, [session])

    const handleSubscibeTopic = useCallback(() => {
      if (!mqtt.client) {
        console.log("MQTT client not connected")
        return
      }
      const topices = session?.deviceTopics.slice() as Topic[]
      console.log(topices)
      if (topices.length > 0) {
        topices.forEach((topic) => {
          mqtt.subscribe(topic)
        })
      }
    }, [session])

    const handleUnSubscibeTopic = useCallback(() => {
      if (!mqtt.client) {
        console.log("MQTT client not connected")
        return
      }
      const topices = session?.deviceTopics?.slice() as Topic[] | undefined
      if (topices && topices.length > 0) {
        topices.forEach((topic) => {
          mqtt.unsubscribe(topic)
        })
      }
    }, [session])

    const publish = async (topic: string, message: string) => {
      const paylaod = {
        topic: topic,
        payload: message,
      }
      mqtt.client?.publish(paylaod).then((ack) => {
        if (topic === "start") {
          timer.start()
        }

        if (topic === "stop") {
          timer.stop()
        }
      })

      console.log(`Published message: ${message} to topic: ${topic}`)
    }

    const process = async () => {
      const topics = session?.deviceTopics.slice().map((topic: Topic) => {
        return topic.topicName
      })
      const session_name = session!!.sessionName
      await create_csv_andSave(topics, session_name, dbService, navigation)
    }
    if (mqtt.client) {
      useEventListeners(mqtt.client)
      console.log("MQTT Event Listener")
    } else {
      console.log("MQTT client not connected")
    }

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
                onPress={() => mqtt.subscribe(topic)}
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
          <Button
            text="connect"
            style={themed($button)}
            onPress={() => mqtt.connect()}
            disabledStyle={{ backgroundColor: colors.tintInactive }}
          />
          <Button
            text="start"
            style={themed($button)}
            onPress={() => publish("start", "start")}
            disabled={!mqtt.isconnected}
            disabledStyle={{ backgroundColor: colors.tintInactive }}
          />
          <Button
            text="stop"
            style={themed($button)}
            onPress={() => publish("stop", "stop")}
            disabled={!mqtt.isconnected}
            disabledStyle={{ backgroundColor: colors.tintInactive }}
          />
          <Button text="process" style={themed($button)} onPress={() => process()} />
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
  backgroundColor: colors.tint,
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
