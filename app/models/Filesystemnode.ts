import { Instance, SnapshotIn, SnapshotOut, types, IAnyModelType, getParent } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export enum FileType {
  File = "file",
  Directory = "directory",
}

export const FilesystemnodeModel = types
  .model("Filesystemnode")
  .props({
    id: types.identifier,
    name: types.string,
    type: types.enumeration(Object.values(FileType)),
    nodes: types.optional(types.map(types.late((): IAnyModelType => FilesystemnodeModel)), {}),
    path: types.optional(types.string, ""),
    isSelected: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get nodesArray() {
      return Array.from(self.nodes.values())
    },
  }))
  .actions((self) => ({
    setPath(newPath: string) {
      self.path = newPath
      if (self.type === FileType.Directory) {
        self.nodes.forEach((node) => {
          node.setPath(`${newPath}/${node.name}`)
        })
      }
    },
    toggleSelect() {
      self.isSelected = !self.isSelected
    },
    addNode(nodeData: FilesystemnodeSnapshotIn) {
      const newNode: Filesystemnode = FilesystemnodeModel.create({
        ...nodeData,
      })
      self.nodes.set(newNode.id, newNode)
      return newNode
    },
    removeNode(id: string) {
      self.nodes.delete(id)
    },
    checkNodeExists(name: string): boolean {
      return self.nodes.has(name)
    },
    getNodeByName(name: string): Filesystemnode | undefined {
      return self.nodes.get(name)
    },
    updateIsSelected() {
      self.isSelected = !self.isSelected
    },
  }))

export interface Filesystemnode extends Instance<typeof FilesystemnodeModel> {}
export interface FilesystemnodeSnapshotOut extends SnapshotOut<typeof FilesystemnodeModel> {}
export interface FilesystemnodeSnapshotIn extends SnapshotIn<typeof FilesystemnodeModel> {}
