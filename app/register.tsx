import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak sama");
      return;
    }

    // simulasi register sukses
    Alert.alert("Success", "Akun berhasil dibuat");

    // redirect ke login
    router.replace("/login");
  };

  return (
    <View className="flex-1 justify-center px-6 bg-[#c5e8ff]">
      {/* Title */}
      <Text className="text-3xl font-bold text-center mb-2 text-gray-800">
        Create Account
      </Text>
      <Text className="text-center text-gray-500 mb-8">
        Daftar untuk mulai menggunakan aplikasi
      </Text>

      {/* Name */}
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 mb-4"
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />

      {/* Email */}
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 mb-6"
        placeholder="Konfirmasi Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Button */}
      <TouchableOpacity
        onPress={handleRegister}
        className="bg-indigo-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-base">
          Register
        </Text>
      </TouchableOpacity>

      {/* Login redirect (hanya "Login" yang bisa diklik) */}
      <Text className="text-center text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Text
          className="text-indigo-500 font-semibold underline"
          onPress={() => router.push("/login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}
