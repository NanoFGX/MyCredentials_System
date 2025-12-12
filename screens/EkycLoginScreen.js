// screens/EkycLoginScreen.js
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const AI_URL = "http://10.0.2.2:8000/ekyc";

export default function EkycLoginScreen({ navigation }) {
  const [icNumber, setIcNumber] = useState("");
  const [icImage, setIcImage] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===========================================
  // Pick image helper
  // ===========================================
  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ===========================================
  // Take photo
  // ===========================================
  const takePhoto = async (setImage) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ===========================================
  // Submit for EKYC verification
  // ===========================================
  const submitEKYC = async () => {
    if (!icNumber || icNumber.length !== 12) {
      Alert.alert("Please enter your 12-digit IC number.");
      return;
    }

    if (!icImage) {
      Alert.alert("Please upload or take an IC photo.");
      return;
    }

    if (!selfie) {
      Alert.alert("Please take a selfie.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("ic_number", icNumber);
      formData.append("ic_image", {
        uri: icImage,
        type: "image/jpeg",
        name: "ic.jpg",
      });
      formData.append("selfie", {
        uri: selfie,
        type: "image/jpeg",
        name: "selfie.jpg",
      });

      const res = await fetch(AI_URL, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      console.log(json);

      if (!json.match) {
        setLoading(false);
        Alert.alert(
          "Identity Verification Failed",
          "Your face does not match the IC image. Please try again."
        );
        return;
      }

      // ===========================================
      // LOGIN (anonymous uid = your identity)
      // ===========================================
      const cred = await signInAnonymously(auth);
      const uid = cred.user.uid;

      // ===========================================
      // CREATE FIRESTORE USER PROFILE
      // ===========================================
      await setDoc(doc(db, "users", uid), {
        full_name: json.name || "New User",
        ic_number: icNumber,
        created_at: new Date(),
      });

      setLoading(false);
      Alert.alert("Success!", "Identity verified successfully!");

      navigation.replace("Dashboard");

    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert("Server Error", "Unable to verify identity.");
    }
  };

  // ===========================================
  // UI
  // ===========================================
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>eKYC Identity Verification</Text>

      {/* Step 1: IC number input */}
      <TextInput
        placeholder="Enter IC Number (12 digits)"
        style={styles.input}
        keyboardType="numeric"
        maxLength={12}
        value={icNumber}
        onChangeText={setIcNumber}
      />

      {/* Step 2: IC photo */}
      <Text style={styles.label}>Upload Your IC</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => pickImage(setIcImage)}>
          <Text style={styles.btnText}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtn} onPress={() => takePhoto(setIcImage)}>
          <Text style={styles.btnText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {icImage && <Image source={{ uri: icImage }} style={styles.preview} />}

      {/* Step 3: Selfie */}
      <Text style={styles.label}>Take Selfie</Text>
      <TouchableOpacity style={styles.bigBtn} onPress={() => takePhoto(setSelfie)}>
        <Text style={styles.btnText}>Take Selfie</Text>
      </TouchableOpacity>

      {selfie && <Image source={{ uri: selfie }} style={styles.preview} />}

      {/* Step 4: Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={submitEKYC}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Verify Identity</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ===========================================
// Styles
// ===========================================
const styles = StyleSheet.create({
  container: { padding: 22, backgroundColor: "#F7F9FC" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  row: { flexDirection: "row", gap: 10, marginBottom: 10 },

  smallBtn: {
    flex: 1,
    backgroundColor: "#0066FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  bigBtn: {
    backgroundColor: "#0066FF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  btnText: { color: "white", fontSize: 16, fontWeight: "600" },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  submitText: { color: "white", fontSize: 18, fontWeight: "700" },

  back: {
    textAlign: "center",
    marginTop: 20,
    color: "#0066FF",
    fontSize: 16,
  },
});
