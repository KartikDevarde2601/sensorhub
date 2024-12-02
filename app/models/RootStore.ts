import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { DeviceStoreModel } from "./DeviceStore"
import { SessionStoreModel } from "./SessionStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
