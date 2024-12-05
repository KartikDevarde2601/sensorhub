import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { 
  createMqttClient, 
  MqttConfig, 
  MqttEventsInterface, 
  MQTT_EVENTS 
} from "@d11/react-native-mqtt"
import { MqttClient } from "@d11/react-native-mqtt/dist/Mqtt/MqttClient"
import { MqttOptionsModel } from "./MqttOptions"
import { TopicModel } from "./Topic"

// Type definitions for callbacks
type OnConnectCallback = (ack: MqttEventsInterface[MQTT_EVENTS.CONNECTED_EVENT]) => void
type OnConnectFailureCallback = (mqtt5ReasonCode: number) => void
type OnErrorCallback = (ack: MqttEventsInterface[MQTT_EVENTS.ERROR_EVENT]) => void
type OnDisconnectCallback = (
  mqtt5ReasonCode: number, 
  options?: Record<string, any>
) => void
type ConnectInterceptor = (options?: any) => Promise<any | undefined>
type ReconnectInterceptor = (mqtt5ReasonCode?: number) => Promise<any | undefined>

export const MqttModel = types
  .model("Mqtt")
  .props({
    clientId: types.string,
    host: types.string,
    port: types.number,
    options: MqttOptionsModel,
    client: types.maybe(types.frozen<MqttClient>()),
    isMqttConnected: types.optional(types.boolean, false),
    error: types.optional(types.string, ""),
    isInitializingMqttClient: types.optional(types.boolean, false),
    connectionStatus: types.optional(types.string, ""),
    retryCount: types.optional(types.number, 0),
    topics:types.map(TopicModel)
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    // Initialize the MQTT client with comprehensive event handling
    initializeClient: flow(function* () {
      const config: MqttConfig = {
        clientId: self.clientId,
        host: self.host,
        port: self.port,
        options: self.options,
      }

      try {
        self.isInitializingMqttClient = true
        const client = yield createMqttClient(config)
        
        // Set up event callbacks
        client.setOnConnectCallback((ack: MqttEventsInterface[MQTT_EVENTS.CONNECTED_EVENT]) => {
          self.isMqttConnected = true
          self.connectionStatus = "Connected"
          self.error = ""
          console.log("MQTT Connected:", ack)
        })

        client.setOnConnectFailureCallback((reasonCode: number) => {
          self.isMqttConnected = false
          self.error = `Connection Failed: ${reasonCode}`
          self.connectionStatus = "Connection Failed"
          console.error("MQTT Connection Failure:", reasonCode)
        })

        client.setOnErrorCallback((error: MqttEventsInterface[MQTT_EVENTS.ERROR_EVENT]) => {
          self.error = `MQTT Error: ${error}`
          console.error("MQTT Error:", error)
        })

        client.setOnDisconnectCallback((reasonCode: number, options: Record<string, any>) => {
          self.isMqttConnected = false
          self.connectionStatus = "Disconnected"
          console.log("MQTT Disconnected:", reasonCode, options)
        })

        // Optional: Set up reconnect interceptor
        client.setOnReconnectInterceptor(async (reasonCode:number) => {
          self.retryCount++
          console.log(`Attempting reconnect. Retry count: ${self.retryCount}`)
          // Optionally modify reconnection options
          return {
            // Custom reconnection logic can be added here
          }
        })

        self.client = client
      } catch (error) {
        self.error = (error as any).message
        self.connectionStatus = "Initialization Failed"
      } finally {
        self.isInitializingMqttClient = false
      }
    }),

    // Connect to the MQTT broker
    connect: flow(function* () {
      try {
        self.client?.connect()
      } catch (error) {
        self.error = (error as any).message
        self.connectionStatus = "Connection Error"
      }
    }),

    // Additional utility methods
    getConnectionStatus() {
      return self.connectionStatus
    },

    getCurrentRetryCount() {
      return self.retryCount
    }
  }))

export interface Mqtt extends Instance<typeof MqttModel> {}
export interface MqttSnapshotOut extends SnapshotOut<typeof MqttModel> {}
export interface MqttSnapshotIn extends SnapshotIn<typeof MqttModel> {}