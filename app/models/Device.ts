import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { TopicModel } from "./Topic"
import uuid from "react-native-uuid"

/**
 * Model description here for TypeScript hints.
 */
export const DeviceModel = types
  .model("Device")
  .props({
    id: types.identifier,
    name: types.string,
    createdAt: types.optional(types.Date, () => new Date()),
    topics: types.optional(types.array(TopicModel), []),
    sessions: types.optional(types.number, 0),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get numTopics() {
      return self.topics.length
    },

    get topicsForList() {
      return self.topics
    },
  }))
  .actions((self) => ({
    addTopic(name: string) {
      const newTopic = TopicModel.create({ id: uuid.v4(), topicName: name })
      self.topics.push(newTopic)
    },
    IncreseSession(deviceId: string) {
      if (deviceId == self.id) {
        self.sessions += 1
      }
    },
    DecreseSession(deviceId: string) {
      if (deviceId == self.id) {
        self.sessions -= 1
      }
    },
    deleteTopic(topic: Instance<typeof TopicModel>) {
      self.topics.remove(topic)
    },
  }))

export interface Device extends Instance<typeof DeviceModel> {}
export interface DeviceSnapshotOut extends SnapshotOut<typeof DeviceModel> {}
export interface DeviceSnapshotIn extends SnapshotIn<typeof DeviceModel> {}
