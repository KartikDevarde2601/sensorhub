import { Platform, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Text } from "@/components/Text"
import { Modal as RNModal, ModalProps as RNModalProps, KeyboardAvoidingView } from "react-native"
import { Children } from "react"

export interface ModalProps extends RNModalProps {
  isopen: boolean
  withInput?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const Modal = observer(function Modal(props: ModalProps) {
  const { style, isopen, withInput, children } = props
  const $styles = [$container, style]
  const { themed } = useAppTheme()

  const content = withInput ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={themed($styles)}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={themed($styles)}>{children}</View>
  )

  return (
    <RNModal animationType="fade" transparent={true} visible={isopen}>
      {content}
    </RNModal>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: spacing.sm,
  marginVertical: spacing.md,
})
