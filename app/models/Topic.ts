import { getParent, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { sensorRepository } from "../op-sql/sensorRepository"
import { TABLE } from "@/op-sql/db_table"

/**
 * Model description here for TypeScript hints.
 */
const sensor = new sensorRepository()

export const TopicModel = types
  .model("Topic")
  .props({
    id: types.identifier,
    topicName: types.string,
    Issubscribed: types.optional(types.boolean, false),
    error: types.optional(types.string, ""),
    message: types.optional(types.string, ""),
    isMessageDisplay: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({}))
  .actions((self) => ({
    getTopicName() {
      return self.topicName
    },
    deleteTopic() {
      const parent = getParent(self, 2) as { deleteTopic: (topic: Topic) => void }
      parent.deleteTopic(self as Topic)
    },
    updateSubcriptionStats() {
      self.Issubscribed = !self.Issubscribed
    },
    updateMessageDisplay() {
      self.isMessageDisplay = !self.isMessageDisplay
    },
    addMessage(message: string, sessionName: string) {
      if (self.isMessageDisplay) {
        self.message = message
      }
      const data = {
        session_name: sessionName,
        sensor_type: self.topicName,
        data: message,
      }
      sensor.insertSensordata(data, TABLE.sensor_data)
    },
    addError(error: string) {
      self.error = error
    },
  }))
export interface Topic extends Instance<typeof TopicModel> {}
export interface TopicSnapshotOut extends SnapshotOut<typeof TopicModel> {}
export interface TopicSnapshotIn extends SnapshotIn<typeof TopicModel> {}
