import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import firebaseConfig, { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const recaptchaVerifier = useRef(null);

  const [icNumber, setIcNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);

  // Step 1 — Send OTP
  const sendOTP = async () => {
    if (!icNumber || icNumber.length < 12) {
      alert("Please enter a valid IC Number (12 digits)");
      return;
    }
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationIdResult = await phoneProvider.verifyPhoneNumber(
        "+6" + phone,
        recaptchaVerifier.current
      );

      setVerificationId(verificationIdResult);
      alert("OTP sent to your phone");
    } catch (error) {
      alert(error.message);
    }
  };

  // Step 2 — Verify OTP + Login
  const verifyOTP = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);

      navigation.replace("Dashboard");
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <Text style={styles.title}>MyCredentials Login</Text>

      {!verificationId ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter IC Number (12 digits)"
            keyboardType="numeric"
            maxLength={12}
            value={icNumber}
            onChangeText={setIcNumber}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number (e.g. 0123456789)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity style={styles.button} onPress={sendOTP}>
            <Text style={styles.buttonText}>Request OTP</Text>
          </TouchableOpacity>

          {/* ------------------------------- */}
          {/*     ADD eKYC LOGIN OPTION       */}
          {/* ------------------------------- */}
          <TouchableOpacity
            style={styles.ekycButton}
            onPress={() => navigation.navigate("EKYC")}
          >
            <Text style={styles.ekycText}>Sign Up using eKYC (Face + IC)</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={styles.button} onPress={verifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVerificationId(null)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0066FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  ekycButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#0066FF",
  },
  ekycText: {
    textAlign: "center",
    color: "#0066FF",
    fontSize: 16,
    fontWeight: "700",
  },
  backText: {
    marginTop: 15,
    textAlign: "center",
    color: "#0066FF",
    fontSize: 16,
  },
});
