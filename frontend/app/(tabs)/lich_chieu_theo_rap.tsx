import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const nearbyCinemas = [
  {
    id: "1",
    name: "HDA Thái Nguyên",
    distance: "63 km",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200",
  },
  {
    id: "2",
    name: "HDA Biên Hòa",
    distance: "1125 km",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200",
  },
  {
    id: "3",
    name: "HDA Thanh Xuân",
    distance: "18 km",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200",
  },
];

const regions = [
  { id: "1", name: "Hà Nội", count: 6 },
  { id: "2", name: "TP. Hồ Chí Minh", count: 6 },
  { id: "3", name: "An Giang", count: 1 },
  { id: "4", name: "Đồng Nai", count: 2 },
  { id: "5", name: "Khánh Hòa", count: 1 },
];

export default function TheaterScreen() {
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>RẠP GẦN BẠN</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nearbyList}
        >
          {nearbyCinemas.map((cinema) => (
            <View key={cinema.id} style={styles.cinemaCard}>
              <Image source={{ uri: cinema.image }} style={styles.cinemaImage} />
              <Text style={styles.cinemaName} numberOfLines={1}>
                {cinema.name}
              </Text>
              <Text style={styles.cinemaDistance}>{cinema.distance}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>CHỌN RẠP THEO KHU VỰC</Text>

        <View style={styles.regionList}>
          {regions.map((region) => (
            <View key={region.id} style={styles.regionRow}>
              <Text style={styles.regionName}>{region.name}</Text>

              <View style={styles.regionRight}>
                <Text style={styles.regionCount}>{region.count}</Text>
                <View style={styles.chevronCircle}>
                  <Text style={styles.chevron}>⌄</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E2B200",
    marginTop: 20,
    marginBottom: 14,
    marginHorizontal: 16,
  },
  nearbyList: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 28,
  },
  cinemaCard: {
    borderColor: "#5e5e5e",
    borderWidth: 1,
    width: 220,
    backgroundColor: "#5e5e5e",
    borderRadius: 18,
    marginRight: 14,
    overflow: "hidden",
  },
  cinemaImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#D9D9D9",
  },
  cinemaName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginTop: 12,
    marginHorizontal: 14,
  },
  cinemaDistance: {
    fontSize: 16,
    color: "#E2B200",
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 14,
  },
  regionList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  regionRow: {
    backgroundColor: "#5e5e5e",
    borderRadius: 16,
    minHeight: 84,
    paddingHorizontal: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  regionName: {
    fontSize: 18,
    color: "#111111",
    fontWeight: "500",
  },
  regionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  regionCount: {
    fontSize: 18,
    color: "#E2B200",
    marginRight: 14,
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#c0c0c0",
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    flex: 1,
    fontSize: 18,
    color: "#3b3b3b",
  },
});
