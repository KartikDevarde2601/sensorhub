import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const DeviceModel = types
  .model("Device")
  .props({
    name: types.string,
    createdAt: types.optional(types.Date, new Date()),
    topics: types.optional(types.array(types.string), []),
    sessions: types.optional(types.array(types.string), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get numTopics() {
      return self.topics.length
    },
    get numSessions() {
      return self.sessions.length
    },
  }))
  .actions((self) => ({
    addTopic(topic: string) {
      self.topics.push(topic)
    },
    addSession(session: string) {
      self.sessions.push(session)
    },
  }))

export interface Device extends Instance<typeof DeviceModel> {}
export interface DeviceSnapshotOut extends SnapshotOut<typeof DeviceModel> {}
export interface DeviceSnapshotIn extends SnapshotIn<typeof DeviceModel> {}
