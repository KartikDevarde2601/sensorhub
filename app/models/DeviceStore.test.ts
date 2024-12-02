import { DeviceStoreModel } from "./DeviceStore"

test("can be created", () => {
  const instance = DeviceStoreModel.create({})

  expect(instance).toBeTruthy()
})
