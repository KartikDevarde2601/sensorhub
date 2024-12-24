import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { FilesystemnodeStoreModel } from "./FilesystemnodeStore"
import { FilesystemnodeModel, FileType } from "./Filesystemnode"
import { DeviceStoreModel } from "./DeviceStore"
import { SessionStoreModel } from "./SessionStore"
import { TimerStore } from "./Timer"
import { MqttStore } from "./Mqtt"
import { MqttOptionsModel } from "./MqttOptions"

export const RootStoreModel = types.model("RootStore").props({
  devices: types.optional(DeviceStoreModel, {}),
  sessions: types.optional(SessionStoreModel, {}),
  timer: types.optional(TimerStore, {}),
  mqtt: types.optional(MqttStore, {
    clientId: "Mobileclient",
    host: "10.2.216.208",
    port: 1883,
    options: MqttOptionsModel.create({}),
  }),
  Filesystem: types.optional(FilesystemnodeStoreModel, {
    rootNode: FilesystemnodeModel.create({
      name: "Home",
      type: FileType.Directory,
      nodes: [],
      path: "",
      isSelected: false,
      isExpanded: false,
    }),
    selectedNodes: [],
  }),
})

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
