import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  Image, Pressable, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const promotions = [
  {
    id: "1",
    title: "QUÀ TẶNG ẤN PHẨM ĐỒNG HÀNH CÙNG DORAEMON...",
    image: "https://files.betacorp.vn//media/images/2026/05/19/545x415-160648-190526-87.png",
  },
  {
    id: "2",
    title: "MON Ú GHÉ RẠP - CHỐT DEAL SẬP SÀN",
    image: "https://files.betacorp.vn//media/images/2026/05/16/monugherap-545x415-095938-160526-28.png",
  },
  {
    id: "3",
    title: "ĐẶT VÉ XEM PHIM TRÊN ZALOPAY - GIẢM NGAY 15.000Đ",
    image: "https://files.betacorp.vn//media/images/2026/05/14/545x415-7-134307-140526-75.png",
  },
  {
    id: "4",
    title: "DEAL DẬY SỚM - CHỐT KÈO THƠM",
    image: "https://files.betacorp.vn//media/images/2026/04/16/545x415-1-091244-160426-63.png",
  },
  {
    id: "5",
    title: "ƯU ĐÃI ĐẶC BIỆT CHO HỘI VIÊN BETA STAR",
    image: "https://files.betacorp.vn//media/images/2025/09/24/member-545x415-2x-135314-240925-67.png",
  },
  {
    id: "6",
    title: "COMBO BẮP NƯỚC GIÁ SỐC CHỈ TỪ 59K",
    image: "https://files.betacorp.vn//media/images/2025/09/24/member-545x415-2x-135314-240925-67.png",
  },
];

const news = [
  {
    id: "1",
    title: "CHỦ TỊCH HDA GROUP GẶP GỠ LÃNH ĐẠO UBND T...",
    image: "https://files.betacorp.vn//media/images/2025/03/17/img-4704-085056-170325-44.jpeg",
  },
  {
    id: "2",
    title: "HDA Xuân Thủy, TP Hà Nội",
    image: "https://files.betacorp.vn//media/images/2025/02/14/z6316884247172-3ee9f6dbfdfc2000aeb821dc7557d5e1-140729-140225-22.jpg",
  },
  {
    id: "3",
    title: "HDA Tây Sơn, TP Hà Nội",
    image: "https://files.betacorp.vn//media/images/2025/02/14/z6316891616677-2a0b4b5e351c2901d720f8b898a5b6f8-141141-140225-60.jpg",
  },
  {
    id: "4",
    title: "HDA Vĩnh Yên, Phú Thọ",
    image: "https://files.betacorp.vn//media/images/2025/02/14/ndq08507-140224-140225-72.jpg",
  },
  {
    id: "5",
    title: "HDA Thái Bình - Rạp chiếu phim hiện đại tại Thái Bình",
    image: "https://files.betacorp.vn//media/images/2024/11/06/84ae212d-1c11-42f4-89e7-8825f416366d-114227-061124-35.jpeg",
  },
];

type Tab = "promo" | "news";

type NewsItem = { id: string; title: string; image: string | null };
type PromoItem = { id: string; title: string; image: string };

function PromoItem({ item }: { item: PromoItem }) {
  return (
    <Pressable style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle} numberOfLines={3}>{item.title}</Text>
      </View>
    </Pressable>
  );
}

function NewsItem({ item }: { item: NewsItem }) {
  return (
    <Pressable style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]} />
      )}
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle} numberOfLines={3}>{item.title}</Text>
      </View>
    </Pressable>
  );
}

export default function OffersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("promo");

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      {/* 2 tab */}
      <View style={styles.tabBar}>
        <Pressable style={styles.tabItem} onPress={() => setActiveTab("promo")}>
          <Text style={[styles.tabText, activeTab === "promo" && styles.tabTextActive]}>
            KHUYẾN MÃI MỚI
          </Text>
          {activeTab === "promo" && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => setActiveTab("news")}>
          <Text style={[styles.tabText, activeTab === "news" && styles.tabTextActive]}>
            TIN BÊN LỀ
          </Text>
          {activeTab === "news" && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      {/* Nội dung */}
      {activeTab === "promo" ? (
        <FlatList
          data={promotions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PromoItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NewsItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabItem: {
    flex: 1, alignItems: "center",
    paddingVertical: 14,
  },
  tabText: {
    fontSize: 14, fontWeight: "700", color: "#aaa", letterSpacing: 0.5,
  },
  tabTextActive: { color: "#222" },
  tabUnderline: {
    position: "absolute", bottom: 0,
    width: "70%", height: 3,
    backgroundColor: "#6b4f1e", borderRadius: 2,
  },

  // List
  list: { paddingVertical: 4 },
  separator: { height: 1, backgroundColor: "#e0e0e0" },

  // Card
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16, paddingVertical: 14,
    minHeight: 110,
  },
  cardImage: {
    width: 130, height: 90,
    borderRadius: 8, backgroundColor: "#ddd",
  },
  cardImagePlaceholder: { backgroundColor: "#e8e8e8" },
  cardTextWrap: {
    flex: 1, paddingLeft: 14, justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15, fontWeight: "800",
    color: "#111", lineHeight: 22,
  },
});
