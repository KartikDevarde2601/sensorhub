import { Instance, SnapshotIn, SnapshotOut, types, IAnyModelType } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export enum FileType {
  File = "file",
  Directory = "directory",
}

// Snapshot interface definition (before model creation)
export interface IFileSystemNodeSnapshot {
  id?: string
  name: string
  type?: FileType
  nodes?: IFileSystemNodeSnapshot[]
  path?: string
  isSelected?: boolean
  isExpanded?: boolean
}

// Create a separate actions type
export interface IFileSystemNodeActions {
  setPath: (newPath: string) => void
  toggleSelect: () => void
  addNode: (nodeData: IFileSystemNodeSnapshot) => Instance<typeof FilesystemnodeModel>
  removeNode: (id: string) => void
  updateName: (newName: string) => void
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

const hasFileExtension = (name: string): FileType => {
  const result = /\.[0-9a-z]+$/i.test(name)
  if (result) {
    return FileType.File
  } else {
    return FileType.Directory
  }
}

export const FilesystemnodeModel = types
  .model("Filesystemnode")
  .props({
    id: types.optional(types.identifier, () => generateId()),
    name: types.string,
    type: types.optional(types.enumeration(Object.values(FileType)), hasFileExtension(self.name)),
    nodes: types.optional(types.array(types.late((): IAnyModelType => FilesystemnodeModel)), []),
    path: types.optional(types.string, ""),
    isSelected: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({}))
  .actions((self) => ({
    setPath(newPath: string) {
      self.path = newPath
      if (self.type === "directory") {
        self.nodes.forEach((node) => {
          node.setPath(`${newPath}/${node.name}`)
        })
      }
    },
    toggleSelect() {
      self.isSelected = !self.isSelected
    },
    addNode(nodeData: IFileSystemNodeSnapshot) {
      const newNode: Filesystemnode = FilesystemnodeModel.create({
        ...nodeData,
      })
      self.nodes.push(newNode)
      return newNode
    },
    removeNode(id: string) {
      const index = self.nodes.findIndex((node) => node.id === id)
      if (index !== -1) {
        self.nodes.splice(index, 1)
      }
    },
    updateName(newName: string) {
      const oldPath = self.path
      const newPath = oldPath.replace(self.name, newName)
      self.name = newName
      if (self.type === "directory") {
        self.nodes.forEach((node) => {
          node.setPath(`${newPath}/${node.name}`)
        })
      }
    },
  }))

export interface Filesystemnode extends Instance<typeof FilesystemnodeModel> {}
export interface FilesystemnodeSnapshotOut extends SnapshotOut<typeof FilesystemnodeModel> {}
export interface FilesystemnodeSnapshotIn extends SnapshotIn<typeof FilesystemnodeModel> {}
