import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { Screen, ListView, EmptyState, ListItem, Icon, Text } from "@/components"
import { $styles } from "../theme"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { type ContentStyle } from "@shopify/flash-list"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface FileScreenProps extends BottomNavigatorProps<"File"> {}

export const FileScreen: FC<FileScreenProps> = observer(function FileScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { themed, theme } = useAppTheme()

  let files = [
    {
      name: "file1",
      files: [
        { name: "file11", files: [{ name: "file111" }, { name: "file112" }] },
        { name: "file12" },
      ],
    },
    { name: "file2" },
    { name: "file3", files: [{ name: "file31" }, { name: "file32" }] },
    { name: "file4" },
    { name: "file5" },
    { name: "file6" },
    { name: "file7" },
    { name: "file8" },
    { name: "file9" },
    { name: "file10" },
  ]

  const RenderItem = (item: string, style?: ViewStyle) => {
    return (
      <ListItem
        style={themed([$itemsContainer, style])}
        text={item}
        LeftComponent={<Icon icon="closeFile" />}
        textStyle={{ marginLeft: 16 }}
      />
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <ListView
        contentContainerStyle={themed($listContentContainer)}
        estimatedItemSize={130}
        ListHeaderComponent={
          <View style={themed($heading)}>
            <Text text="File List" preset="heading" />
          </View>
        }
        extraData={files.length}
        data={files}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            style={themed($emptyState)}
            heading="No Devices Found"
            content="Add a new device to get started Click Right Bottom Button"
          />
        }
        renderItem={({ item }) => (
          <View>
            {RenderItem(item.name)}
            {item.files && (
              <ListView
                estimatedItemSize={130}
                data={item.files}
                renderItem={({ item }) => RenderItem(item.name, { marginLeft: 16 })}
              />
            )}
          </View>
        )}
      />
    </Screen>
  )
})

// #region Styles
const $listContentContainer: ThemedStyle<ContentStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xl,
  paddingTop: spacing.xl,
  paddingBottom: spacing.xl,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $itemsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
