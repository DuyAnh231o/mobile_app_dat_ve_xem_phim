import { useEffect, useState, useMemo } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { getShowtimesByMovie, getMovieById } from "../services/backendApi";

type Showtime = {
  id: string;
  start_time: string;
  price: string;
  rooms: {
    id: string;
    name: string;
    theaters: { id: string; name: string; location: string };
  };
};

function groupByTheater(showtimes: Showtime[]) {
  const map: Record<string, { theater: any; byDate: Record<string, Showtime[]> }> = {};
  for (const s of showtimes) {
    const theater = s.rooms?.theaters;
    if (!theater) continue;
    const tid = theater.id;
    if (!map[tid]) map[tid] = { theater, byDate: {} };
    const date = new Date(s.start_time).toLocaleDateString("vi-VN", {
      weekday: "short", day: "2-digit", month: "2-digit",
    });
    if (!map[tid].byDate[date]) map[tid].byDate[date] = [];
    map[tid].byDate[date].push(s);
  }
  return Object.values(map);
}

export default function ChonSuatChieuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [movieData, stData] = await Promise.all([
          getMovieById(id),
          getShowtimesByMovie(id),
        ]);
        setMovie(movieData);
        setShowtimes(stData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Lấy danh sách ngày duy nhất để filter
  const allDates = useMemo(() => {
    const seen = new Set<string>();
    const dates: string[] = [];
    for (const s of showtimes) {
      const d = new Date(s.start_time).toLocaleDateString("vi-VN", {
        weekday: "short", day: "2-digit", month: "2-digit",
      });
      if (!seen.has(d)) { seen.add(d); dates.push(d); }
    }
    return dates;
  }, [showtimes]);

  useEffect(() => {
    if (allDates.length > 0 && !selectedDate) setSelectedDate(allDates[0]);
  }, [allDates]);

  const filtered = useMemo(() =>
    selectedDate ? showtimes.filter(s =>
      new Date(s.start_time).toLocaleDateString("vi-VN", {
        weekday: "short", day: "2-digit", month: "2-digit",
      }) === selectedDate
    ) : showtimes,
    [showtimes, selectedDate]
  );

  const grouped = useMemo(() => groupByTheater(filtered), [filtered]);

  return (
    <>
      <Stack.Screen options={{
        title: "Chọn suất chiếu",
        headerStyle: { backgroundColor: "#4d4931" },
        headerTitleStyle: { color: "#E2B200", fontWeight: "800" },
        headerTintColor: "#E2B200",
      }} />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
        {/* Movie info strip */}
        {movie && (
          <View style={styles.movieStrip}>
            <Image source={{ uri: movie.poster_url }} style={styles.stripPoster} />
            <View style={styles.stripInfo}>
              <Text style={styles.stripTitle} numberOfLines={2}>{movie.title}</Text>
              <Text style={styles.stripDuration}>⏱ {movie.duration} phút</Text>
            </View>
          </View>
        )}

        {/* Date tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.dateTabs} contentContainerStyle={styles.dateTabsContent}>
          {allDates.map(d => (
            <Pressable key={d} style={[styles.dateTab, selectedDate === d && styles.dateTabActive]}
              onPress={() => setSelectedDate(d)}>
              <Text style={[styles.dateTabText, selectedDate === d && styles.dateTabTextActive]}>
                {d}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color="#E2B200" size="large" style={{ marginTop: 40 }} />
        ) : grouped.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không có suất chiếu nào</Text>
          </View>
        ) : (
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {grouped.map(({ theater, byDate }) => (
              <View key={theater.id} style={styles.theaterBlock}>
                <View style={styles.theaterHeader}>
                  <Text style={styles.theaterName}>{theater.name}</Text>
                  <Text style={styles.theaterLocation}>📍 {theater.location}</Text>
                </View>

                {Object.entries(byDate).map(([date, times]) => (
                  <View key={date}>
                    <View style={styles.timeGrid}>
                      {times.map((st) => {
                        const time = new Date(st.start_time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit", minute: "2-digit",
                        });
                        return (
                          <Pressable
                            key={st.id}
                            style={styles.timeBtn}
                            onPress={() =>
                              router.push({
                                pathname: "/chon-ghe",
                                params: {
                                  showtimeId: st.id,
                                  movieTitle: movie?.title,
                                  theaterName: theater.name,
                                  time,
                                  date,
                                  price: st.price,
                                  roomName: st.rooms?.name,
                                },
                              })
                            }
                          >
                            <Text style={styles.timeBtnText}>{time}</Text>
                            <Text style={styles.timeBtnPrice}>
                              {Number(st.price).toLocaleString("vi-VN")}đ
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e0e" },
  movieStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#1a1810", paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#2B271C",
  },
  stripPoster: { width: 52, height: 74, borderRadius: 8, backgroundColor: "#333" },
  stripInfo: { flex: 1, marginLeft: 14 },
  stripTitle: { fontSize: 16, fontWeight: "800", color: "#FFF", marginBottom: 6 },
  stripDuration: { fontSize: 13, color: "#A8A8A8" },
  dateTabs: { maxHeight: 56, backgroundColor: "#171510" },
  dateTabsContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  dateTab: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: "#3a3520",
  },
  dateTabActive: { backgroundColor: "#E2B200", borderColor: "#E2B200" },
  dateTabText: { color: "#A8A8A8", fontSize: 13, fontWeight: "600" },
  dateTabTextActive: { color: "#000" },
  scroll: { flex: 1 },
  theaterBlock: {
    marginHorizontal: 16, marginTop: 18,
    backgroundColor: "#1a1810", borderRadius: 16,
    borderWidth: 1, borderColor: "#2B271C", overflow: "hidden",
  },
  theaterHeader: {
    backgroundColor: "#2B271C", paddingHorizontal: 16, paddingVertical: 12,
  },
  theaterName: { fontSize: 16, fontWeight: "800", color: "#E2B200" },
  theaterLocation: { fontSize: 13, color: "#888", marginTop: 2 },
  timeGrid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 12, paddingVertical: 14, gap: 10,
  },
  timeBtn: {
    borderWidth: 1, borderColor: "#E2B200", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8, alignItems: "center",
    minWidth: 88,
  },
  timeBtnText: { color: "#E2B200", fontSize: 16, fontWeight: "700" },
  timeBtnPrice: { color: "#888", fontSize: 11, marginTop: 2 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#666", fontSize: 16 },
});
