import { FilesystemnodeStoreModel } from "./FilesystemnodeStore"

test("can be created", () => {
  const instance = FilesystemnodeStoreModel.create({})

  expect(instance).toBeTruthy()
})
