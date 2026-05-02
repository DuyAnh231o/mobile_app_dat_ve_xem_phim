import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { fetchMovieDetail } from "../services/api";

export default function MovieDetailScreen() {
  const { imdbID } = useLocalSearchParams<{ imdbID: string }>();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const loadMovieDetail = async () => {
      if (!imdbID) return;

      const data = await fetchMovieDetail(imdbID);
      setMovie(data);
    };

    loadMovieDetail();
  }, [imdbID]);

    <Stack.Screen
        options={{
          title: "Chi tiết phim",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",

        }}
      />

  if (!movie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
      <><Stack.Screen
      options={{
        title: "Chi tiết phim",
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerBackTitle: "",
        headerBackButtonDisplayMode: "minimal",
      }} />
      
      
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Image source={{ uri: movie.Poster }} style={styles.poster} />

          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.year}>{movie.Year}</Text>

          <Text style={styles.info}>Thời lượng: {movie.Runtime}</Text>
          <Text style={styles.info}>Thể loại: {movie.Genre}</Text>
          <Text style={styles.info}>Đạo diễn: {movie.Director}</Text>
          <Text style={styles.info}>Diễn viên: {movie.Actors}</Text>
          <Text style={styles.plotTitle}>Giới thiệu:</Text>
          <Text style={styles.plot}>{movie.Plot}</Text>
        </ScrollView>
      </SafeAreaView></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#616161",
  },
  content: {
    padding: 16,
  },
  poster: {
    width: "100%",
    height: 420,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#222222",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  year: {
    fontSize: 18,
    color: "#F2C94C",
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: "#E0E0E0",
    marginBottom: 10,
  },
  plotTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 8,
  },
  plot: {
    fontSize: 15,
    lineHeight: 24,
    color: "#D0D0D0",
  },


    header: {
    backgroundColor: "#E2B200",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
  },

});
