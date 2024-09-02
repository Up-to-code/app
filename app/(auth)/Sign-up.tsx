import { FIREBASE_AUTH, FIREBASE_DB } from "@/lib/firebase/firebaseConfig";
import { ar } from "@/lib/lang/ar";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export default function SignUp() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createUserInFirestore = async (userId: string) => {
    try {
      await setDoc(doc(FIREBASE_DB, "users", userId), {
        name,
        age,
        email,
        id: userId,
      });
    } catch (error) {
      console.error("Error creating user document: ", error);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError(ar.errors.passwords_do_not_match || "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const userId = userCredential.user.uid;
      await createUserInFirestore(userId);
      router.replace("/home");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>إنشاء حساب</Text>
          <TextInput
            style={styles.input}
            placeholder="الاسم"
            autoCapitalize="none"
            onChangeText={setName}
            value={name}
          />
          <TextInput
            style={styles.input}
            placeholder="العمر"
            autoCapitalize="none"
            onChangeText={setAge}
            value={age}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="كلمة المرور"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="تأكيد كلمة المرور"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={styles.button}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>إنشاء حساب</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    fontSize: 32,
    fontFamily: "Cairo-ExtraBold",
    marginBottom: 20,
    color: "#343a40",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    fontSize: 18,
  },
  passwordInput: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Cairo-Bold",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Cairo-ExtraBold",
  },
});
