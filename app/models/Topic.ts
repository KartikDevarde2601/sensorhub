import { getParent, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry"

/**
 * Model description here for TypeScript hints.
 */
export const TopicModel = types
  .model("Topic")
  .props({
    id: types.identifier,
    topicName: types.string,
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
  })) 
export interface Topic extends Instance<typeof TopicModel> {}
export interface TopicSnapshotOut extends SnapshotOut<typeof TopicModel> {}
export interface TopicSnapshotIn extends SnapshotIn<typeof TopicModel> {}

