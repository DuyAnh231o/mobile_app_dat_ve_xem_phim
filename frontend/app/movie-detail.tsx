import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { getMovieById } from "../services/backendApi";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const loadMovieDetail = async () => {
      if (!id) return;
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error("Load movie detail failed:", error);
      }
    };

    loadMovieDetail();
  }, [id]);

  if (!movie) {
    return (
      <SafeAreaView style={styles.container}>
       <Stack.Screen options={{
  title: "Chi tiết phim",
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
  headerTintColor: "#111",
  headerBackTitle: "",
  headerBackButtonDisplayMode: "minimal",
}} />

        <View style={styles.content}>
          <Text style={styles.title}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
     <Stack.Screen options={{
  title: "Chi tiết phim",
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
  headerTintColor: "#111",
  headerBackTitle: "",
  headerBackButtonDisplayMode: "minimal",
}} />


      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: movie.poster_url }} style={styles.poster} />

        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.year}>
          {movie.release_date
            ? new Date(movie.release_date).getFullYear().toString()
            : ""}
        </Text>

        <Text style={styles.info}>⏱ Thời lượng: {movie.duration} phút</Text>

        <Text style={styles.plotTitle}>Giới thiệu:</Text>
        <Text style={styles.plot}>{movie.description}</Text>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Nút đặt vé cố định ở dưới */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.bookBtn}
          onPress={() =>
            router.push({ pathname: "/chon-suat-chieu", params: { id } })
          }
        >
          <Text style={styles.bookBtnText}>🎟 Đặt vé ngay</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e0e" },
  content: { padding: 16 },
  poster: {
    width: "100%", height: 420,
    borderRadius: 16, marginBottom: 16, backgroundColor: "#222222",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF", marginBottom: 8 },
  year: { fontSize: 18, color: "#F2C94C", marginBottom: 16 },
  info: { fontSize: 16, color: "#E0E0E0", marginBottom: 10 },
  plotTitle: {
    fontSize: 18, fontWeight: "700",
    color: "#FFFFFF", marginTop: 8, marginBottom: 8,
  },
  plot: { fontSize: 15, lineHeight: 24, color: "#D0D0D0" },
  header: { backgroundColor: "#E2B200" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111111" },
  bottomBar: {
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: "#1a1810", borderTopWidth: 1, borderTopColor: "#2B271C",
  },
  bookBtn: {
    backgroundColor: "#E2B200", paddingVertical: 14,
    borderRadius: 14, alignItems: "center",
  },
  bookBtnText: { color: "#000", fontSize: 17, fontWeight: "800" },
});

