import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export default function AddVoucherScreen() {
  return (
    <View style={styles.regionList}>
      <FontAwesome name="gift" size={200} color="#aaaaaa" />
      <Text style={styles.title}>Kho chưa có voucher nào</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  regionList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
