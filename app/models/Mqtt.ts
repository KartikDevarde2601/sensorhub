import { types, flow, Instance, destroy, SnapshotOut, SnapshotIn } from "mobx-state-tree"
import { MqttOptionsModel } from "./MqttOptions"
import { Topic, TopicModel } from "./Topic"
import MqttClient, { ConnectionOptions, ClientEvent } from "@ko-developerhong/react-native-mqtt"
import { connect } from "formik"
import { add, sub } from "date-fns"
import { remove } from "@/utils/storage"

// Enum for connection status
export enum ConnectionStatus {
  IDLE = "IDLE",
  INITIALIZING = "INITIALIZING",
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  ERROR = "ERROR",
}

// Enum for QoS levels
export enum MqttQos {
  AT_MOST_ONCE = 0,
  AT_LEAST_ONCE = 1,
  EXACTLY_ONCE = 2,
}

// MQTT Store Model
export const MqttStore = types
  .model("MqttStore")
  .props({
    clientId: types.string,
    host: types.string,
    isconnected: types.optional(types.boolean, false),
    port: types.optional(types.number, 1883),
    options: types.optional(MqttOptionsModel, {}),
    status: types.optional(
      types.enumeration("ConnectionStatus", Object.values(ConnectionStatus)),
      ConnectionStatus.IDLE,
    ),
    errorMessage: types.maybeNull(types.string),
    topics: types.map(TopicModel),
  })

  .actions((self) => ({
    connect: flow(function* connect() {
      self.status = ConnectionStatus.CONNECTING
      if (self.host === "" && self.clientId === "") {
        self.status = ConnectionStatus.ERROR
        self.errorMessage = "Host and Client ID cannot be empty"
        console.log("Host and Client ID cannot be empty")
        return
      }
      yield MqttClient.connect(
        `${self.options.protocol}://${self.host}`,
        self.options as ConnectionOptions,
      )
        .then(() => {
          MqttClient.on(ClientEvent.Connect, () => {
            self.status = ConnectionStatus.CONNECTED
            self.isconnected = true
          })

          MqttClient.on(ClientEvent.Disconnect, (cause) => {
            self.status = ConnectionStatus.DISCONNECTED
            self.isconnected = false
            self.errorMessage = cause
          })

          MqttClient.on(ClientEvent.Error, (error) => {
            self.status = ConnectionStatus.ERROR
            self.errorMessage = (error as unknown as Error).message
          })

          MqttClient.on(ClientEvent.Message, (topic, message) => {
            const topicObj = self.topics.get(topic.toString())
            if (topicObj) {
              topicObj.addMessage(message.toString())
            }
          })
        })
        .catch((error) => {
          self.status = ConnectionStatus.ERROR
          self.errorMessage = error.message
        })
    }),

    replaceTopic(topics: Topic[]) {
      self.topics.clear()
      topics.forEach((topic) => {
        self.topics.set(topic.topicName, topic)
      })
    },

    subscribe() {
      if (self.isconnected) {
        self.topics.forEach((topic) => {
          const topicName = topic.getTopicName()
          MqttClient.subscribe(topicName, MqttQos.AT_LEAST_ONCE)
          topic.updateSubcriptionStats()
        })
      }
    },

    unsubscribe() {
      if (self.isconnected) {
        self.topics.forEach((topic) => {
          const topicName = topic.getTopicName()
          MqttClient.unsubscribe([topicName])
          topic.updateSubcriptionStats()
        })
      }
    },
  }))
  .views((self) => ({
    get isConnected() {
      return self.status === ConnectionStatus.CONNECTED
    },
  }))

export interface Mqtt extends Instance<typeof MqttStore> {}
export interface MqttSnapshotOut extends SnapshotOut<typeof MqttStore> {}
export interface MqttSnapshotIn extends SnapshotIn<typeof MqttStore> {}
