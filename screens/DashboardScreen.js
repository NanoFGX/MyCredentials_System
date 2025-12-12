// screens/DashboardScreen.js
import { useIsFocused } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons"; // ✅ PDF Icon
import Badge from "../components/Badge";
import { auth, db } from "../firebaseConfig";
import { COLORS } from "../theme";

export default function DashboardScreen({ navigation }) {
  const [recentDocs, setRecentDocs] = useState([]);
  const [username, setUsername] = useState("User");
  const isFocused = useIsFocused();

  // Load data on screen focus
  useEffect(() => {
    if (isFocused) {
      loadUserInfo();
      loadRecentDocuments();
    }
  }, [isFocused]);

  const loadUserInfo = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.full_name || data.fullName || "User");
      }
    } catch (e) {
      console.log("loadUserInfo", e);
    }
  };

  const loadRecentDocuments = async () => {
    try {
      const uid = auth.currentUser.uid;
      const docsRef = collection(db, "documents");

      let q = query(
        docsRef,
        where("owner_uid", "==", uid),
        orderBy("uploaded_at", "desc"),
        limit(3)
      );
      let snap = await getDocs(q);

      if (snap.empty) {
        q = query(
          docsRef,
          where("ownerUid", "==", uid),
          orderBy("uploaded_at", "desc"),
          limit(3)
        );
        snap = await getDocs(q);
      }

      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecentDocs(results);
    } catch (error) {
      console.log("loadRecentDocuments", error);
    }
  };

  const logout = async () => {
    await auth.signOut();
    navigation.replace("Login");
  };

  const formatUploadedAt = (ts) => {
    if (!ts) return "Unknown";

    try {
      if (ts.toDate) return ts.toDate().toLocaleDateString();
      if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
      if (typeof ts === "number") return new Date(ts).toLocaleDateString();

      const d = new Date(ts);
      return !isNaN(d) ? d.toLocaleDateString() : "Unknown";
    } catch {
      return "Unknown";
    }
  };
  
  // 📄 DOCUMENT PREVIEW/VIEWER FUNCTION
  const handleDocPress = (item) => {
    const isPDF = item.file_url?.match(/\.pdf$/i);
    const isImage = item.file_url?.match(/\.(jpg|jpeg|png)$/i);
    
    // For Images/Standard Docs: Navigate to the DocumentViewer screen
    if (isImage || !isPDF) {
      navigation.navigate("DocumentViewer", { document: item });
      return;
    }

    // For PDF files: Use Linking to open in the device's native viewer
    Linking.openURL(item.file_url).catch((err) => {
      console.error("Failed to open PDF:", err);
      // Fallback to the dedicated viewer if linking fails
      navigation.navigate("DocumentViewer", { document: item });
    });
  };

  const renderDoc = ({ item }) => {
    const isImage = item.file_url?.match(/\.(jpg|jpeg|png)$/i);

    return (
      <TouchableOpacity
        style={styles.docCard}
        onPress={() => handleDocPress(item)}
      >
        {isImage ? (
          <Image source={{ uri: item.file_url }} style={styles.docThumb} />
        ) : (
          <View style={styles.pdfThumb}>
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={40}
              color="#D9534F"
            />
          </View>
        )}

        <View style={{ marginTop: 6 }}>
          <Text numberOfLines={1} style={styles.docName}>
            {item.file_name}
          </Text>
          <Text style={styles.smallText}>
            {formatUploadedAt(item.uploaded_at)}
          </Text>
        </View>

        <View style={styles.badgeWrapper}>
          <Badge label={item.category || item.ai_tag || "Unsorted"} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerName}>{username}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("UploadSelect")}
        >
          <Text style={styles.actionIcon}>⬆️</Text>
          <Text style={styles.actionText}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Vault")}
        >
          <Text style={styles.actionIcon}>📁</Text>
          <Text style={styles.actionText}>Vault</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Documents</Text>

      {recentDocs.length === 0 ? (
        <Text style={styles.emptyText}>No recent uploads.</Text>
      ) : (
        <FlatList
          data={recentDocs}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDoc}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 6 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40, flex: 1, backgroundColor: "#F7F9FC" },

  headerWrap: { marginBottom: 16 },
  header: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 20 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  headerName: { color: "white", fontSize: 22, fontWeight: "800", marginTop: 4 },

  logoutBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#d9534f",
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 18,
  },
  logoutText: { color: "white", fontSize: 14, fontWeight: "600" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    width: "48%",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionIcon: { fontSize: 28, color: "white", marginBottom: 6 },
  actionText: { fontSize: 16, color: "white", fontWeight: "700" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  emptyText: { color: "#777", fontSize: 14, textAlign: "center", marginTop: 10 },

  docCard: {
    width: 150,
    backgroundColor: "#FFF",
    padding: 8, // Reduced for a tighter card
    borderRadius: 12,
    marginRight: 14,
    elevation: 2,
  },

  docThumb: { width: "100%", height: 60, borderRadius: 8 }, // Reduced height

  pdfThumb: {
    width: "100%",
    height: 60, // Matches docThumb height
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  docName: { fontSize: 14, fontWeight: "700" },
  smallText: { fontSize: 12, color: "#6B7280" },

  badgeWrapper: { position: "absolute", top: 6, right: 6 }, // Adjusted position
});