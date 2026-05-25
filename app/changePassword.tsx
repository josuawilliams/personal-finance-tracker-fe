import { removeAuth } from "@/lib/auth";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordForm extends ChangePasswordPayload {
  confirmPassword: string;
}

const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await apiClient.post("/user/change-password", payload);
  return data;
};

const changePasswordSchema = Yup.object({
  oldPassword: Yup.string().required("Password lama wajib diisi"),
  newPassword: Yup.string()
    .min(6, "Password baru minimal 6 karakter")
    .required("Password baru wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Konfirmasi password tidak sama")
    .required("Konfirmasi password wajib diisi"),
});

export default function ChangePasswordScreen() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: async () => {
      await removeAuth();
      Alert.alert("Success", "Password berhasil diubah");
      router.replace("/login");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Gagal mengubah password",
      );
    },
  });

  const formik = useFormik<ChangePasswordForm>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: ({ oldPassword, newPassword }) => {
      mutation.mutate({ oldPassword, newPassword });
    },
  });

  const renderPasswordInput = (
    label: string,
    field: keyof ChangePasswordForm,
    isVisible: boolean,
    toggleVisible: () => void,
  ) => (
    <View className="mb-4">
      <Text className="text-gray-500 mb-1">{label}</Text>
      <View className="border border-gray-300 rounded-xl px-4 flex-row items-center">
        <TextInput
          className="flex-1 py-3"
          secureTextEntry={!isVisible}
          value={formik.values[field]}
          onChangeText={formik.handleChange(field)}
          onBlur={formik.handleBlur(field)}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={toggleVisible} className="ml-2 p-1">
          <Ionicons
            name={isVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>
      {formik.touched[field] && formik.errors[field] && (
        <Text className="text-red-500 text-sm mt-1">
          {formik.errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-4">
        {/* HEADER */}
        <View className="flex-row items-center justify-between mt-4">
          <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
          <Text className="text-lg font-bold">Ubah Password</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* FORM */}
        <View className="bg-white rounded-2xl p-5 mt-6 shadow-sm">
          {renderPasswordInput(
            "Current Password",
            "oldPassword",
            showOldPassword,
            () => setShowOldPassword((current) => !current),
          )}
          {renderPasswordInput(
            "New Password",
            "newPassword",
            showNewPassword,
            () => setShowNewPassword((current) => !current),
          )}
          {renderPasswordInput(
            "Confirm New Password",
            "confirmPassword",
            showConfirmPassword,
            () => setShowConfirmPassword((current) => !current),
          )}
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          disabled={mutation.isPending}
          className="bg-green-600 py-4 rounded-2xl mt-6 items-center"
        >
          <Text className="text-white font-semibold text-base">
            {mutation.isPending ? "Loading..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
