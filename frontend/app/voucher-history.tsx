import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

export default function VoucherHistory() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Lịch sử voucher",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    <View style={styles.regionList}>

      <Text style={styles.title}>Không có ghi nhận sử dụng voucher</Text>
      
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
    regionList: {   
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
    title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
