import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { ar } from "@/lib/lang/ar";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email.trim(), password.trim());
      router.replace("/");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>تسجيل الدخول</Text>
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>تسجيل الدخول</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.signUpButton]} onPress={() => router.push('/Sign-up')}>
            <Text style={styles.buttonText}>إنشاء حساب</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "#343a40",
    fontFamily: "Cairo-Bold",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    fontSize: 16,
    paddingVertical: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Cairo-Bold",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 5,
  },
  signUpButton: {
    backgroundColor: "#354fe2",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Cairo-Bold",
  },
});
