/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import * as Screens from "@/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { BottomNavigatorParamList, BottomNavigator } from "./BottomNavigator"
import { ComponentProps } from "react"
import { TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Icon } from "@/components"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  BottomNavigation: { screen?: keyof BottomNavigatorParamList }
  AddDevice: { device_id: string }
  EditSession: { session_id: string }
  DataCollection: { session_id: string }
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    theme: { colors },
  } = useAppTheme()

  const navigation = useNavigation()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      <Stack.Screen
        name="AddDevice"
        component={Screens.AddDeviceScreen}
        options={{
          headerShown: true,
          headerTitle: () => null,
          headerStyle: $headeStyle(colors),
          headerShadowVisible: false,
          headerLeft: (props) => {
            return (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon icon="arrowLeft" size={30} color={colors.tint} />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen
        name="EditSession"
        component={Screens.EditSessionScreen}
        options={{
          headerShown: true,
          headerTitle: () => null,
          headerStyle: $headeStyle(colors),
          headerShadowVisible: false,
          headerLeft: (props) => {
            return (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon icon="arrowLeft" size={30} color={colors.tint} />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen
        name="DataCollection"
        component={Screens.DataCollectionScreen}
        options={{
          headerShown: true,
          headerTitle: () => null,
          headerStyle: $headeStyle(colors),
          headerShadowVisible: false,
          headerLeft: (props) => {
            return (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon icon="arrowLeft" size={30} color={colors.tint} />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name="BottomNavigation" component={BottomNavigator} />
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  )
})

const $headeStyle = (colors: any) => ({
  backgroundColor: colors.background,
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
  shadowColor: "transparent",
  shadowOffset: { width: 0, height: 0 },
})
