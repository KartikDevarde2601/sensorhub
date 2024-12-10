import { TopicModel } from "./Topic"

test("can be created", () => {
  const instance = TopicModel.create({})

  expect(instance).toBeTruthy()
})
