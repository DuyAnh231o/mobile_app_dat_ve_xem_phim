import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AddVoucherScreen() {
    const [voucherCode, setVoucherCode] = useState("");
  return (
    <>
      <Stack.Screen
        options={{
          title: "Thêm Voucher",
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
              name="gift"
              size={24}
              color="#888888"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mã voucher"
              value={voucherCode}
              onChangeText={setVoucherCode}
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
              placeholder="Mã Pin"
              value={voucherCode}
              onChangeText={setVoucherCode}
                autoCapitalize="none"
            />
             
          </View>


          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm Voucher</Text>
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

  addButton: {
    marginTop: 24,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#E2B200",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },




});
