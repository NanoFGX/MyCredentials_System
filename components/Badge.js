import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme";

export default function Badge({ label, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color || COLORS.gray }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
