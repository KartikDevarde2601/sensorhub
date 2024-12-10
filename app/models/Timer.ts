import { types, Instance, SnapshotOut, SnapshotIn } from "mobx-state-tree"

export const TimerStore = types
  .model({
    time: types.optional(types.number, 0), // Current time in seconds
    isRunning: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get formattedTime() {
      const hours = Math.floor(self.time / 3600)
      const minutes = Math.floor((self.time % 3600) / 60)
      const seconds = self.time % 60
      return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, "0")).join(":")
    },
  }))
  .actions((self) => ({
    start() {
      self.isRunning = true
    },
    stop() {
      self.isRunning = false
    },
    reset() {
      self.time = 0
      self.isRunning = false
    },
    incrementTime(amount: number) {
      self.time += amount
    },
  }))

export interface Timer extends Instance<typeof TimerStore> {}
export interface TimerSnapshotOut extends SnapshotOut<typeof TimerStore> {}
export interface TimerSnapshotIn extends SnapshotIn<typeof TimerStore> {}
