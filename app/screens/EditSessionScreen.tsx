import { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text, Dropdown, ListItem, TextField, ListView, Button } from "@/components"
import { Session } from "@/models"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { useStores } from "@/models"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
import { $styles } from "../theme"
import { Device } from "@/models"

interface TopicItemProps {
  device: Device
}

interface EditSessionScreenProps extends AppStackScreenProps<"EditSession"> {}

export const EditSessionScreen: FC<EditSessionScreenProps> = observer(function EditSessionScreen() {
  const route = useRoute<RouteProp<{ EditSession: { session_id?: string } }, "EditSession">>()
  const { devices, sessions } = useStores()
  const [session, setSession] = useState<Session | null>(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [sessionName, setSessionName] = useState(session?.sessionName || "")
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [description, setDescription] = useState(session?.description || "")
  const [selectedDevice, setSelectedDevice] = useState(session?.device || null)
  // Pull in navigation via hook
  const navigation = useNavigation()

  useEffect(() => {
    if (route.params?.session_id) {
      const session = sessions.getSessionById(route.params.session_id)
      if (session) {
        setSession(session)
      }
    }
  }, [route.params?.session_id])

  useEffect(() => {
    if (session) {
      setSessionName(session.sessionName || "")
      setDescription(session.description || "")
      setSelectedDevice(session.device || null)
    }
  }, [session])

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device)
    setDropdownOpen(false)
  }

  const handleSaveSession = () => {
    session?.updateSession(sessionName, description, selectedDevice)
    navigation.goBack()
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
    <Screen
      preset="scroll"
      contentContainerStyle={themed([$screenContentContainer, $styles.flex1])}
    >
      <Text text="Edit Session" preset="heading" />
      <View style={themed($container)}>
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
          label="Select Device"
          isOpen={isDropdownOpen}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
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
    </Screen>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
})

const $devicelistContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignContent: "center",
  marginTop: spacing.md,
  gap: spacing.sm,
  minHeight: 100,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
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
