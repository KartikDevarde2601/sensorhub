import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TouchableOpacity } from "react-native"
import { useState } from "react"
import { AppStackScreenProps } from "@/navigators"
import {
  Screen,
  Text,
  TextField,
  ListItem,
  Icon,
  Button,
  ListView,
  EmptyState,
  Modal,
} from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { FlashList } from "@shopify/flash-list"
import { useStores } from "@/models"
import { Topic } from "@/models/Topic"
import { useEffect } from "react"
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native"
import { Device } from "@/models"

interface AddDeviceScreenProps extends AppStackScreenProps<"AddDevice"> {}

interface TopicItemProps {
  topic: Topic
}

export const AddDeviceScreen: FC<AddDeviceScreenProps> = observer(function AddDeviceScreen() {
  const { devices } = useStores()
  const route = useRoute<RouteProp<{ AddDevice: { device_id?: string } }, "AddDevice">>()
  const navigation = useNavigation()
  const [device, setDevice] = useState<Device | null>(null)
  const [deviceName, setDeviceName] = useState("")

  const [isModalVisible, setModalVisible] = useState(false)
  const [topicName, setTopicName] = useState("")

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const handleSaveDevice = () => {
    console.log("device saved")
  }

  const handleAddTopic = () => {
    const prefix = device?.name.trim().toLocaleLowerCase()

    if (!topicName) {
      return
    }
    const postfix = topicName.trim().toLocaleLowerCase()
    const topic = `${prefix}/${postfix}`
    device?.addTopic(topic)
    setTopicName("")
    setModalVisible(false)
  }

  useEffect(() => {
    if (route.params?.device_id) {
      const device = devices.getDeviceById(route.params.device_id)
      if (device) {
        setDevice(device)
      }
    }
  }, [route.params?.device_id])

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <Text text="Edit Device Config" preset="heading" />
      <View style={themed($inputContainer)}>
        <TextField
          value={device?.name}
          onChangeText={(value) => setDeviceName(value)}
          label="Device Name"
          helper="ex: Living Room"
        />
      </View>
      <View style={themed($topicContainer)}>
        <ListView<Topic>
          extraData={device?.topicsForList.length}
          data={device?.topicsForList.slice()}
          renderItem={({ item }) => <TopicItem topic={item} />}
          estimatedItemSize={56}
          ListHeaderComponent={
            <View style={themed($heading)}>
              <Text text="Topic List" preset="subheading" />
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              preset="generic"
              style={themed($emptyState)}
              heading="No topics Found"
              content="Add a new topic to get started"
              button={device && device.topicsForList?.length === 0 ? "" : undefined}
            />
          }
        />
        <View style={themed($buttonContainer)}>
          <Button
            preset="default"
            text="Add Topic"
            onPress={() => setModalVisible(true)}
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
      <Modal isopen={isModalVisible} withInput={true}>
        <View style={themed($modalContent)}>
          <View style={{ flexDirection: "row", alignContent: "center" }}>
            <Icon icon="device" size={30} color={colors.tint} style={{ marginRight: 10 }} />
            <Text text="Add a New Topic" preset="subheading" />
          </View>
          <TextField
            value={topicName}
            onChangeText={(value) => setTopicName(value)}
            label="Topic Name"
            helper="ex: temperature"
          />
          <View style={themed($buttonContainer)}>
            <Button
              preset="default"
              text="Close"
              onPress={() => setModalVisible(false)}
              style={themed($button)}
            />
            <Button
              preset="filled"
              text="Add Topic"
              textStyle={{ color: colors.tint }}
              onPress={() => handleAddTopic()}
              style={themed($button)}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

const TopicItem: FC<TopicItemProps> = observer(function TopicItem({ topic }) {
  return (
    <ListItem
      style={$itemContainer}
      bottomSeparator={true}
      text={topic.topicName}
      RightComponent={
        <TouchableOpacity>
          <Icon icon="crossDelete" color="red" onPress={() => topic.deleteTopic()} />
        </TouchableOpacity>
      }
    ></ListItem>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
})

const $inputContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $topicContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  marginTop: spacing.md,
  gap: spacing.sm,
  minHeight: 100,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  flexDirection: "row",
  justifyContent: "space-between",
})

const $button: ThemedStyle<ViewStyle> = () => ({
  borderRadius: 24,
})
const $itemContainer: ViewStyle = {
  alignItems: "center",
}

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $modalContent: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral200,
  width: "100%",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  borderRadius: spacing.md,
})
