import * as DocumentPicker from "expo-document-picker";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db, storage } from "../firebaseConfig";

const AI_URL = "http://10.0.2.2:8000/classify"; // Android emulator → FastAPI

// ⭐ Convert URI → Blob (Expo-safe)
const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("uriToBlob failed"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

export default function UploadHandler({ navigation }) {
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const lower = file.name.toLowerCase();

      if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg")) {
        Alert.alert("Only JPG/JPEG files are allowed.");
        return;
      }

      await uploadFile(file);

    } catch (error) {
      Alert.alert("Error selecting file", error.message);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);

    try {
      const uid = auth.currentUser.uid;

      // 1. Create initial Firestore doc
      const docRef = await addDoc(collection(db, "documents"), {
        file_name: file.name,
        owner_uid: uid,
        ai_tag: "Pending",
        category: "Unsorted",
        ic_number: "",
        file_url: "",
        storage_path: "",
        uploaded_at: serverTimestamp(),
      });

      const docId = docRef.id;

      // 2. Build Firebase Storage path
      const storagePath = `documents/${uid}/${docId}_${file.name}`;
      const fileRef = ref(storage, storagePath);

      // ⭐ SAFE EXPO BLOB UPLOAD — NO BASE64 AT ALL
      const blob = await uriToBlob(file.uri);

      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);

      // 3. Send file to FastAPI
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: file.name,
      });

      const aiResp = await fetch(AI_URL, {
        method: "POST",
        body: formData,
      });

      const aiJson = await aiResp.json();

      // 4. Update Firestore with AI results
      await updateDoc(doc(db, "documents", docId), {
        file_url: downloadUrl,
        storage_path: storagePath,
        ai_tag: aiJson.label || "Unknown",
        category: aiJson.label || "Unsorted",
        ic_number: aiJson.ic || "",
        ai_confidence: aiJson.confidence || null,
        ai_text_snippet: aiJson.text_snippet || "",
        processed_at: serverTimestamp(),
      });

      setUploading(false);

      // Navigate to viewer
      navigation.navigate("DocumentViewer", {
        document: {
          id: docId,
          file_name: file.name,
          file_url: downloadUrl,
          category: aiJson.label || "Unsorted",
          ai_tag: aiJson.label || "Unknown",
        },
      });

    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      Alert.alert("Upload failed", error.message);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your JPG</Text>

      <TouchableOpacity style={styles.button} onPress={pickDocument} disabled={uploading}>
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Choose JPG File"}
        </Text>
      </TouchableOpacity>

      {uploading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text>Uploading & classifying...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  button: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 12,
    width: "70%",
  },
  buttonText: { color: "white", fontSize: 16, textAlign: "center" },
  loading: { marginTop: 20, alignItems: "center" },
});
