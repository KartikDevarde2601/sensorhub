import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TouchableOpacity } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import {
  Screen,
  Text,
  ListView,
  EmptyState,
  Button,
  SessionItem,
  Modal,
  Icon,
  TextField,
  Dropdown,
  ListItem,
} from "@/components"
import { Session } from "@/models"
import { useAppTheme } from "@/utils/useAppTheme"
import { $styles } from "@/theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models"
import { useState } from "react"
import { colors } from "@/theme"
import { ThemedStyle } from "@/theme"
import { ContentStyle } from "@shopify/flash-list"
import { Device } from "@/models"

interface SessionScreenProps extends BottomNavigatorProps<"Session"> {}
interface TopicItemProps {
  device: Device
}

export const SessionScreen: FC<SessionScreenProps> = observer(function SessionScreen() {
  // Pull in one of our MST stores
  const { sessions, devices } = useStores()
  const [isModalVisible, setModalVisible] = useState(false)
  const [sessionName, setSessionName] = useState("")
  const [description, setDescription] = useState("")
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const navigation = useNavigation()

  const { themed, theme } = useAppTheme()

  const handleSaveSession = () => {
    if (!sessionName && !selectedDevice) {
      return
    }
    if (selectedDevice) {
      sessions.addSession(sessionName, selectedDevice, description)
    }
    setModalVisible(false)
  }

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device)
    setDropdownOpen(false)
  }

  const TopicItem: FC<TopicItemProps> = observer(function TopicItem({ device }) {
    return (
      <ListItem
        style={$itemContainer}
        bottomSeparator={true}
        text={device.name}
        onPress={() => handleDeviceSelect(device)}
      ></ListItem>
    )
  })

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <ListView<Session>
        contentContainerStyle={themed($listContentContainer)}
        estimatedItemSize={130}
        extraData={sessions.sessionsForList.length}
        data={sessions.sessionsForList.slice()}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            style={themed($emptyState)}
            heading="No Sessions Found"
            content="Add a new Session to get started Click Right Bottom Button"
          />
        }
        ListHeaderComponent={
          <View style={themed($heading)}>
            <Text text="Session List" preset="heading" />
          </View>
        }
        renderItem={({ item }) => (
          <SessionItem key={item.id} session={item} onPress={() => console.log("device item")} />
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
            <Text text="Add a New Session" preset="subheading" />
          </View>
          <TextField
            value={sessionName}
            onChangeText={(value) => setSessionName(value)}
            label="Session Name"
          />
          <TextField
            value={description}
            onChangeText={(value) => setDescription(value)}
            label="Session Description"
          />
          <Dropdown
            label="Select User"
            isOpen={isDropdownOpen}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            placeholder="Select User"
            selectedValue={selectedDevice?.name}
          />
          {isDropdownOpen ? (
            <View style={themed($devicelistContainer)}>
              <ListView<Device>
                extraData={devices?.devicesForList.length}
                data={devices?.devicesForList.slice()}
                renderItem={({ item }) => <TopicItem device={item} />}
                estimatedItemSize={56}
              />
            </View>
          ) : null}

          <View style={themed($buttonContainer)}>
            <Button
              preset="default"
              text="Close"
              onPress={() => setModalVisible(false)}
              style={themed($button)}
            />
            <Button
              preset="filled"
              text="Save Session"
              textStyle={{ color: colors.tint }}
              onPress={() => handleSaveSession()}
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

const $devicelistContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignContent: "center",
  marginTop: spacing.md,
  gap: spacing.sm,
  minHeight: 100,
})

const $modalContent: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral200,
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

const $itemContainer: ViewStyle = {
  alignItems: "center",
}

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
