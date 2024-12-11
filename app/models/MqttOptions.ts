import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */

export const MqttOptionsModel = types
  .model("MqttOptions")
  .props({
    clientId: types.optional(types.string, Math.random().toString(36).substring(7)),
    autoReconnect: types.optional(types.boolean, true),
    retryCount: types.optional(types.number, 3),
    cleanSession: types.optional(types.boolean, true),
    keepAlive: types.optional(types.number, 60),
    protocol: types.optional(types.string, "mqtt"),
    maxInFlightMessages: types.optional(types.number, 1),
    username: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({}))
  .actions((self) => ({
    edit(data: Partial<MqttOptions>) {
      Object.keys(data).forEach((key) => {
        ;(self as any)[key as keyof MqttOptions] = data[key as keyof MqttOptions]
      })
    },
  }))

export interface MqttOptions extends Instance<typeof MqttOptionsModel> {}
export interface MqttOptionsSnapshotOut extends SnapshotOut<typeof MqttOptionsModel> {}
export interface MqttOptionsSnapshotIn extends SnapshotIn<typeof MqttOptionsModel> {}
