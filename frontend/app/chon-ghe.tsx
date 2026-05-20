import { useEffect, useState, useMemo } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { getSeatsByShowtime, createBooking } from "../services/backendApi";
import { useAuth } from "../context/AuthContext";

type Seat = {
  id: string;
  seat_row: string;
  seat_number: number;
  status?: "BOOKED" | "AVAILABLE";
  isBooked?: boolean;
  is_booked?: boolean;
};

export default function ChonGheScreen() {
  const { showtimeId, movieTitle, theaterName, time, date, price, roomName } =
    useLocalSearchParams<{
      showtimeId: string; movieTitle: string; theaterName: string;
      time: string; date: string; price: string; roomName: string;
    }>();

  const { token, user } = useAuth();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSeatsByShowtime(showtimeId);
        const normalizedSeats: Seat[] = data.map((seat: any) => ({
          ...seat,
          id: String(seat.id),
          isBooked:
            seat.isBooked === true ||
            seat.is_booked === true ||
            seat.status === "BOOKED",
        }));
        setSeats(normalizedSeats);
      } catch (e) {
        console.error(e);
        Alert.alert("Loi tai ghe", "Khong the tai danh sach ghe.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showtimeId]);

  // Nhóm ghế theo hàng
  const rows = useMemo(() => {
    const map: Record<string, Seat[]> = {};
    for (const seat of seats) {
      const r = seat.seat_row || "?";
      if (!map[r]) map[r] = [];
      map[r].push(seat);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  const toggleSeat = (id: string, isBooked?: boolean) => {
    if (isBooked) return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selected.length * Number(price || 0);

  const handleBooking = async () => {
    if (!token) {
      Alert.alert("Chưa đăng nhập", "Bạn cần đăng nhập để đặt vé.", [
        { text: "Đăng nhập", onPress: () => router.push("/login") },
        { text: "Hủy", style: "cancel" },
      ]);
      return;
    }
    if (selected.length === 0) {
      Alert.alert("Chưa chọn ghế", "Vui lòng chọn ít nhất 1 ghế.");
      return;
    }

    setBooking(true);
    try {
      const result = await createBooking(token, {
        showtime_id: Number(showtimeId),
        seat_ids: selected.map(Number),
      });
      Alert.alert(
        "Đặt vé thành công! 🎉",
        `Phim: ${movieTitle}\nRạp: ${theaterName}\nSuất: ${time} - ${date}\nGhế: ${selected.length} ghế\nTổng: ${totalPrice.toLocaleString("vi-VN")}đ`,
        [{ text: "OK", onPress: () => router.push("/") }]
      );
    } catch (e: any) {
      Alert.alert("Lỗi", e.message || "Không thể đặt vé. Vui lòng thử lại.");
    } finally {
      setBooking(false);
    }
  };

  const getSeatStyle = (seat: Seat) => {
    if (seat.isBooked) return [styles.seat, styles.seatBooked];
    if (selected.includes(seat.id)) return [styles.seat, styles.seatSelected];
    return [styles.seat, styles.seatAvail];
  };

  const getSeatTextStyle = (seat: Seat) => {
    if (seat.isBooked) return styles.seatTextBooked;
    if (selected.includes(seat.id)) return styles.seatTextSelected;
    return styles.seatTextAvail;
  };

  return (
    <>
      <Stack.Screen options={{
        title: "Chọn ghế",
        headerStyle: { backgroundColor: "#4d4931" },
        headerTitleStyle: { color: "#E2B200", fontWeight: "800" },
        headerTintColor: "#E2B200",
      }} />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
        {/* Info bar */}
        <View style={styles.infoBar}>
          <Text style={styles.infoTitle} numberOfLines={1}>{movieTitle}</Text>
          <Text style={styles.infoSub}>{theaterName}  •  {roomName}</Text>
          <Text style={styles.infoSub}>{date}  •  {time}</Text>
        </View>

        {/* Màn chiếu */}
        <View style={styles.screenWrap}>
          <View style={styles.screen} />
          <Text style={styles.screenLabel}>MÀN CHIẾU</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#E2B200" size="large" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {rows.map(([row, rowSeats]) => (
              <View key={row} style={styles.rowWrap}>
                <Text style={styles.rowLabel}>{row}</Text>
                <View style={styles.rowSeats}>
                  {rowSeats
                    .sort((a, b) => a.seat_number - b.seat_number)
                    .map(seat => (
                      <Pressable
                        key={seat.id}
                        style={getSeatStyle(seat)}
                        onPress={() => toggleSeat(seat.id, seat.isBooked)}
                      >
                        <Text style={getSeatTextStyle(seat)}>
                          {seat.seat_number}
                        </Text>
                      </Pressable>
                    ))}
                </View>
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
            <View style={{ height: 16 }} />
          </ScrollView>
        )}

        {/* Chú thích */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#2a2a2a", borderColor: "#555" }]} />
            <Text style={styles.legendText}>Trống</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#E2B200" }]} />
            <Text style={styles.legendText}>Đang chọn</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#22c55e", borderColor: "#16a34a" }]} />
            <Text style={styles.legendText}>Đã bán</Text>
          </View>
        </View>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.selectedCount}>
              {selected.length > 0 ? `${selected.length} ghế đã chọn` : "Chưa chọn ghế"}
            </Text>
            {selected.length > 0 && (
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString("vi-VN")}đ
              </Text>
            )}
          </View>
          <Pressable
            style={[styles.bookBtn, (selected.length === 0 || booking) && styles.bookBtnDisabled]}
            onPress={handleBooking}
            disabled={selected.length === 0 || booking}
          >
            <Text style={styles.bookBtnText}>
              {booking ? "Đang đặt..." : "Đặt vé"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const SEAT_SIZE = 36;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e0e" },
  infoBar: {
    backgroundColor: "#1a1810", paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#2B271C",
  },
  infoTitle: { fontSize: 15, fontWeight: "800", color: "#FFF", marginBottom: 4 },
  infoSub: { fontSize: 13, color: "#A8A8A8", marginTop: 2 },
  screenWrap: { alignItems: "center", marginTop: 20, marginBottom: 8 },
  screen: {
    width: "75%", height: 6, backgroundColor: "#E2B200",
    borderRadius: 3, shadowColor: "#E2B200", shadowOpacity: 0.7,
    shadowRadius: 10, elevation: 6,
  },
  screenLabel: { color: "#666", fontSize: 11, marginTop: 6, letterSpacing: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: 12, paddingHorizontal: 8 },
  rowWrap: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 8, justifyContent: "center",
  },
  rowLabel: { width: 20, color: "#666", fontSize: 12, fontWeight: "700", textAlign: "center" },
  rowSeats: { flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center", flex: 1 },
  seat: {
    width: SEAT_SIZE, height: SEAT_SIZE, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1,
  },
  seatAvail: { backgroundColor: "#2a2a2a", borderColor: "#555" },
  seatSelected: { backgroundColor: "#E2B200", borderColor: "#E2B200" },
  seatBooked: { backgroundColor: "#22c55e", borderColor: "#16a34a" },
  seatTextAvail: { color: "#CCC", fontSize: 11, fontWeight: "600" },
  seatTextSelected: { color: "#000", fontSize: 11, fontWeight: "800" },
  seatTextBooked: { color: "#fff", fontSize: 11 },
  legend: {
    flexDirection: "row", justifyContent: "center", gap: 24,
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#1e1e1e",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: "transparent" },
  legendText: { color: "#888", fontSize: 12 },
  bottomBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: "#1a1810", borderTopWidth: 1, borderTopColor: "#2B271C",
  },
  selectedCount: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  totalPrice: { color: "#E2B200", fontSize: 20, fontWeight: "800", marginTop: 2 },
  bookBtn: {
    backgroundColor: "#E2B200", paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  bookBtnDisabled: { backgroundColor: "#4a4020", opacity: 0.6 },
  bookBtnText: { color: "#000", fontSize: 16, fontWeight: "800" },
});
