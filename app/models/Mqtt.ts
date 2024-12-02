import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { createMqttClient, MqttConfig ,MqttEventsInterface,MQTT_EVENTS, Mqtt5ReasonCode} from "@d11/react-native-mqtt"
import { MqttClient } from "@d11/react-native-mqtt/dist/Mqtt/MqttClient"
import { MqttOptionsModel } from "./MqttOptions"


type onConnectCallback = (ack: MqttEventsInterface[MQTT_EVENTS.CONNECTED_EVENT]) => void
type OnConnectFailedCallback = (mqtt5ReasonCode:number) => void
type OnErrorCallback = (ack: MqttEventsInterface[MQTT_EVENTS.ERROR_EVENT]) => void
type OnDisconnectCallback = (
  Mqtt5ReasonCode:Mqtt5ReasonCode,
  options:Record<string,any>
)=> void
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
    isIntializing_Mqtt_Client: types.optional(types.boolean, false),
    connectionStatus: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({}))
  .actions((self) => ({
    // Intialize the MQTT client
    initializeClient: flow(function* () {
      const config: MqttConfig = {
        clientId: self.clientId,
        host: self.host,
        port: self.port,
        options: self.options,
      }

      try {
        self.isIntializing_Mqtt_Client = true
        const client = yield createMqttClient(config)
        self.client = client

      } catch (error) {
        self.error = (error as any).message
      } finally {
        self.isIntializing_Mqtt_Client = false
      }

    }),
   // Connect to the MQTT broker
    connect :flow(function* () {
      try {
        self.client?.connect()
      } catch (error) {
        self.error = (error as any).message
      }
    }),
  }))

export interface Mqtt extends Instance<typeof MqttModel> {}
export interface MqttSnapshotOut extends SnapshotOut<typeof MqttModel> {}
export interface MqttSnapshotIn extends SnapshotIn<typeof MqttModel> {}
