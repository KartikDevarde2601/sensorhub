import React, { useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Icon, ListItem } from "@/components"
import { Filesystemnode, FileType } from "@/models"

export interface FileItemProps {
  item: Filesystemnode
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const FileItem = observer(function FileItem(props: FileItemProps) {
  const { style, item } = props
  const { themed, theme } = useAppTheme()
  const $container = item.nodes ? themed(style) : {}
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View style={themed($container)}>
      <ListItem
        style={themed([$itemsContainer, style])}
        text={item.type === FileType.Directory ? item.name : item.name + ".csv"}
        onPress={() => setIsExpanded(!isExpanded)}
        LeftComponent={
          item.nodesArray.length > 0 || item.type === FileType.Directory ? (
            <View style={themed($LeftComponent)}>
              <Icon
                icon="chevronDown"
                style={isExpanded ? { transform: [{ rotate: "-90deg" }] } : {}}
                size={20}
              />
              <Icon icon={isExpanded ? "openFile" : "closeFile"} />
            </View>
          ) : (
            <Icon icon="csv" />
          )
        }
        textStyle={{ marginLeft: theme.spacing.sm }}
      />
      {isExpanded &&
        item.nodesArray.length > 0 &&
        item.nodesArray?.map((node: Filesystemnode, index: number) => (
          <View key={index}>
            <FileItem item={node} style={{ marginLeft: theme.spacing.sm }} />
          </View>
        ))}
    </View>
  )
})

const $itemsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
})

const $LeftComponent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
})
