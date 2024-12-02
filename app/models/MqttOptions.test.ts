import { MqttOptionsModel } from "./MqttOptions"

test("can be created", () => {
  const instance = MqttOptionsModel.create({})

  expect(instance).toBeTruthy()
})
