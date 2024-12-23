import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { FilesystemnodeStoreModel } from "./FilesystemnodeStore"
import { FilesystemnodeModel, FileType } from "./Filesystemnode"
import { DeviceStoreModel } from "./DeviceStore"
import { SessionStoreModel } from "./SessionStore"
import { TimerStore } from "./Timer"
import { MqttStore } from "./Mqtt"
import { configure } from "mobx"
import { MqttOptionsModel } from "./MqttOptions"
import * as FileSystem from "expo-file-system"

/**
 * A RootStore model.
 */

const createDirectory = async (dirName: string): Promise<string> => {
  try {
    const basePath = FileSystem.documentDirectory // Base path for the file system
    const fullPath = `${basePath}${dirName}` // Construct the full path
    await FileSystem.makeDirectoryAsync(fullPath, { intermediates: true })
    return fullPath // Return the full path
  } catch (error) {
    throw new Error(`Failed to create directory: ${error}`)
  }
}

export const RootStoreModel = types
  .model("RootStore")
  .props({
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
        name: "home",
        type: FileType.Directory,
        nodes: [],
        path: "",
        isSelected: false,
        isExpanded: false,
      }),
      selectedNodes: [],
    }),
  })
  .actions((self) => ({
    async afterCreate() {
      const result = await self.mqtt.initializeClient()
      const directoryPath = await createDirectory("home")
      const path = self.Filesystem.rootNode.setPath(directoryPath)
    },
  }))

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
