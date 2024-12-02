import { ComponentType } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"
import { Icon, IconTypes } from "./Icon"
import { Button, ButtonProps } from "./Button"

export interface FabProps extends Omit<ButtonProps, "children"> {
  /**
   * The icon to display on the Floating Action Button
   */
  icon: IconTypes

  /**
   * Size of the icon (defaults to 24)
   */
  iconSize?: number

  /**
   * Position of the Fab
   */
  position?: {
    bottom?: number
    right?: number
    left?: number
    top?: number
  }
}

/**
 * Floating Action Button (FAB) component
 * Combines Button and Icon components with positioning
 */
export const Fab = observer(function Fab(props: FabProps) {
  const {
    icon,
    iconSize = 24,
    position = { bottom: 16, right: 16 },
    style: styleProp,
    preset = "default",
    ...rest
  } = props

  const { theme } = useAppTheme()

  const $positionedContainer: ViewStyle = {
    position: "absolute",
    ...position,
    zIndex: 10,
  }

  // Combine positioning and any additional styles
  const $combinedStyle: StyleProp<ViewStyle> = [$positionedContainer, styleProp]

  return (
    <Button preset={preset} style={$combinedStyle} {...rest}>
      <Icon icon={icon} size={iconSize} color={theme.colors.tint} />
    </Button>
  )
})
