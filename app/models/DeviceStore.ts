import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { DeviceModel } from "./Device"
import {TopicModel,Topic} from "./Topic"
import uuid from "react-native-uuid"
import { id } from "date-fns/locale"

/**
 * Model description here for TypeScript hints.
 */
export const DeviceStoreModel = types
  .model("DeviceStore")
  .props({
    devices: types.optional(types.array(DeviceModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get devicesForList() {
      return self.devices
    },
    getDeviceById(id: string) : Instance<typeof DeviceModel> | undefined {
      return self.devices.find((device) => device.id === id)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addDevice(name: string,topics?:Topic[]): Instance<typeof DeviceModel> {
      const newDevice = DeviceModel.create({ id: uuid.v4(), name })
      self.devices.push(newDevice)
      return newDevice
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DeviceStore extends Instance<typeof DeviceStoreModel> {}
export interface DeviceStoreSnapshotOut extends SnapshotOut<typeof DeviceStoreModel> {}
export interface DeviceStoreSnapshotIn extends SnapshotIn<typeof DeviceStoreModel> {}
export const createDeviceStoreDefaultModel = () => types.optional(DeviceStoreModel, {})
