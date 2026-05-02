import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đăng nhập",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.inputBox}>
            <Ionicons
              name="mail"
              size={24}
              color="#888888"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputBox, styles.passwordBox]}>
            <Ionicons
              name="lock-closed"
              size={24}
              color="#888888"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#888888"
                style={styles.inputIcon}
              />
            </Pressable>  
          </View>

          <Pressable>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </Pressable>

          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
          </Pressable>

          <Pressable style={styles.facebookButton}>
            <Text style={styles.socialButtonText}>ĐĂNG NHẬP BẰNG FACEBOOK</Text>
          </Pressable>

          <Pressable style={styles.appleButton}>
            <View style={styles.appleRow}>
              <Ionicons name="logo-apple" size={24} color="#FFFFFF" style={styles.appleIcon} />
              <Text style={styles.socialButtonText}>ĐĂNG NHẬP BẰNG APPLE</Text>
            </View>
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.orLine} />
          </View>

          <Pressable>
            <Text style={styles.registerText}>Đăng kí tài khoản HDA Cinemas</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E2B200",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  inputBox: {
    height: 64,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordBox: {
    marginTop: 18,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#111111",
  },
  forgotPassword: {
    marginTop: 20,
    color: "#2A8ED6",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  loginButton: {
    marginTop: 24,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#E2B200",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  facebookButton: {
    marginTop: 18,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#045A9C",
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  appleButton: {
    marginTop: 18,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  appleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  appleIcon: {
    marginRight: 10,
  },
  orRow: {
    marginTop: 36,
    flexDirection: "row",
    alignItems: "center",
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 18,
    color: "#888888",
  },
  registerText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 18,
    color: "#111111",
  },
});
