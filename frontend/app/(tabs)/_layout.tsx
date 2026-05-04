import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { StyleSheet } from "react-native";
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/context/AuthContext';   // ← thêm

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Header bên phải khi đã đăng nhập
function UserHeaderRight({ name }: { name: string }) {
  return (
    <View style={styles.userHeaderRight}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.greetingText} numberOfLines={1}>Chào {name}</Text>
        <View style={styles.memberRow}>
          <Ionicons name="person-circle-outline" size={12} color="#E2B200" />
          <Text style={styles.memberText}> MEMBER</Text>
          <View style={styles.memberDivider} />
          <Ionicons name="star-outline" size={12} color="#E2B200" />
          <Text style={styles.memberText}> 0</Text>
          <View style={styles.memberDivider} />
          <Ionicons name="ticket-outline" size={12} color="#E2B200" />
          <Text style={styles.memberText}> 0</Text>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { user } = useAuth();   // ← đọc từ context, không cần AsyncStorage

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#4d4931" },
        tabBarActiveTintColor: "#E2B200",
        tabBarInactiveTintColor: "#A0A0A0",
        tabBarLabelStyle: { fontSize: 12, textAlign: "center", lineHeight: 16, marginTop: 2 },
        tabBarStyle: {
          height: 100, paddingTop: 6, paddingBottom: 6,
          backgroundColor: "#4d4931", borderTopColor: "#2B271C",
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Lịch chiếu theo phim",
          headerTitle: () => <Text style={styles.logoText}>HDA Cinemas</Text>,
          headerTitleAlign: "left",
          headerStyle: { backgroundColor: "#4d4931", height: 110 },
          headerTitleContainerStyle: { paddingBottom: 12, maxWidth: "50%" },
          headerRightContainerStyle: { paddingRight: 10, paddingBottom: 12, maxWidth: "55%" },
          // Bên phải: user info hoặc nút đăng nhập — đổi ngay, không delay
          headerRight: () =>
            user ? (
              <UserHeaderRight name={user.name} />
            ) : (
              <Link href="/login" asChild>
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginText}>Đăng nhập</Text>
                </TouchableOpacity>
              </Link>
            ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>{"Lịch chiếu\ntheo phim"}</Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="film" color={color} />,
        }}
      />

      <Tabs.Screen
        name="lich_chieu_theo_rap"
        options={{
          title: "Lịch chiếu theo rạp",
          headerTitle: () => <Text style={styles.headertitle}>Lịch chiếu theo rạp</Text>,
          headerStyle: { backgroundColor: "#4d4931", height: 110 },
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>{"Lịch chiếu\ntheo rạp"}</Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      />

      <Tabs.Screen
        name="voucher"
        options={{
          title: "Voucher",
          headerTitle: () => <Text style={styles.voucherHeaderTitle}>VOUCHER CỦA TÔI</Text>,
          headerTitleAlign: "left",
          headerStyle: { backgroundColor: "#4d4931", height: 110 },
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>{"Voucher"}</Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
          headerRight: () => (
            <View style={styles.voucherHeaderButtons}>
              <Link href="/addvoucher" asChild>
                <TouchableOpacity style={styles.voucherIconButton}>
                  <FontAwesome name="plus" size={20} color="#E2B200" />
                </TouchableOpacity>
              </Link>
              <Link href="/voucher-history" asChild>
                <TouchableOpacity style={styles.voucherIconButton}>
                  <FontAwesome name="history" size={20} color="#E2B200" />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="offers"
        options={{
          title: "Ưu đãi",
          headerTitle: () => <Text style={styles.headertitle}>Tin mới và Ưu đãi</Text>,
          headerStyle: { backgroundColor: "#4d4931", height: 110 },
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "Khác",
          headerTitle: () => <Text style={styles.headertitle}>Khác</Text>,
          headerStyle: { backgroundColor: "#4d4931", height: 110 },
          tabBarIcon: ({ color }) => <TabBarIcon name="ellipsis-h" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoText: { fontSize: 22, fontWeight: "800", color: "#E2B200" },
  loginButton: {
    backgroundColor: "#E2B200", paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 12, minWidth: 118, alignItems: "center", justifyContent: "center",
  },
  loginText: { color: "#524300", fontSize: 16, fontWeight: "700" },
  userHeaderRight: { flexDirection: "row", alignItems: "center", gap: 8, marginRight: 4 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#E2B200", alignItems: "center",
    justifyContent: "center", borderWidth: 2, borderColor: "#FFD740",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#4d4931" },
  userInfo: { alignItems: "flex-start" },
  greetingText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF", marginBottom: 2, maxWidth: 130 },
  memberRow: { flexDirection: "row", alignItems: "center" },
  memberText: { fontSize: 10, color: "#E2B200", fontWeight: "600" },
  memberDivider: { width: 1, height: 9, backgroundColor: "#6B6040", marginHorizontal: 4 },
  tabLabel: { fontSize: 12, textAlign: "center", lineHeight: 16, width: 72 },
  headertitle: { fontSize: 25, fontWeight: "800", color: "#E2B200", marginRight: 120 },
  voucherHeaderTitle: { fontSize: 22, fontWeight: "800", color: "#E2B200", letterSpacing: 1 },
  voucherHeaderButtons: { flexDirection: "row", alignItems: "center", marginRight: 12, gap: 12 },
  voucherIconButton: { padding: 6, alignItems: "center", justifyContent: "center" },
});
