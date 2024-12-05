import React, { useState, ReactNode } from "react"
import { StyleProp, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Icon, Text } from "@/components"

export interface DropdownItem {
  label: string
  value: string
  [key: string]: any
}

export interface DropdownProps<T extends DropdownItem> {
  label: string
  isOpen: boolean
  onClick: () => void
  placeholder?: string
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  selectedValue?: string
}

export function Dropdown<T extends DropdownItem>(props: DropdownProps<T>) {
  const { label, placeholder, isOpen, onClick, disabled, selectedValue } = props

  const { themed } = useAppTheme()

  return (
    <View style={$container}>
      <Text text={label} preset="default" />
      <TouchableOpacity onPress={onClick} disabled={disabled} style={themed($dropdownTrigger)}>
        <Text style={themed($selectedText)} text={selectedValue || "Select Device"} />
        <Icon icon={isOpen ? "chevronUp" : "chevronDown"} size={20} />
      </TouchableOpacity>
    </View>
  )
}

// Styles
const $container: ViewStyle = {
  flexGrow: 1,
  marginBottom: 12,
}

const $dropdownTrigger: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 4,
  paddingHorizontal: 12,
  paddingVertical: 10,
})

const $selectedText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.text,
})

const $labelStyle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  marginBottom: 4,
  fontFamily: typography.primary.bold,
  fontSize: 12,
  color: colors.text,
})

export default Dropdown
