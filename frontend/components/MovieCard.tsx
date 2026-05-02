import { View, Text, Image, StyleSheet } from "react-native";

export default function MovieCard({ movie }: any) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: movie.Poster }} style={styles.poster} />
      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.year}>{movie.Year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    width: 140,
    backgroundColor: "#17181B",
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2A2C31",
  },
  poster: {
    width: "100%",
    height: 190,
    borderRadius: 10,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },
  year: {
    color: "#A7A29A",
    fontSize: 13,
    marginTop: 4,
  },
});
