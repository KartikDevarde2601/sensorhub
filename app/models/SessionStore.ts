import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SessionModel } from "./Session"

/**
 * Model description here for TypeScript hints.
 */
export const SessionStoreModel = types
  .model("SessionStore")
  .props({
    sessions: types.optional(types.array(SessionModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface SessionStore extends Instance<typeof SessionStoreModel> {}
export interface SessionStoreSnapshotOut extends SnapshotOut<typeof SessionStoreModel> {}
export interface SessionStoreSnapshotIn extends SnapshotIn<typeof SessionStoreModel> {}
export const createSessionStoreDefaultModel = () => types.optional(SessionStoreModel, {})
