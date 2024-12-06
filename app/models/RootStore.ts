import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { DeviceStoreModel } from "./DeviceStore"
import { SessionStoreModel } from "./SessionStore"
import { TimerStore } from "./Timer"
import { configure } from 'mobx'
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    devices: types.optional(DeviceStoreModel, {}),
    sessions: types.optional(SessionStoreModel, {}),
    timer: types.optional(TimerStore, {}),
})

// In your root setup file


// configure({
//   enforceActions: 'always',
//   computedRequiresReaction: true,
//   reactionRequiresObservable: true,
//   observableRequiresReaction: true,
//   disableErrorBoundaries: false
// })

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
