import { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { BottomNavigatorProps } from "@/navigators"
import { Button, Screen, Text, TextField, Switch } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface SettingScreenProps extends BottomNavigatorProps<"Setting"> {}

const mqttBasicConfigValidation = Yup.object().shape({
  clientId: Yup.string().required("Required"),
  host: Yup.string().required("Required"),
  port: Yup.number().required("Required"),
})

const mqttAdvancedConfigValidation = Yup.object().shape({
  password: Yup.string(),
  username: Yup.string(),
  autoReconnect: Yup.boolean(),
  cleanSession: Yup.boolean(),
  enableSslConfig: Yup.boolean(),
  keepAlive: Yup.number(),
  maxBackoffTime: Yup.number(),
  retryCount: Yup.number(),
  jitter: Yup.number(),
})

export const SettingScreen: FC<SettingScreenProps> = observer(function SettingScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const [EnableadvancedConfig, setEnableadvancedConfig] = useState(false)

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const basicFormik = useFormik({
    initialValues: {
      clientId: "",
      host: "",
      port: 1883,
    },
    validationSchema: mqttBasicConfigValidation,
    onSubmit: (values) => {
      console.log("Form data", values)
    },
  })

  const advanceFormik = useFormik({
    initialValues: {
      password: "",
      username: "",
      autoReconnect: true,
      cleanSession: true,
      enableSslConfig: false,
      keepAlive: 60,
      maxBackoffTime: 60,
      retryCount: 3,
      jitter: 1,
    },
    validationSchema: mqttAdvancedConfigValidation,
    onSubmit: (values) => {
      console.log("Form data", values)
    },
  })
  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <View style={themed($mainContainer)}>
        <Text text="Mqtt Config" preset="heading" />
        <View style={themed($formContainer)}>
          <TextField
            keyboardType="default"
            value={basicFormik.values.clientId}
            onChangeText={basicFormik.handleChange("clientId")}
            label="Client ID"
            helper={
              basicFormik.touched.clientId && basicFormik.errors.clientId
                ? basicFormik.errors.clientId.toString()
                : ""
            }
            status={basicFormik.errors.clientId ? "error" : undefined}
          />
          <TextField
            keyboardType="default"
            value={basicFormik.values.host}
            onChangeText={basicFormik.handleChange("host")}
            label="Client ID"
            helper={
              basicFormik.touched.host && basicFormik.errors.host
                ? basicFormik.errors.host.toString()
                : ""
            }
            status={basicFormik.errors.host ? "error" : undefined}
          />
          <TextField
            keyboardType="numeric"
            value={basicFormik.values.port.toString()}
            onChangeText={basicFormik.handleChange("port")}
            label="port"
            helper={
              basicFormik.touched.port && basicFormik.errors.port
                ? basicFormik.errors.port.toString()
                : ""
            }
            status={basicFormik.errors.port ? "error" : undefined}
          />
        </View>
        <View style={themed($advacedToggleContainer)}>
          <View style={themed($advanceToggleText)}>
            <Text text="Advance Config" preset="subheading" />
            <Text text="show andvance config" preset="formHelper" />
          </View>
          <Switch
            value={EnableadvancedConfig}
            onValueChange={(value) => {
              setEnableadvancedConfig(value)
              console.log("value", value)
            }}
            editable={true}
            inputInnerStyle={{ backgroundColor: colors.tint }}
          />
        </View>
        {EnableadvancedConfig ? (
          <View style={themed($formContainer)}>
            <TextField
              keyboardType="default"
              value={advanceFormik.values.password}
              onChangeText={advanceFormik.handleChange("password")}
              label="mqtt cleint password"
              helper={
                advanceFormik.touched.password && advanceFormik.errors.password
                  ? advanceFormik.errors.password.toString()
                  : ""
              }
              status={advanceFormik.errors.password ? "error" : undefined}
            />
            <TextField
              keyboardType="default"
              value={advanceFormik.values.username}
              onChangeText={advanceFormik.handleChange("username")}
              label="mqtt cleint username"
              helper={
                advanceFormik.touched.username && advanceFormik.errors.username
                  ? advanceFormik.errors.username.toString()
                  : ""
              }
              status={advanceFormik.errors.username ? "error" : undefined}
            />
            <Switch
              value={advanceFormik.values.enableSslConfig}
              onValueChange={(value) => void advanceFormik.setFieldValue("enableSslConfig", value)}
              label="enable ssl config"
              labelPosition="left"
              inputInnerStyle={{ backgroundColor: colors.tint }}
              editable={true}
            />
            <Switch
              value={advanceFormik.values.autoReconnect}
              onValueChange={(value) => void advanceFormik.setFieldValue("autoReconnect", value)}
              label="auto reconnect"
              labelPosition="left"
              inputInnerStyle={{ backgroundColor: colors.tint }}
              editable={true}
            />
            <Switch
              value={advanceFormik.values.cleanSession}
              onValueChange={(value) => void advanceFormik.setFieldValue("cleanSession", value)}
              label="clean session"
              labelPosition="left"
              inputInnerStyle={{ backgroundColor: colors.tint }}
            />
            <TextField
              keyboardType="numeric"
              value={advanceFormik.values.maxBackoffTime.toString()}
              onChangeText={advanceFormik.handleChange("maxBackoffTime")}
              label="maxBackoffTime"
              helper={
                advanceFormik.touched.maxBackoffTime && advanceFormik.errors.maxBackoffTime
                  ? advanceFormik.errors.maxBackoffTime.toString()
                  : ""
              }
              status={advanceFormik.errors.maxBackoffTime ? "error" : undefined}
            />
            <TextField
              keyboardType="numeric"
              value={advanceFormik.values.retryCount.toString()}
              onChangeText={advanceFormik.handleChange("retryCount")}
              label="retryCount"
              helper={
                advanceFormik.touched.retryCount && advanceFormik.errors.retryCount
                  ? advanceFormik.errors.retryCount.toString()
                  : ""
              }
              status={advanceFormik.errors.retryCount ? "error" : undefined}
            />
            <TextField
              keyboardType="numeric"
              value={advanceFormik.values.jitter.toString()}
              onChangeText={advanceFormik.handleChange("jitter")}
              label="jitter"
              helper={
                advanceFormik.touched.jitter && advanceFormik.errors.jitter
                  ? advanceFormik.errors.jitter.toString()
                  : ""
              }
              status={advanceFormik.errors.jitter ? "error" : undefined}
            />
          </View>
        ) : null}
        <Button
          text="save the setting"
          preset="filled"
          style={{ borderRadius: 24 }}
          textStyle={{ fontSize: 20, color: colors.tint }}
        />
      </View>
    </Screen>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.md,
})
const $mainContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})
const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $advacedToggleContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $advanceToggleText: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "column",
})
