// screens/DocumentViewer.js
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

export default function DocumentViewer({ route, navigation }) {
  const { document } = route.params;

  // ============================
  //  INLINE TIMESTAMP FORMATTER
  // ============================
  const formatUploadedAt = (ts) => {
    if (!ts) return "Unknown";

    try {
      if (ts.toDate) return ts.toDate().toLocaleString();
      if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
      const d = new Date(ts);
      if (!isNaN(d)) return d.toLocaleString();
    } catch {}

    return "Unknown";
  };

  const uploadedAt = formatUploadedAt(document.uploaded_at);

  const category = document.category || "Unsorted";
  const aiTag = document.ai_tag || "Unknown";

  // CATEGORY COLORS
  const categoryColors = {
    education: "#E63946",
    health: "#D90429",
    work: "#FFB703",
    insurance: "#219EBC",
    government: "#8E44AD",
    identification: "#2A9D8F",
    property: "#6A4C93",
    unsorted: "#999999",
  };

  const badgeColor = categoryColors[category.toLowerCase()] || "#999";

  // ======================================
  //    DELETE DOCUMENT FUNCTION
  // ======================================
  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Delete file from Firebase Storage
              if (document.storage_path) {
                const fileRef = ref(storage, document.storage_path);
                await deleteObject(fileRef);
              }

              // 2. Delete metadata from Firestore
              await deleteDoc(doc(db, "documents", document.id));

              Alert.alert("Deleted", "The document has been removed.");

              // 3. Navigate user back to Vault
              navigation.navigate("Vault");
            } catch (error) {
              console.log("DELETE ERROR:", error);
              Alert.alert("Error", "Failed to delete the document.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Document Viewer</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>File Information</Text>

        <Text style={styles.label}>
          Name: <Text style={styles.value}>{document.file_name}</Text>
        </Text>

        {/* CATEGORY BADGE */}
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>

        <Text style={styles.label}>
          AI Tag: <Text style={styles.value}>{aiTag}</Text>
        </Text>

        <Text style={styles.label}>
          Uploaded: <Text style={styles.value}>{uploadedAt}</Text>
        </Text>

        {/* TEXT SNIPPET */}
        {document.ai_text_snippet ? (
          <View style={styles.snippetBox}>
            <Text style={styles.snippetLabel}>Extracted Text:</Text>
            <Text style={styles.snippetText}>{document.ai_text_snippet}</Text>
          </View>
        ) : null}

        {/* DOWNLOAD BUTTON */}
        <TouchableOpacity
          style={[styles.button, styles.downloadButton]}
          onPress={() => Linking.openURL(document.file_url)}
        >
          <Text style={styles.buttonText}>↓ Download</Text>
        </TouchableOpacity>

        {/* SHARE BUTTON */}
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={() => Linking.openURL(document.file_url)}
        >
          <Text style={styles.buttonText}>📤 Share</Text>
        </TouchableOpacity>

        {/* DELETE BUTTON — NEW */}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>🗑 Delete Document</Text>
        </TouchableOpacity>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            navigation.navigate("Vault", {
              openCategory: category,
            })
          }
        >
          <Text style={styles.nextText}>Next → Go to Folder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================
//           STYLES
// ============================
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F6F8FA",
    flex: 1,
  },

  back: {
    color: "#0066FF",
    fontSize: 18,
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
  },

  value: {
    fontWeight: "400",
    color: "#333",
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  badgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  snippetBox: {
    marginTop: 15,
    backgroundColor: "#F1F3F5",
    padding: 12,
    borderRadius: 12,
  },

  snippetLabel: {
    fontWeight: "700",
    marginBottom: 6,
  },

  snippetText: {
    color: "#444",
    fontSize: 14,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  downloadButton: {
    backgroundColor: "#007BFF",
  },

  shareButton: {
    backgroundColor: "#00A86B",
  },

  deleteButton: {
    backgroundColor: "#D9534F",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  nextButton: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    alignItems: "center",
  },

  nextText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
