import { MqttModel } from "./Mqtt"

test("can be created", () => {
  const instance = MqttModel.create({})

  expect(instance).toBeTruthy()
})
