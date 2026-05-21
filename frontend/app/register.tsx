import { useState } from "react";
import {
  View, Text, StyleSheet, TextInput,
  Pressable, TouchableOpacity, Alert, ScrollView,
} from "react-native";
import { Stack, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { register as apiRegister } from "../services/backendApi";

export default function RegisterScreen() {
  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên."); return;
    }
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email."); return;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự."); return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp."); return;
    }

    try {
      setLoading(true);
      await apiRegister(name.trim(), email.trim(), password);
      Alert.alert(
        "Đăng ký thành công! 🎉",
        "Tài khoản đã được tạo. Vui lòng đăng nhập.",
        [{ text: "Đăng nhập ngay", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      Alert.alert("Lỗi đăng ký", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đăng ký",
          headerStyle: { backgroundColor: "#E2B200" },
          headerTitleStyle: { fontSize: 24, fontWeight: "700", color: "#111111" },
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: "#111111",
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        <Text style={styles.heading}>Tạo tài khoản</Text>
        <Text style={styles.subheading}>Đăng ký để đặt vé và nhận ưu đãi</Text>

        {/* Họ tên */}
        <View style={styles.inputBox}>
          <Ionicons name="person" size={22} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={styles.inputBox}>
          <Ionicons name="mail" size={22} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Mật khẩu */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed" size={22} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu (ít nhất 6 ký tự)"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" style={styles.icon} />
          </Pressable>
        </View>

        {/* Xác nhận mật khẩu */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
          />
          <Pressable onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#888" style={styles.icon} />
          </Pressable>
        </View>

        {/* Nút đăng ký */}
        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerBtnText}>
            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
          </Text>
        </TouchableOpacity>

        {/* Về đăng nhập */}
        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Đã có tài khoản? </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
          </Pressable>
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 48 },

  heading: { fontSize: 28, fontWeight: "800", color: "#111", marginBottom: 6 },
  subheading: { fontSize: 15, color: "#888", marginBottom: 28 },

  inputBox: {
    height: 62, borderWidth: 1, borderColor: "#D9D9D9",
    borderRadius: 14, backgroundColor: "#FAFAFA",
    paddingHorizontal: 14, flexDirection: "row",
    alignItems: "center", marginBottom: 16,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#111" },

  registerBtn: {
    marginTop: 8, height: 60, borderRadius: 14,
    backgroundColor: "#E2B200", justifyContent: "center", alignItems: "center",
  },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { color: "#fff", fontSize: 20, fontWeight: "800" },

  loginRow: {
    marginTop: 28, flexDirection: "row",
    justifyContent: "center", alignItems: "center",
  },
  loginHint: { fontSize: 16, color: "#555" },
  loginLink: { fontSize: 16, color: "#E2B200", fontWeight: "700" },
});
