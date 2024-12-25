import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { FilesystemnodeModel, IFileSystemNodeActions, FileType } from "./Filesystemnode"
import * as FileSystem from "expo-file-system"
const { StorageAccessFramework } = FileSystem

export interface IFileSystemNode
  extends Instance<typeof FilesystemnodeModel>,
    IFileSystemNodeActions {}

export const FilesystemnodeStoreModel = types
  .model("FilesystemnodeStore")
  .props({
    rootNode: FilesystemnodeModel,
    selectedNodes: types.array(types.reference(FilesystemnodeModel)),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get root(): Array<IFileSystemNode> {
      return [self.rootNode]
    },
    get rootPath(): string {
      return self.rootNode.path
    },
  }))
  .actions((self) => ({
    addSelectedNode(node: IFileSystemNode) {
      if (!self.selectedNodes.includes(node)) {
        self.selectedNodes.push(node)
      }
    },
    removeSelectedNode(node: IFileSystemNode) {
      const index = self.selectedNodes.indexOf(node)
      if (index !== -1) {
        self.selectedNodes.splice(index, 1)
      }
    },
    clearSelection() {
      self.selectedNodes.clear()
    },
    findNodeByPath(path: string): IFileSystemNode | null {
      const findNode = (node: IFileSystemNode, targetPath: string): IFileSystemNode | null => {
        if (node.path.trim() === targetPath.trim()) return node
        for (const childNode of node.nodes) {
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
        return parent.addNode({
          name,
          type: FileType.Directory,
          path: newPath,
          nodes: [],
        })
      } catch (error) {
        console.error("Error creating directory:", error)
        throw error
      }
    }),

    createFile: flow(function* (parentPath: string, name: string, content: string = "") {
      const parent = self.findNodeByPath(parentPath)
      if (!parent) throw new Error("Parent directory not found")

      const newPath = parentPath + "/" + `${name}.csv`.trim()

      try {
        yield FileSystem.writeAsStringAsync(newPath, content)
        return parent.addNode({
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

    moveNode: flow(function* (sourcePath: string, destinationPath: string) {
      const sourceNode = self.findNodeByPath(sourcePath)
      if (!sourceNode) throw new Error("Source node not found")

      try {
        yield FileSystem.moveAsync({
          from: sourcePath,
          to: destinationPath,
        })

        const newName = destinationPath.split("/").pop()!
        sourceNode.updateName(newName)
      } catch (error) {
        console.error("Error moving node:", error)
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
