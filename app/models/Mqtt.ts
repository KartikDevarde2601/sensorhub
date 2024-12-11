import { types, flow, Instance, destroy, SnapshotOut, SnapshotIn } from "mobx-state-tree"
import { MqttOptionsModel } from "./MqttOptions"
import { Topic, TopicModel } from "./Topic"
import MqttClient, { ConnectionOptions, ClientEvent } from "@ko-developerhong/react-native-mqtt"
import uuid from "react-native-uuid"
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
    updateStatus(status: ConnectionStatus) {
      self.status = status
    },
    updateIsConnected(isconnected: boolean) {
      self.isconnected = isconnected
    },
    updateErrorMessage(message: string | null) {
      self.errorMessage = message
    },
  }))
  .views((self) => ({
    get isMqttStatus() {
      return self.status === ConnectionStatus.CONNECTED
    },
  }))

export interface Mqtt extends Instance<typeof MqttStore> {}
export interface MqttSnapshotOut extends SnapshotOut<typeof MqttStore> {}
export interface MqttSnapshotIn extends SnapshotIn<typeof MqttStore> {}
