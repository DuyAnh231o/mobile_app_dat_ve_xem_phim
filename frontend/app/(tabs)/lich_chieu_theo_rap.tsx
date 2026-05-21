import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View, Text, StyleSheet, ScrollView,
  Image, Pressable, LayoutAnimation, Platform, UIManager,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const nearbyCinemas = [
  {
    id: "1", name: "HDA Thái Nguyên", distance: "63 km",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
  },
  {
    id: "2", name: "HDA Biên Hòa", distance: "1125 km",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800",
  },
  {
    id: "3", name: "HDA Thanh Xuân", distance: "18 km",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800",
  },
];

const regions = [
  {
    id: "1", name: "Hà Nội",
    cinemas: [
      { id: "hn1", name: "HDA Mỹ Đình", distance: "567 m", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800" },
      { id: "hn2", name: "HDA Thanh Xuân", distance: "2.7 km", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" },
      { id: "hn3", name: "HDA Xuân Thủy", distance: "2.9 km", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800" },
      { id: "hn4", name: "HDA Tây Sơn", distance: "4.2 km", image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800" },
      { id: "hn5", name: "HDA Giải Phóng", distance: "5.1 km", image: "https://images.unsplash.com/photo-1611419010196-a359b02e2bd0?w=800" },
      { id: "hn6", name: "HDA Đan Phượng", distance: "18 km", image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800" },
    ],
  },
  {
    id: "2", name: "TP. Hồ Chí Minh",
    cinemas: [
      { id: "hcm1", name: "HDA Bình Dương", distance: "32 km", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" },
      { id: "hcm2", name: "HDA Gò Vấp", distance: "5 km", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800" },
      { id: "hcm3", name: "HDA Thủ Đức", distance: "12 km", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800" },
      { id: "hcm4", name: "HDA Quận 9", distance: "15 km", image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800" },
      { id: "hcm5", name: "HDA Tân Phú", distance: "8 km", image: "https://images.unsplash.com/photo-1611419010196-a359b02e2bd0?w=800" },
      { id: "hcm6", name: "HDA Bình Tân", distance: "10 km", image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800" },
    ],
  },
  {
    id: "3", name: "An Giang",
    cinemas: [
      { id: "ag1", name: "HDA An Giang", distance: "180 km", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" },
    ],
  },
  {
    id: "4", name: "Đồng Nai",
    cinemas: [
      { id: "dn1", name: "HDA Biên Hòa", distance: "30 km", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800" },
      { id: "dn2", name: "HDA Long Khánh", distance: "75 km", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800" },
    ],
  },
  {
    id: "5", name: "Khánh Hòa",
    cinemas: [
      { id: "kh1", name: "HDA Nha Trang", distance: "440 km", image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800" },
    ],
  },
];

function RegionAccordion({ region }: { region: typeof regions[0] }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View style={styles.regionBlock}>
      {/* Header thanh ngang */}
      <Pressable style={styles.regionRow} onPress={toggle}>
        <Text style={styles.regionName}>{region.name}</Text>
        <View style={styles.regionRight}>
          <Text style={styles.regionCount}>{region.cinemas.length}</Text>
          <View style={[styles.chevronCircle, open && styles.chevronCircleOpen]}>
            <Text style={[styles.chevron, open && styles.chevronUp]}>
              ⌄
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Grid rạp bên dưới khi mở */}
      {open && (
        <View style={styles.cinemaGrid}>
          {region.cinemas.map((cinema) => (
            <Pressable key={cinema.id} style={styles.cinemaGridCard}>
              <Image source={{ uri: cinema.image }} style={styles.cinemaGridImage} />
              <Text style={styles.cinemaGridName} numberOfLines={2}>
                {cinema.name}
              </Text>
              <View style={styles.distanceRow}>
                <Text style={styles.pinIcon}>📍</Text>
                <Text style={styles.cinemaGridDistance}>{cinema.distance}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function TheaterScreen() {
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Rạp gần bạn */}
        <Text style={styles.sectionTitle}>RẠP GẦN BẠN</Text>
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nearbyList}
        >
          {nearbyCinemas.map((cinema) => (
            <Pressable key={cinema.id} style={styles.nearbyCard}>
              <Image source={{ uri: cinema.image }} style={styles.nearbyImage} />
              <Text style={styles.nearbyName} numberOfLines={1}>{cinema.name}</Text>
              <View style={styles.distanceRow}>
                <Text style={styles.pinIcon}>📍</Text>
                <Text style={styles.nearbyDistance}>{cinema.distance}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Chọn rạp theo khu vực */}
        <Text style={styles.sectionTitle}>CHỌN RẠP THEO KHU VỰC</Text>
        <View style={styles.regionList}>
          {regions.map((region) => (
            <RegionAccordion key={region.id} region={region} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { flex: 1 },
  sectionTitle: {
    fontSize: 22, fontWeight: "800", color: "#E2B200",
    marginTop: 20, marginBottom: 14, marginHorizontal: 16,
  },

  // Rạp gần bạn
  nearbyList: { paddingLeft: 16, paddingRight: 8, paddingBottom: 8 },
  nearbyCard: {
    width: 220, backgroundColor: "#1a1a1a", borderRadius: 18,
    marginRight: 14, overflow: "hidden",
    borderWidth: 1, borderColor: "#2a2a2a",
  },
  nearbyImage: { width: "100%", height: 140, backgroundColor: "#333" },
  nearbyName: {
    fontSize: 16, fontWeight: "700", color: "#fff",
    marginTop: 12, marginHorizontal: 14,
  },
  nearbyDistance: { fontSize: 14, color: "#E2B200", marginBottom: 14 },

  // Khu vực accordion
  regionList: { paddingHorizontal: 16, gap: 12 },
  regionBlock: {
    backgroundColor: "#fff", borderRadius: 16, overflow: "hidden",
  },
  regionRow: {
    paddingHorizontal: 18, paddingVertical: 22,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  regionName: { fontSize: 18, color: "#111", fontWeight: "600" },
  regionRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  regionCount: { fontSize: 18, color: "#3b82f6", fontWeight: "700" },
  chevronCircle: {
    width: 36, height: 36, borderRadius: 999,
    backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center",
  },
  chevronCircleOpen: { backgroundColor: "#dbeafe" },
  chevron: { fontSize: 18, color: "#555", lineHeight: 22, marginTop: -2 },
  chevronUp: { transform: [{ rotate: "180deg" }] },

  // Grid rạp bên trong
  cinemaGrid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 12, paddingBottom: 16, gap: 12,
    borderTopWidth: 1, borderTopColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  cinemaGridCard: {
    width: "47%", backgroundColor: "#fff", borderRadius: 14,
    overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb",
  },
  cinemaGridImage: { width: "100%", height: 110, backgroundColor: "#ddd" },
  cinemaGridName: {
    fontSize: 14, fontWeight: "700", color: "#111",
    marginTop: 10, marginHorizontal: 10,
  },
  distanceRow: {
    flexDirection: "row", alignItems: "center", gap: 2,
    marginHorizontal: 10, marginTop: 4, marginBottom: 10,
  },
  pinIcon: { fontSize: 12 },
  cinemaGridDistance: { fontSize: 13, color: "#3b82f6", fontWeight: "600" },
});
