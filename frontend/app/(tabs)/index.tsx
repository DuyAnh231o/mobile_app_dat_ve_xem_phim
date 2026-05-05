import { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { getMovies } from "../../services/backendApi";

type Movie = {
  id: string;
  poster_url: string;
  title: string;
  release_date: string;
  duration: number;
  description: string;
  status: "sap-chieu" | "dang-chieu" | "suat-chieu-som";
};

const TABS = [
  { key: "sap-chieu", label: "Sắp chiếu" },
  { key: "dang-chieu", label: "Đang chiếu" },
  { key: "suat-chieu-som", label: "Suất chiếu sớm" },
] as const;

const MAIN_BANNERS = [
  {
    id: "1",
    image:
      "https://files.betacorp.vn/media/images/2026/04/21/1702x621-3-164102-210426-62.jpg",
  },
  {
    id: "2",
    image:
      "https://files.betacorp.vn/media/images/2026/04/21/poster-hnm-1702x621-163303-210426-33.jpg",
  },
  {
    id: "3",
    image:
      "https://files.betacorp.vn/media/images/2026/04/21/poster-anh-hung-1702x621-155603-210426-22.jpg",
  },
    {
    id: "4",
    image:
      "https://files.betacorp.vn/media/images/2026/04/20/1702x621-164138-200426-90.jpg",
  },
];

export const unstable_settings = {
  initialRouteName: "index",
};

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("dang-chieu");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getMovies();

        const mappedData: Movie[] = data.map((movie: any, index: number) => ({
          ...movie,
          status:
            index % 3 === 0
              ? "sap-chieu"
              : index % 3 === 1
              ? "dang-chieu"
              : "suat-chieu-som",
        }));

        setMovies(mappedData);
      } catch (error) {
        console.error("Load movies failed:", error);
      }
    };

    loadMovies();
  }, []);

  const filteredMovies = useMemo(
    () => movies.filter((movie) => movie.status === activeTab),
    [movies, activeTab]
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeLine} />}
          </Pressable>
        );
      })}
    </View>

    <FlatList
      data={filteredMovies}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerScroll}
          >
            {MAIN_BANNERS.map((banner) => (
              <Image
                key={banner.id}
                source={{ uri: banner.image }}
                style={styles.bannerImage}
              />
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === "sap-chieu"
                ? "Phim Sắp Chiếu"
                : activeTab === "dang-chieu"
                ? "Phim Đang Chiếu"
                : "Suất Chiếu Sớm"}
            </Text>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/movie-detail",
              params: { id: item.id },
            })
          }
        >
          <Image
            source={{
              uri: item.poster_url
                ? item.poster_url
                : "https://via.placeholder.com/300x450?text=No+Image",
            }}
            style={styles.poster}
          />
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.movieYear}>
            {item.release_date
              ? new Date(item.release_date).getFullYear().toString()
              : ""}
          </Text>
        </Pressable>
      )}
    />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#000000",
},
tabBar: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#171510",
  paddingTop: 12,
  paddingBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#2B271C",
},
tabItem: {
  alignItems: "center",
  minWidth: 92,
},
tabText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#A8A8A8",
},
activeTabText: {
  color: "#E2B200",
},
activeLine: {
  marginTop: 8,
  width: 84,
  height: 3,
  borderRadius: 999,
  backgroundColor: "#c",
},
bannerScroll: {
  
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 18,
},
bannerImage: {
  borderColor: "#5e5e5e",
    borderWidth: 1,
  width: 300,
  height: 160,
  borderRadius: 16,
  marginRight: 12,
  backgroundColor: "#2A2A2A",
},
sectionHeader: {
  paddingHorizontal: 16,
  marginBottom: 14,
},
sectionTitle: {
  fontSize: 24,
  fontWeight: "800",
  color: "#FFFFFF",
},
listContent: {
  paddingBottom: 28,
},
row: {
  justifyContent: "space-between",
  paddingHorizontal: 16,
  marginBottom: 18,
},
card: {
  width: "48%",
  backgroundColor: "#717171",
  borderRadius: 16,
  padding: 8,
  borderWidth: 1,
  borderColor: "#2A2A2A",
},
poster: {
  width: "100%",
  height: 240,
  borderRadius: 12,
  backgroundColor: "#2A2A2A",
},
movieTitle: {
  marginTop: 10,
  fontSize: 16,
  fontWeight: "700",
  color: "#FFFFFF",
},
movieYear: {
  marginTop: 4,
  fontSize: 14,
  color: "#E2B200",
},

}

);
