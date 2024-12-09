import {
  types,
  flow,
  Instance,
  destroy,
  SnapshotOut,
  SnapshotIn
} from "mobx-state-tree";
import { createMqttClient, MqttConfig } from "@d11/react-native-mqtt";
import { TopicModel } from "./Topic";
import { MqttClient } from "@d11/react-native-mqtt/dist/Mqtt/MqttClient";
import { MqttOptionsModel } from "./MqttOptions";

// Enum for connection status
export enum ConnectionStatus {
  IDLE = "IDLE",
  INITIALIZING = "INITIALIZING",
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  ERROR = "ERROR"
}

// Enum for QoS levels
export enum MqttQos {
  AT_MOST_ONCE = 0,
  AT_LEAST_ONCE = 1,
  EXACTLY_ONCE = 2
}

// MQTT Store Model
export const MqttStore = types
  .model("MqttStore")
  .props({
    clientId: types.string,
    host: types.string,
    port: types.optional(types.number, 1883),
    options: types.optional(MqttOptionsModel, {}),
    status: types.optional(
      types.enumeration("ConnectionStatus", Object.values(ConnectionStatus)),
      ConnectionStatus.IDLE
    ),
    topics: types.map(TopicModel),
    errorMessage: types.maybeNull(types.string)
  })
  .volatile(self => ({
    client: null as MqttClient | null
  }))
  .actions(self => {
    const initializeClient = flow(function* () {
      if (self.client) {
        return self.client;
      }

      // Prevent multiple initializations
      if (self.status === ConnectionStatus.INITIALIZING) {
        return;
      }

      if (self.clientId === "" || self.host === "") {
        self.status = ConnectionStatus.ERROR;
        self.errorMessage = "Client ID and host are required";
        return;
      }

      try {
        // Update status to initializing
        self.status = ConnectionStatus.INITIALIZING;

        // Configuration for MQTT client
        const config: MqttConfig = {
          clientId: self.clientId,
          host: self.host,
          port: self.port,
          options: self.options
        };

        // Create client (assuming createMqttClient might return a promise)
        self.client = yield createMqttClient(config);

        // Update status
        self.status = ConnectionStatus.DISCONNECTED;

        return self.client;
      } catch (error) {
        // Handle initialization error
        self.status = ConnectionStatus.ERROR;
        self.errorMessage =
          error instanceof Error ? error.message : "Failed to initialize MQTT client";

        throw error;
      }
    });

    const connect = flow(function* (): Generator<any, void, any> {
      if (!self.client) {
        return;
      }

      try {
        // Update status to connecting
        self.status = ConnectionStatus.CONNECTING;

        // Connect the client
        yield self.client.connect();

        // Update status to connected
        self.status = ConnectionStatus.CONNECTED;
      } catch (error) {
        self.status = ConnectionStatus.ERROR;
        self.errorMessage =
          error instanceof Error ? error.message : "Connection failed";
      }
    });

    const disconnect = flow(function* () {
      if (!self.client) {
        return;
      }

      try {
        // Disconnect the client
        self.client.disconnect();

        // Reset status
        self.status = ConnectionStatus.DISCONNECTED;
      } catch (error) {
        self.status = ConnectionStatus.ERROR;
        self.errorMessage =
          error instanceof Error ? error.message : "Disconnect failed";
      }
    });

    const cleanup = () => {
      // Disconnect and remove client
      if (self.client) {
        try {
          self.client.disconnect();
          self.client.remove();
          console.log("MQTT client removed");
        } catch (error) {
          console.error("Error during MQTT cleanup:", error);
        }

        // Clear client reference
        self.client = null;
      }

      // Reset store state
      self.status = ConnectionStatus.IDLE;
    };

    const editConfig = (data: Partial<MqttConfig>) => {
      Object.keys(data).forEach(key => {
        (self as any)[key] = data[key as keyof MqttConfig];
      });

      cleanup();
      initializeClient();
    };

    return {
      initializeClient,
      connect,
      disconnect,
      cleanup,
      editConfig
    };
  })
  .views(self => ({
    get isConnected() {
      return self.status === ConnectionStatus.CONNECTED;
    }
  })).actions(self => ({
    beforeDestroy() {
      self.cleanup();
    }
  }));

export interface Mqtt extends Instance<typeof MqttStore> {}
export interface MqttSnapshotOut extends SnapshotOut<typeof MqttStore> {}
export interface MqttSnapshotIn extends SnapshotIn<typeof MqttStore> {}
