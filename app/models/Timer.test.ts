import { TimerModel } from "./Timer"

test("can be created", () => {
  const instance = TimerModel.create({})

  expect(instance).toBeTruthy()
})

