export const ContructPath = (path: string, deviceName?: string, sessionName?: string): string => {
  let newPath = path
  if (deviceName) {
    newPath = newPath + "/" + deviceName
  }
  if (sessionName) {
    newPath = newPath + "/" + sessionName
  }
  return newPath.trim()
}
