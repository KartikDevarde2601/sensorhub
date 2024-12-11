import { types } from "mobx-state-tree"
import { MqttStore, ConnectionStatus } from "./Mqtt"

test("can be created", () => {
  const instance = MqttStore.create({
    clientId: "clientId",
    host: "host",
    isconnected: false,
    port: 1883,
    options: {},
    status: ConnectionStatus.IDLE,
    errorMessage: null,
  })

  expect(instance).toBeTruthy()
})
