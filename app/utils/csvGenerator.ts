import { Alert } from "react-native"
import { jsonToCSV } from "react-native-csv"
import * as FileSystem from "expo-file-system"
import Toast from "react-native-toast-message"
import { DatabaseService } from "../op-sql/databaseRepository"

const showToastCSV = () => {
  Toast.show({
    type: "info",
    text1: "Generating CSV 🔄",
    text2: "Wait for CSV generation👋",
  })
}

const create_csv_andSave = async (
  topics: string[],
  session_name: string,
  dbservice: DatabaseService,
  navigation: any,
): Promise<void> => {
  showToastCSV()

  const selectClauses = topics
    .map(
      (sensorType) =>
        `MAX(CASE WHEN sensor_type = '${sensorType}' THEN data END) AS data_${sensorType.replace("/", "_")}`,
    )
    .join(", ")

  const query = `
    SELECT 
        id,
        time,
        session_name,
        ${selectClauses}
    FROM 
        sensor_data
    WHERE
        session_name = '${session_name}'
    GROUP BY 
        id, time, session_name
    ORDER BY 
        id;
  `

  const results = await dbservice.executeQuery(query)
  const data = (results as any).rows

  if (data.length > 0) {
    const csvContent = jsonToCSV(data)
    try {
      // Request directory permissions from the user
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
      if (!permissions.granted) {
        Alert.alert("Permission Denied", "External storage access permission is required.")
        return
      }

      const directoryUri = permissions.directoryUri

      // Create a file in the selected directory
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri,
        `${session_name}.csv`,
        "text/csv",
      )

      // Write the CSV content to the created file
      await FileSystem.StorageAccessFramework.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      Alert.alert("Success", `CSV file written to: ${fileUri}`, [
        { text: "OK", onPress: () => navigation.navigate("Session") },
      ])
    } catch (error) {
      console.error("Error writing CSV to external storage:", error)
      Alert.alert("Error", "Failed to save CSV file. Please try again.")
    }
  } else {
    Alert.alert("Error", "No data found for CSV generation", [
      { text: "OK", onPress: () => navigation.navigate("Session") },
    ])
  }
}

export { create_csv_andSave }
