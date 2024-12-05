import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SessionModel } from "./Session"
import { Device } from "./Device"
import uuid from "react-native-uuid"

/**
 * Model description here for TypeScript hints.
 */
export const SessionStoreModel = types
  .model("SessionStore")
  .props({
    sessions: types.optional(types.array(SessionModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get sessionsForList() {
      return self.sessions
    },
  })) 
  .actions((self) => ({
    addSession(name: string, device: Device, description: string) {
      const newSession = SessionModel.create({
        id: uuid.v4(),
        sessionName: name,
        description: description,
        device: device, // Explicitly set the device reference
      });
       
      device.IncreseSession(device.id);
      self.sessions.push(newSession);
    },
    getSessionById(id: string) {
      return self.sessions.find((session) => session.id === id)
    }
  })) 

export interface SessionStore extends Instance<typeof SessionStoreModel> {}
export interface SessionStoreSnapshotOut extends SnapshotOut<typeof SessionStoreModel> {}
export interface SessionStoreSnapshotIn extends SnapshotIn<typeof SessionStoreModel> {}
export const createSessionStoreDefaultModel = () => types.optional(SessionStoreModel, {})
