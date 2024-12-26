import * as FileSystem from "expo-file-system"
import { zip } from "react-native-zip-archive"
import { FileType } from "@/models"
import Toast from "react-native-toast-message"
const { StorageAccessFramework } = FileSystem

const showToastCSV = (type: string, text1: string, text2: string) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
  })
}

export const handleLongPress = async (type: string, name: string, path: string) => {
  try {
    if (type !== FileType.Directory) {
      showToastCSV("error", "Error", "Only directories can be zipped")
      Promise.resolve()
    }

    if (!FileSystem.documentDirectory) {
      showToastCSV("error", "Error", "Document directory is not available")
      Promise.resolve()
    }

    const fileName = name.trim()
    const targetPath = `${FileSystem.documentDirectory}${fileName}.zip`

    const sourceInfo = await FileSystem.getInfoAsync(path)
    if (!sourceInfo.exists) {
      showToastCSV("error", "Error", "Source directory does not exist")
      Promise.resolve()
      return
    }

    try {
      await zip(path, targetPath)

      const zipInfo = await FileSystem.getInfoAsync(targetPath)
      if (!zipInfo.exists) {
        showToastCSV("error", "Error", "Failed to create zip file")
        Promise.resolve()
        return
      }

      const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync()
      if (!permission.granted) {
        showToastCSV("error", "Error", "Permission denied")
        Promise.resolve()
        return
      }

      const baseUri = permission.directoryUri

      try {
        const fileContent = await FileSystem.readAsStringAsync(targetPath, {
          encoding: FileSystem.EncodingType.Base64,
        })

        const destinationUri = await StorageAccessFramework.createFileAsync(
          baseUri,
          `${fileName}.zip`,
          "application/zip",
        )

        await StorageAccessFramework.writeAsStringAsync(destinationUri, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        })

        await FileSystem.deleteAsync(targetPath, { idempotent: true })

        showToastCSV("success", "Success", "Zip file created successfully")
      } catch (saveError) {
        showToastCSV("error", "Error", "Failed to save zip file")
      }
    } catch (zipError) {
      showToastCSV("error", "Error", "Failed to create zip) file")
    }
  } catch (error) {
    throw error
  }
}
