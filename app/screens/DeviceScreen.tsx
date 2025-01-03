import { FC, useEffect, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import {
  DeviceItem,
  Button,
  Icon,
  Text,
  Screen,
  Modal,
  TextField,
  ListView,
  EmptyState,
} from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useState } from "react"
import { useStores } from "@/models"
import { $styles } from "../theme"
import { Device } from "@/models/Device"
import { type ContentStyle } from "@shopify/flash-list"
import { DatabaseService } from "@/op-sql/databaseRepository"
import * as FileSystem from "expo-file-system"
import { jsonToCSV } from "react-native-csv"

interface DeviceScreenProps extends BottomNavigatorProps<"Device"> {}

export const DeviceScreen: FC<DeviceScreenProps> = observer(function DeviceScreen(_props) {
  const { themed, theme } = useAppTheme()

  const { devices } = useStores()

  const { navigation } = _props

  const [isModalVisible, setModalVisible] = useState(false)
  const [deviceName, setDeviceName] = useState("")

  const dbService = useMemo(() => DatabaseService.getInstance(), [])

  const handleSaveDevice = () => {
    if (!deviceName) {
      return
    }
    devices.addDevice(deviceName)
    setModalVisible(false)
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <ListView<Device>
        contentContainerStyle={themed($listContentContainer)}
        estimatedItemSize={130}
        extraData={devices.devicesForList.length}
        data={devices.devicesForList.slice()}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            style={themed($emptyState)}
            heading="No Devices Found"
            content="Add a new device to get started Click Right Bottom Button"
          />
        }
        ListHeaderComponent={
          <View style={themed($heading)}>
            <Text text="Devices List" preset="heading" />
          </View>
        }
        renderItem={({ item }) => (
          <DeviceItem key={item.id} device={item} onPress={() => console.log("device item")} />
        )}
      />
      <Button
        RightAccessory={(props) => (
          <Icon
            icon="plus"
            style={props.style}
            size={props.pressableState.pressed ? 35 : 30}
            color={props.pressableState.pressed ? colors.tintactive : colors.tint}
          />
        )}
        preset="default"
        style={[$fab, { backgroundColor: theme.colors.palette.primary100 }]}
        pressedStyle={$fabpress}
        onPress={() => setModalVisible(true)}
      />
      <Modal isopen={isModalVisible} withInput={true}>
        <View style={themed($modalContent)}>
          <View style={{ flexDirection: "row", alignContent: "center" }}>
            <Icon icon="device" size={30} color={colors.tint} style={{ marginRight: 10 }} />
            <Text text="Add a New Device" preset="subheading" />
          </View>
          <TextField
            value={deviceName}
            onChangeText={(value) => setDeviceName(value)}
            label="Device Name"
            inputWrapperStyle={{ backgroundColor: colors.palette.neutral100 }}
            helper="ex: Living Room"
          />
          <View style={themed($buttonContainer)}>
            <Button
              preset="default"
              text="Close"
              textStyle={{ color: colors.tint }}
              onPress={() => setModalVisible(false)}
              style={themed($button)}
            />
            <Button
              preset="filled"
              text="Save Device"
              textStyle={{ color: colors.tint }}
              onPress={() => handleSaveDevice()}
              style={themed($button)}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

// #region Styles
const $listContentContainer: ThemedStyle<ContentStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xl,
  paddingBottom: spacing.md,
})

const $modalContent: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  width: "100%",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  borderRadius: spacing.md,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  flexDirection: "row",
  justifyContent: "space-between",
})

const $button: ThemedStyle<ViewStyle> = () => ({
  borderRadius: 24,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $fab: ViewStyle = {
  position: "absolute",
  bottom: 16,
  right: 24,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}

const $fabpress: ViewStyle = {
  backgroundColor: colors.palette.primary200,
}
