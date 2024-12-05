import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { DeviceModel } from "./Device"

/**
 * Model description here for TypeScript hints.
 */
export const SessionModel = types
  .model("Session")
  .props({
    id: types.identifier,
    sessionName: types.string,
    description : types.string,
    createdAt: types.optional(types.Date, () => new Date()),
    device: types.late((): any => types.reference(DeviceModel)), // Explicitly typed return value
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get deviceName() {
      return self.device.name
    },
    get deviceTopicsNumber(){
      return self.device.numTopics
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Session extends Instance<typeof SessionModel> {}
export interface SessionSnapshotOut extends SnapshotOut<typeof SessionModel> {}
export interface SessionSnapshotIn extends SnapshotIn<typeof SessionModel> {}
