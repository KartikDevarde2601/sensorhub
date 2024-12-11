import { DB } from "@op-engineering/op-sqlite"
import { DatabaseService } from "./databaseRepository"
import { TABLE } from "./db_table"

export interface sensor_data {
  session_name: string
  sensor_type: string
  data: string
}

export class sensorRepository {
  private db: DatabaseService

  constructor() {
    this.db = DatabaseService.getInstance()
  }

  async insertSensordata<T>(data: sensor_data, tablename: string): Promise<T[]> {
    const query = `INSERT INTO ${tablename} (session_name, sensor_type, data) VALUES (?, ?, ?)`
    if (this.db) {
      const result = await this.db.executeQuery(query, [
        data.session_name,
        data.sensor_type,
        data.data,
      ])
      return result as T[]
    } else {
      return []
    }
  }
}
