import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function MoreScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    Alert.alert("Đã đăng xuất", "Bạn đã đăng xuất khỏi tài khoản.");
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khác</Text>

      {/* Card thông tin user */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={28} color="#E2B200" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.helloText}>
            {user ? `Chào ${user.name}` : "Bạn chưa đăng nhập"}
          </Text>
          <Text style={styles.roleText}>
            {user
              ? user.role || "USER"
              : "Đăng nhập để đặt vé và xem vé của bạn"}
          </Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menuBlock}>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.push("/ve-da-dat")}
        >
          <View style={styles.menuIcon}>
            <FontAwesome name="ticket" size={18} color="#E2B200" />
          </View>
          <Text style={styles.menuText}>Vé đã đặt</Text>
          <FontAwesome name="chevron-right" size={14} color="#555" />
        </Pressable>
      </View>

      {/* Đăng nhập / Đăng xuất */}
      {user ? (
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.loginButton} onPress={() => router.push("/login")}>
          <FontAwesome name="sign-in" size={20} color="#4D4300" />
          <Text style={styles.loginText}>Đăng nhập</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 16 },
  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF", marginBottom: 18 },
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#171510", borderRadius: 16,
    borderWidth: 1, borderColor: "#2B271C", padding: 16,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#2B271C", alignItems: "center",
    justifyContent: "center", marginRight: 14,
  },
  userInfo: { flex: 1 },
  helloText: { fontSize: 18, fontWeight: "800", color: "#FFFFFF" },
  roleText: { marginTop: 4, fontSize: 14, color: "#A0A0A0" },

  menuBlock: {
    marginTop: 20, backgroundColor: "#171510",
    borderRadius: 16, borderWidth: 1, borderColor: "#2B271C",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 16, gap: 14,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#2B271C", alignItems: "center", justifyContent: "center",
  },
  menuText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#fff" },

  logoutButton: {
    marginTop: 20, height: 54, borderRadius: 14,
    backgroundColor: "#B3261E", flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 10,
  },
  logoutText: { fontSize: 17, fontWeight: "800", color: "#FFFFFF" },
  loginButton: {
    marginTop: 20, height: 54, borderRadius: 14,
    backgroundColor: "#E2B200", flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 10,
  },
  loginText: { fontSize: 17, fontWeight: "800", color: "#4D4300" },
});
