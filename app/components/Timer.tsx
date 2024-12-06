import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Text } from "@/components/Text"
import { useStores } from "@/models"

export interface TimerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

export const Timer = observer(function Timer(props: TimerProps) {
  const { timer } = useStores()
  const animatedValue = useSharedValue(timer.time)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timer.isRunning) {
      interval = setInterval(() => {
        timer.incrementTime(1) // Increment by 1 second
      }, 1000)

      animatedValue.value = withTiming(timer.time, {
        duration: 1000,
        easing: Easing.linear,
      })
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer.isRunning])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedValue.value % 2 === 0 ? 1 : 0.5, // Example of visual feedback
  }))

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <View style={themed($container)}>
      <Animated.Text
        style={[
          { fontSize: 36, fontWeight: "bold", color: colors.palette.neutral800 },
          animatedStyle,
        ]}
      >
        {timer.formattedTime}
      </Animated.Text>
    </View>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  alignItems: "center",
})
