import { jsonToCSV } from "react-native-csv"
import Toast from "react-native-toast-message"
import { DatabaseService } from "../op-sql/databaseRepository"
import { FilesystemnodeStore } from "@/models"
import { ContructPath } from "@/utils/fileUtils"

const showToastCSV = () => {
  Toast.show({
    type: "info",
    text1: "Generating CSV 🔄",
    text2: "Wait for CSV generation👋",
  })
}

const getQuery = (topic: string, sessionName: string): string => {
  return `
    SELECT * FROM sensor_data
    WHERE session_name = '${sessionName}' AND sensor_type = '${topic}'`
}

const create_csv_andSave = async (
  topics: string[],
  sessionName: string,
  deviceName: string,
  dbservice: DatabaseService,
  navigation: any,
  FileSystem: FilesystemnodeStore,
): Promise<void> => {
  showToastCSV()
  const parentPath = ContructPath(FileSystem.rootPath, deviceName, sessionName)
  console.log("parentPath", parentPath)

  try {
    await Promise.all(
      topics.map(async (topic) => {
        const query = getQuery(topic, sessionName)
        const results = await dbservice.executeQuery(query)
        const data = (results as any).rows
        if (data.length > 0) {
          const csvContent = jsonToCSV(data)
          await FileSystem.createFile(parentPath, topic, csvContent)
        }
      }),
    )
    Toast.show({
      type: "success",
      text1: "CSV Generation Complete ✅",
      text2: "CSV files have been generated successfully.",
    })
  } catch (error) {
    console.error("Error generating CSV:", error)
    Toast.show({
      type: "error",
      text1: "CSV Generation Failed ❌",
      text2: "An error occurred during CSV generation.",
    })
  }
}

export { create_csv_andSave }
