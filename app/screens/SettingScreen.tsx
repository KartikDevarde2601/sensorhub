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
import { useStores } from "@/models"

interface SettingScreenProps extends BottomNavigatorProps<"Setting"> {}

const mqttConfigValidation = Yup.object().shape({
  clientId: Yup.string().required("Required"),
  host: Yup.string().required("Required"),
  port: Yup.number().required("Required"),
  option: Yup.object().shape({
    password: Yup.string(),
    username: Yup.string(),
    autoReconnect: Yup.boolean(),
    cleanSession: Yup.boolean(),
    enableSslConfig: Yup.boolean(),
    keepAlive: Yup.number(),
    maxBackoffTime: Yup.number(),
    retryCount: Yup.number(),
    jitter: Yup.number(),
  }),
})

export const SettingScreen: FC<SettingScreenProps> = observer(function SettingScreen() {
  // Pull in one of our MST stores
  const { mqtt } = useStores()

  console.log(mqtt)
  console.log(mqtt.client)

  const [EnableadvancedConfig, setEnableadvancedConfig] = useState(false)

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const formik = useFormik({
    initialValues: {
      clientId: mqtt.clientId,
      host: mqtt.host,
      port: mqtt.port,
      option: mqtt.options,
    },
    validationSchema: mqttConfigValidation,
    onSubmit: (values) => {
      mqtt.editConfig(values)
    },
  })

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <View style={themed($mainContainer)}>
        <Text text="Mqtt Config" preset="heading" />
        <View style={themed($formContainer)}>
          <TextField
            keyboardType="default"
            value={formik.values.clientId}
            onChangeText={formik.handleChange("clientId")}
            label="Client ID"
            helper={
              formik.touched.clientId && formik.errors.clientId
                ? formik.errors.clientId.toString()
                : ""
            }
            status={formik.errors.clientId ? "error" : undefined}
          />
          <TextField
            keyboardType="default"
            value={formik.values.host}
            onChangeText={formik.handleChange("host")}
            label="Host/IP"
            helper={formik.touched.host && formik.errors.host ? formik.errors.host.toString() : ""}
            status={formik.errors.host ? "error" : undefined}
          />
          <TextField
            keyboardType="numeric"
            value={formik.values.port.toString()}
            onChangeText={formik.handleChange("port")}
            label="port"
            helper={formik.touched.port && formik.errors.port ? formik.errors.port.toString() : ""}
            status={formik.errors.port ? "error" : undefined}
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
              value={formik.values.option.password}
              onChangeText={formik.handleChange("password")}
              label="mqtt cleint password"
              helper={
                formik.touched.option?.password && formik.errors.option?.password
                  ? formik.errors.option.password.toString()
                  : ""
              }
              status={formik.errors.option?.password ? "error" : undefined}
            />
            <TextField
              keyboardType="default"
              value={formik.values.option.username}
              onChangeText={formik.handleChange("option.username")}
              label="mqtt cleint username"
              helper={
                formik.touched.option?.username && formik.errors.option?.username
                  ? formik.errors.option?.username.toString()
                  : ""
              }
              status={formik.errors.option?.username ? "error" : undefined}
            />
            <Switch
              value={formik.values.option.enableSslConfig}
              onValueChange={(value) => void formik.setFieldValue("option.enableSslConfig", value)}
              label="enable ssl config"
              labelPosition="left"
              inputInnerStyle={{ backgroundColor: colors.tint }}
              editable={true}
            />
            <Switch
              value={formik.values.option.autoReconnect}
              onValueChange={(value) => void formik.setFieldValue("option.autoReconnect", value)}
              label="auto reconnect"
              labelPosition="left"
              inputInnerStyle={{ backgroundColor: colors.tint }}
              editable={true}
            />
            <Switch
              value={formik.values.option.cleanSession}
              onValueChange={(value) => void formik.setFieldValue("option.cleanSession", value)}
              label="clean session"
              labelPosition="left"
              inputInnerStyle={{ backgroundColor: colors.tint }}
            />
            <TextField
              keyboardType="numeric"
              value={formik.values.option.maxBackoffTime.toString()}
              onChangeText={formik.handleChange("option.maxBackoffTime")}
              label="maxBackoffTime"
              helper={
                formik.touched.option?.maxBackoffTime && formik.errors.option?.maxBackoffTime
                  ? formik.errors.option.maxBackoffTime.toString()
                  : ""
              }
              status={formik.errors.option?.maxBackoffTime ? "error" : undefined}
            />
            <TextField
              keyboardType="numeric"
              value={formik.values.option.retryCount.toString()}
              onChangeText={formik.handleChange("option.retryCount")}
              label="retryCount"
              helper={
                formik.touched.option?.retryCount && formik.errors.option?.retryCount
                  ? formik.errors.option.retryCount.toString()
                  : ""
              }
              status={formik.errors.option?.retryCount ? "error" : undefined}
            />
            <TextField
              keyboardType="numeric"
              value={formik.values.option.jitter.toString()}
              onChangeText={formik.handleChange("option.jitter")}
              label="jitter"
              helper={
                formik.touched.option?.jitter && formik.errors.option?.jitter
                  ? formik.errors.option.jitter.toString()
                  : ""
              }
              status={formik.errors.option?.jitter ? "error" : undefined}
            />
          </View>
        ) : null}
        <Button
          text="save the setting"
          preset="filled"
          style={{ borderRadius: 24 }}
          textStyle={{ fontSize: 20, color: colors.tint }}
          onPress={() => formik.handleSubmit()}
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
