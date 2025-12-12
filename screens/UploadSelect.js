import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UploadSelect({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>
      <Text style={styles.subtitle}>Choose an upload method</Text>

      {/* Take Photo */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("UploadHandler", { type: "camera" })}
      >
        <Text style={styles.cardText}>📸 Take Photo</Text>
      </TouchableOpacity>

      {/* Choose from Gallery */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("UploadHandler", { type: "gallery" })}
      >
        <Text style={styles.cardText}>🖼 Upload from Gallery</Text>
      </TouchableOpacity>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 40,
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  card: {
    backgroundColor: "#0066FF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});
