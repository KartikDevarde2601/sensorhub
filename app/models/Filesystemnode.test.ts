import { FilesystemnodeModel } from "./Filesystemnode"

test("can be created", () => {
  const instance = FilesystemnodeModel.create({})

  expect(instance).toBeTruthy()
})
