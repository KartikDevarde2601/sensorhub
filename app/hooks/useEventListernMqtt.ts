import * as React from "react"
import { MqttClient } from "@d11/react-native-mqtt/dist/Mqtt/MqttClient"
import { useStores } from "@/models"

export const useEventListeners = (mqttClient: MqttClient | undefined) => {
  const { mqtt } = useStores()
  React.useEffect(() => {
    const connectionListener = mqttClient?.setOnConnectCallback((ack) => {
      console.log("Client Connection Success Listner", ack)
      mqtt.updateIsConnected(true)
    })

    const onConnectFailureListener = mqttClient?.setOnConnectFailureCallback((reasonCode) => {
      console.log("Client Connection Failure Listner", reasonCode)
      mqtt.updateIsConnected(false)
    })

    const onErrorFailureListener = mqttClient?.setOnErrorCallback((ack) => {
      console.log("Client Connection Failure Listner", ack)
      mqtt.updateIsConnected(false)
    })

    const onDisconnectFailureListener = mqttClient?.setOnDisconnectCallback((ack) => {
      console.log("Client Connection Failure Listner", ack)
      mqtt.updateIsConnected(false)
    })

    return () => {
      connectionListener?.remove()
      onConnectFailureListener?.remove()
      onErrorFailureListener?.remove()
      onDisconnectFailureListener?.remove()
    }
  }, [mqttClient])
}
