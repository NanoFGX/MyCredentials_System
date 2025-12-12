// screens/Vault.js
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Badge from "../components/Badge";
import { auth, db } from "../firebaseConfig";

export default function Vault({ navigation, route }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    loadUserDocuments();
  }, []);

  // =============================
  //  TIMESTAMP FORMATTER (same as Dashboard)
  // =============================
  const formatUploadedAt = (ts) => {
    if (!ts) return "Unknown";

    if (ts?.toDate) {
      try {
        return ts.toDate().toLocaleDateString();
      } catch {}
    }

    if (ts?.seconds) {
      try {
        return new Date(ts.seconds * 1000).toLocaleDateString();
      } catch {}
    }

    if (typeof ts === "number") {
      return new Date(ts).toLocaleDateString();
    }

    try {
      const d = new Date(ts);
      if (!isNaN(d)) return d.toLocaleDateString();
    } catch {}

    return "Unknown";
  };

  // =============================
  //  LOAD USER DOCUMENTS
  // =============================
  const loadUserDocuments = async () => {
    try {
      const uid = auth.currentUser.uid;
      const docsRef = collection(db, "documents");

      // Try both owner field formats
      let q1 = query(
        docsRef,
        where("owner_uid", "==", uid),
        orderBy("uploaded_at", "desc")
      );
      let snap = await getDocs(q1);

      if (snap.empty) {
        const q2 = query(
          docsRef,
          where("ownerUid", "==", uid),
          orderBy("uploaded_at", "desc")
        );
        snap = await getDocs(q2);
      }

      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDocuments(results);

      // Group into categories
      const groups = {};
      results.forEach((doc) => {
        const cat = (doc.category || doc.ai_tag || "Unsorted").toLowerCase();
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(doc);
      });

      setGrouped(groups);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  //  RENDER DOCUMENT CARD
  // =============================
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DocumentViewer", { document: item })
      }
    >
      {item.file_url?.match(/\.(jpg|jpeg|png)$/i) ? (
        <Image source={{ uri: item.file_url }} style={styles.thumbnail} />
      ) : (
        <View style={styles.pdfBox}>
          <Text style={styles.pdfText}>PDF</Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.file_name}</Text>
        <Text style={styles.cardSubtitle}>
          {formatUploadedAt(item.uploaded_at)}
        </Text>
        <View style={{ marginTop: 8 }}>
          <Badge label={item.category || item.ai_tag || "Unsorted"} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const categories = Object.keys(grouped);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Vault</Text>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>No documents uploaded yet.</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(cat) => cat}
          renderItem={({ item: cat }) => (
            <View style={{ marginBottom: 20 }}>
              <View style={styles.folderHeader}>
                <Text style={styles.folderTitle}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
                <Badge label={cat} />
              </View>

              <FlatList
                data={grouped[cat]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(doc) => doc.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 6 }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40, flex: 1 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 18, textAlign: "center" },

  folderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  folderTitle: { fontSize: 18, fontWeight: "700" },

  card: {
    width: 260,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginRight: 14,
    flexDirection: "row",
    elevation: 2,
  },
  thumbnail: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  pdfBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pdfText: { fontSize: 18, fontWeight: "700" },

  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { fontSize: 13, color: "#666", marginTop: 6 },

  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  emptyText: { textAlign: "center", marginTop: 30, fontSize: 16, color: "#666" },
});
