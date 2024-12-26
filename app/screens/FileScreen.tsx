import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { Screen, ListView, EmptyState, FileItem, Text } from "@/components"
import { $styles } from "../theme"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { type ContentStyle } from "@shopify/flash-list"
// import { useNavigation } from "@react-navigation/native"
import { useStores, Filesystemnode } from "@/models"

interface FileScreenProps extends BottomNavigatorProps<"File"> {}

export const FileScreen: FC<FileScreenProps> = observer(function FileScreen() {
  const { Filesystem } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { themed, theme } = useAppTheme()
  console.log(Filesystem.rootNode.nodes)

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
        extraData={Filesystem.root}
        data={Filesystem.root}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            style={themed($emptyState)}
            heading="No Devices Found"
            content="Add a new device to get started Click Right Bottom Button"
          />
        }
        renderItem={({ item }) => <FileItem item={item as unknown as Filesystemnode} />}
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

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
