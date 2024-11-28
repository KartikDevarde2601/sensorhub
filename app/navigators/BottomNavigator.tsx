import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { DeviceScreen, SessionScreen, SettingScreen, FileScreen } from "@/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList, AppStackScreenProps } from "."
import { he } from "date-fns/locale"
import { Icon } from "@/components"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
import { TextStyle, ViewStyle } from "react-native"

export type BottomNavigatorParamList = {
  Device: undefined
  Session: undefined
  File: undefined
  Setting: undefined
}

export type BottomNavigatorProps<T extends keyof BottomNavigatorParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomNavigatorParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<BottomNavigatorParamList>()

export const BottomNavigator = () => {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Device"
        component={DeviceScreen}
        options={{
          tabBarLabel: "Device",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="device" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Session"
        component={SessionScreen}
        options={{
          tabBarLabel: "Session",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="session" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="File"
        component={FileScreen}
        options={{
          tabBarLabel: "File",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="file" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="settings" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  color: colors.text,
  lineHeight: 16,
})
