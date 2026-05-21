import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useFocusEffect } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@/context/AuthContext";
import { getMyBookings } from "../services/backendApi";

type Booking = {
  id: string;
  status: string;
  total_price: string;
  created_at: string;
  showtimes: {
    start_time: string;
    price: string;
    movies: { title: string; poster_url: string } | null;
    rooms: { name: string } | null;
  } | null;
  booking_seats: { seats: { seat_row: string; seat_number: number } | null }[];
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  CONFIRMED: { label: "Da xac nhan", color: "#22c55e" },
  PENDING: { label: "Cho xac nhan", color: "#f59e0b" },
  CANCELLED: { label: "Da huy", color: "#ef4444" },
};

export default function VeDaDatScreen() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!token || !user) {
          setBookings([]);
          setError(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const data = await getMyBookings(token);
          setBookings(Array.isArray(data) ? data : []);
        } catch (e: any) {
          console.error("Load my bookings failed:", e);
          setBookings([]);
          setError(e?.message || "Khong the tai danh sach ve");
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [token, user?.name])
  );

  const renderItem = ({ item }: { item: Booking }) => {
    const movie = item.showtimes?.movies;
    const room = item.showtimes?.rooms;
    const startTime = item.showtimes?.start_time
      ? new Date(item.showtimes.start_time)
      : null;
    const seats = item.booking_seats
      .map((bs) =>
        bs.seats ? `${bs.seats.seat_row}${bs.seats.seat_number}` : ""
      )
      .filter(Boolean)
      .join(", ");
    const status = STATUS_LABEL[item.status] ?? {
      label: item.status,
      color: "#aaa",
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Image
            source={{
              uri:
                movie?.poster_url ??
                "https://via.placeholder.com/80x110?text=?",
            }}
            style={styles.poster}
          />
          <View style={styles.info}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {movie?.title ?? "Khong ro phim"}
            </Text>

            {startTime && (
              <View style={styles.infoRow}>
                <FontAwesome name="clock-o" size={13} color="#E2B200" />
                <Text style={styles.infoText}>
                  {startTime.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {"  "}
                  {startTime.toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}

            {room && (
              <View style={styles.infoRow}>
                <FontAwesome name="film" size={13} color="#E2B200" />
                <Text style={styles.infoText}>{room.name}</Text>
              </View>
            )}

            {seats ? (
              <View style={styles.infoRow}>
                <FontAwesome name="ticket" size={13} color="#E2B200" />
                <Text style={styles.infoText} numberOfLines={1}>
                  Ghe: {seats}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <Text style={styles.totalPrice}>
            {Number(item.total_price).toLocaleString("vi-VN")}d
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${status.color}22` },
            ]}
          >
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ve da dat",
          headerStyle: { backgroundColor: "#4d4931" },
          headerTitleStyle: { color: "#E2B200", fontWeight: "800" },
          headerTintColor: "#E2B200",
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={styles.container}
      >
        {!user ? (
          <View style={styles.center}>
            <FontAwesome name="lock" size={48} color="#4d4931" />
            <Text style={styles.emptyText}>Ban chua dang nhap</Text>
            <Pressable
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginBtnText}>Dang nhap ngay</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <ActivityIndicator
            color="#E2B200"
            size="large"
            style={{ marginTop: 60 }}
          />
        ) : error ? (
          <View style={styles.center}>
            <FontAwesome name="warning" size={48} color="#ef4444" />
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.center}>
            <FontAwesome name="ticket" size={48} color="#333" />
            <Text style={styles.emptyText}>
              {(user.name || "Tai khoan nay") + " chua co ve nao"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e0e" },
  list: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#1a1810",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2B271C",
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    padding: 14,
    gap: 14,
  },
  poster: {
    width: 80,
    height: 110,
    borderRadius: 10,
    backgroundColor: "#333",
  },
  info: { flex: 1, justifyContent: "center", gap: 6 },
  movieTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 2,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  infoText: { fontSize: 13, color: "#ccc", flex: 1 },
  divider: {
    borderStyle: "dashed",
    borderTopWidth: 1,
    borderColor: "#2B271C",
    marginHorizontal: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  totalPrice: { fontSize: 18, fontWeight: "800", color: "#E2B200" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 13, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  emptyText: { fontSize: 16, color: "#666", fontWeight: "600" },
  loginBtn: {
    backgroundColor: "#E2B200",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginBtnText: { color: "#000", fontWeight: "800", fontSize: 15 },
});
