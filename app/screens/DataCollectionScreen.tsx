import { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { useStores } from "@/models"
import { Session } from "@/models"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
import { $styles } from "../theme"

interface DataCollectionScreenProps extends AppStackScreenProps<"DataCollection"> {}

export const DataCollectionScreen: FC<DataCollectionScreenProps> = observer(
  function DataCollectionScreen() {
    const route = useRoute<RouteProp<{ EditSession: { session_id?: string } }, "EditSession">>()
    const { sessions } = useStores()
    const [session, setSession] = useState<Session | null>(null)
    // Pull in navigation via hook
    const navigation = useNavigation()

    useEffect(() => {
      if (route.params?.session_id) {
        const session = sessions.getSessionById(route.params.session_id)
        if (session) {
          setSession(session)
        }
      }
    }, [route.params?.session_id])

    const {
      themed,
      theme: { colors },
    } = useAppTheme()

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={themed([$screenContentContainer, $styles.flex1])}
      >
        <Text text="DataCollection" preset="heading" />
      </Screen>
    )
  },
)
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
})
