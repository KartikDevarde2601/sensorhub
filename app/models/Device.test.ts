import { DeviceModel } from "./Device"

test("can be created", () => {
  const instance = DeviceModel.create({})

  expect(instance).toBeTruthy()
})
