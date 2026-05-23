import { saveAuth } from "@/lib/auth";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  email: string;
}

const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/user/login", payload);
  return data;
};

const loginSchema = Yup.object({
  username: Yup.string().required("Username wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      await saveAuth({
        token: data.token,
        username: data.username,
        email: data.email,
      });
      Alert.alert("Success", "Login berhasil");
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      console.log(error.response.data.message);
      Alert.alert("Error", error?.response.data.message);
    },
  });

  const formik = useFormik<LoginPayload>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <View className="flex-1 justify-center px-6 bg-[#c5e8ff]">
      {/* Title */}
      <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
        Login
      </Text>

      {/* Email */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-700">Username</Text>
        <TextInput
          className="bg-white p-4 rounded-xl border border-gray-200"
          placeholder="Masukkan Username"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formik.values.username}
          onChangeText={formik.handleChange("username")}
          onBlur={formik.handleBlur("username")}
        />
        {formik.touched.username && formik.errors.username && (
          <Text className="text-red-500 text-sm mt-1">
            {formik.errors.username}
          </Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-6">
        <Text className="mb-2 text-gray-700">Password</Text>
        <View className="bg-white rounded-xl border border-gray-200 flex-row items-center">
          <TextInput
            className="flex-1 p-4"
            placeholder="Masukkan password"
            secureTextEntry={!showPassword}
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((current) => !current)}
            className="px-4"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>
        {formik.touched.password && formik.errors.password && (
          <Text className="text-red-500 text-sm mt-1">
            {formik.errors.password}
          </Text>
        )}
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => formik.handleSubmit()}
        disabled={mutation.isPending}
        className="bg-indigo-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? "Loading..." : "Login"}
        </Text>
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
