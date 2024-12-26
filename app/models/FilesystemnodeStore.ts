import { Instance, SnapshotIn, SnapshotOut, types, flow, IAnyModelType } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { FilesystemnodeModel, FileType, Filesystemnode } from "./Filesystemnode"
import * as FileSystem from "expo-file-system"

export const FilesystemnodeStoreModel = types
  .model("FilesystemnodeStore")
  .props({
    rootNode: FilesystemnodeModel,
    selectedNodes: types.optional(types.map(FilesystemnodeModel), {}),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get root(): Array<Filesystemnode> {
      return [self.rootNode]
    },
    get rootPath(): string {
      return self.rootNode.path
    },
  }))
  .actions((self) => ({
    addSelectedNode(node: Filesystemnode) {
      if (!self.selectedNodes.has(node.id)) {
        self.selectedNodes.set(node.id, node)
      }
    },
    removeSelectedNode(node: Filesystemnode) {
      self.selectedNodes.delete(node.id)
    },
    clearSelection() {
      self.selectedNodes.clear()
    },
    findNodeByPath(path: string): Filesystemnode | null {
      const findNode = (node: Filesystemnode, targetPath: string): Filesystemnode | null => {
        if (node.path.trim() === targetPath.trim()) return node
        for (const childNode of node.nodesArray) {
          const found = findNode(childNode, targetPath)
          if (found) return found
        }
        return null
      }
      return findNode(self.rootNode, path)
    },
  }))
  .actions((self) => ({
    createDirectory: flow(function* (parentPath: string, name: string) {
      console.log("parentPath", parentPath)
      const parent = self.findNodeByPath(parentPath)
      if (!parent) throw new Error("Parent directory not found")

      const newPath = parentPath + "/" + name.trim()

      try {
        yield FileSystem.makeDirectoryAsync(newPath, { intermediates: true })
        const isExist = parent.checkNodeExists(name)
        console.log("isExist", isExist)

        if (!isExist) {
          return parent.addNode({
            id: name,
            name,
            type: FileType.Directory,
            path: newPath,
          })
        } else {
          return parent.getNodeByName(name)
        }
      } catch (error) {
        console.error("Error creating directory:", error)
        throw error
      }
    }),

    createFile: flow(function* (parentPath: string, name: string, content: string = "") {
      const parent = self.findNodeByPath(parentPath)
      if (!parent) throw new Error("Parent directory not found")
      const newName = name.replace(/\//g, "_")
      const newPath = parentPath + "/" + `${newName}.csv`.trim()

      console.log("newPath", newPath)

      try {
        yield FileSystem.writeAsStringAsync(newPath, content, {
          encoding: FileSystem.EncodingType.UTF8,
        })
        return parent.addNode({
          id: name,
          name,
          type: FileType.File,
          path: newPath,
        })
      } catch (error) {
        console.error("Error creating file:", error)
        throw error
      }
    }),

    deleteNode: flow(function* (path: string) {
      const node = self.findNodeByPath(path)
      if (!node) throw new Error("Node not found")

      try {
        yield FileSystem.deleteAsync(path, { idempotent: true })
        const parentPath = path.split("/").slice(0, -1).join("/")
        const parent = self.findNodeByPath(parentPath)
        if (parent) {
          parent.removeNode(node.id)
        }
      } catch (error) {
        console.error("Error deleting node:", error)
        throw error
      }
    }),
    afterCreate: flow(function* () {
      const basePath = FileSystem.documentDirectory
      if (basePath) {
        const result = yield FileSystem.getInfoAsync(basePath + self.rootNode.name)
        if (!result.exists) {
          yield FileSystem.makeDirectoryAsync(basePath + self.rootNode.name, {
            intermediates: true,
          })
          self.rootNode.path = basePath + self.rootNode.name
        } else {
          self.rootNode.path = result.uri
        }
      }
    }),
  }))

export interface FilesystemnodeStore extends Instance<typeof FilesystemnodeStoreModel> {}
export interface FilesystemnodeStoreSnapshotOut
  extends SnapshotOut<typeof FilesystemnodeStoreModel> {}
export interface FilesystemnodeStoreSnapshotIn
  extends SnapshotIn<typeof FilesystemnodeStoreModel> {}
