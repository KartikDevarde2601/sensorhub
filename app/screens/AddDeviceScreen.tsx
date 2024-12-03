import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TouchableOpacity } from "react-native"
import { useState } from "react"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text, TextField, ListItem, Icon, Button } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { id } from "date-fns/locale"
import { FlashList } from "@shopify/flash-list"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface AddDeviceScreenProps extends AppStackScreenProps<"AddDevice"> {}
interface Topic {
  topic: string
}

interface TopicItemProps {
  topic: Topic
}

export const AddDeviceScreen: FC<AddDeviceScreenProps> = observer(function AddDeviceScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const [deviceName, setDeviceName] = useState("")
  const [topic, setTopic] = useState("")

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const data = [
    {
      topic: "lovingroom/temperature",
      id: "1",
    },
    {
      topic: "lovingroom/humidity",
      id: "2",
    },
  ]

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <Text text="Add a New Device" preset="heading" />
      <View style={themed($inputContainer)}>
        <TextField
          value={deviceName}
          onChangeText={(value) => setDeviceName(value)}
          label="Device Name"
          helper="ex: Living Room"
        />
      </View>
      <View style={themed($topicContainer)}>
        <Text text="Topies" preset="subheading" />
        <FlashList
          data={data}
          renderItem={({ item }) => <TopicItem topic={item} />}
          keyExtractor={(item) => item.id}
          estimatedItemSize={56}
        />
        <View style={themed($buttonContainer)}>
          <Button
            preset="default"
            text="Add Topic"
            onPress={() => console.log("topic added")}
            style={themed($button)}
          />
          <Button
            preset="filled"
            text="Save Device"
            textStyle={{ color: colors.tint }}
            onPress={() => console.log("device saved")}
            style={themed($button)}
          />
        </View>
      </View>
    </Screen>
  )
})

const TopicItem: FC<TopicItemProps> = observer(function TopicItem({ topic }) {
  return (
    <ListItem
      style={$itemContainer}
      bottomSeparator={true}
      text={topic.topic}
      RightComponent={
        <TouchableOpacity>
          <Icon icon="crossDelete" color="red" onPress={() => console.log("topic deleted")} />
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
