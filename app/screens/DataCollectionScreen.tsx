import { FC, useState, useEffect, useMemo } from "react"
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
import MqttClient, { ConnectionOptions, ClientEvent } from "@ko-developerhong/react-native-mqtt"
import { ConnectionStatus } from "@/models/Mqtt"
import { DatabaseService } from "@/op-sql/databaseRepository"
import { create_csv_andSave } from "@/utils/csvGenerator"

interface DataCollectionScreenProps extends AppStackScreenProps<"DataCollection"> {}

export const DataCollectionScreen: FC<DataCollectionScreenProps> = observer(
  function DataCollectionScreen() {
    const route = useRoute<RouteProp<{ EditSession: { session_id?: string } }, "EditSession">>()
    const { sessions, mqtt } = useStores()
    const [session, setSession] = useState<Session | null>(null)
    const [command, setCommand] = useState("")
    // Pull in navigation via hook
    const navigation = useNavigation()
    const dbService = useMemo(() => DatabaseService.getInstance(), [])

    const clientInt = async () => {
      console.log("Connecting to MQTT broker")
      try {
        await MqttClient.connect("mqtt://10.2.216.208:1883", {}).then(() => {
          console.log("Connected to MQTT broker")
        })
        MqttClient.on(ClientEvent.Connect, () => {
          mqtt.updateStatus(ConnectionStatus.CONNECTED)
          mqtt.updateIsConnected(true)
        })
        MqttClient.on(ClientEvent.Error, (error) => {
          console.error("Connection error: ", error)
          mqtt.updateStatus(ConnectionStatus.ERROR)
          mqtt.updateErrorMessage(error)
        })
        MqttClient.on(ClientEvent.Disconnect, (cause) => {
          console.log("Disconnected: ", cause)
          mqtt.updateStatus(ConnectionStatus.DISCONNECTED)
          mqtt.updateIsConnected(false)
        })
        MqttClient.on(ClientEvent.Message, (topic, message) => {
          console.log("Message received: ", topic, message.toString())
          if (session) {
            const topicModel = session.deviceTopics.find((t: Topic) => t.topicName === topic)
            if (topicModel) {
              topicModel.addMessage(message.toString(), session.sessionName)
            }
          }
        })

        subscribe()
      } catch (err) {
        console.error("Connection error: ", err)
      }
    }

    const subscribe = async () => {
      if (session) {
        const topics = session.deviceTopics.slice()
        topics.forEach((topic: Topic) => {
          MqttClient.subscribe(topic.topicName, 0)
          topic.updateSubcriptionStats()
        })
      }
    }

    const unsubscribe = async () => {
      if (session) {
        const topics = session.deviceTopics.slice()
        topics.forEach((topic: Topic) => {
          MqttClient.unsubscribe([topic.topicName])
          topic.updateSubcriptionStats()
        })
      }
    }

    const publish = async (topic: string, message: string) => {
      MqttClient.publish(topic, message, 1)
      console.log(`Published message: ${message} to topic: ${topic}`)
    }

    const process = async () => {
      const topics = session?.deviceTopics.slice().map((topic: Topic) => {
        return topic.topicName
      })
      const session_name = session!!.sessionName
      await create_csv_andSave(topics, session_name, dbService, navigation)
    }

    const handleMQTTCleanup = () => {
      unsubscribe()
      MqttClient.off(ClientEvent.Connect)
      MqttClient.off(ClientEvent.Error)
      MqttClient.off(ClientEvent.Disconnect)
      MqttClient.disconnect()
      mqtt.updateIsConnected(false)
    }

    useEffect(() => {
      if (route.params?.session_id) {
        const session = sessions.getSessionById(route.params.session_id)
        if (session) {
          setSession(session)
        }
      }

      return () => {
        console.log("Disconnecting from MQTT broker")
        handleMQTTCleanup()
      }
    }, [route.params?.session_id])

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
          <Button
            text="connect"
            style={themed($button)}
            onPress={() => clientInt()}
            disabled={mqtt.isconnected}
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
