import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { DeviceModel } from "./Device"

/**
 * Model description here for TypeScript hints.
 */
export const DeviceStoreModel = types
  .model("DeviceStore")
  .props({
    devices: types.optional(types.array(DeviceModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addDevice(device: Instance<typeof DeviceModel>) {
      self.devices.push(device)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DeviceStore extends Instance<typeof DeviceStoreModel> {}
export interface DeviceStoreSnapshotOut extends SnapshotOut<typeof DeviceStoreModel> {}
export interface DeviceStoreSnapshotIn extends SnapshotIn<typeof DeviceStoreModel> {}
export const createDeviceStoreDefaultModel = () => types.optional(DeviceStoreModel, {})
