import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }

    // simulasi login
    if (email === "admin@gmail.com" && password === "123456") {
      Alert.alert("Success", "Login berhasil");
      router.replace("/(tabs)"); // redirect ke home
    } else {
      Alert.alert("Error", "Email atau password salah");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-[#c5e8ff]">
      {/* Title */}
      <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
        Login
      </Text>

      {/* Email */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-700">Email</Text>
        <TextInput
          className="bg-white p-4 rounded-xl border border-gray-200"
          placeholder="Masukkan email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View className="mb-6">
        <Text className="mb-2 text-gray-700">Password</Text>
        <TextInput
          className="bg-white p-4 rounded-xl border border-gray-200"
          placeholder="Masukkan password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-indigo-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>

      {/* Register */}
      <TouchableOpacity
        onPress={() => router.push("/register")}
        className="mt-4"
      >
        <Text className="text-center text-gray-600">
          Belum punya akun?{" "}
          <Text className="text-indigo-500 font-semibold">Daftar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
