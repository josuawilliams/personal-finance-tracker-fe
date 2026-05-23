import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface ProfilePayload {
  gender: string;
  address: string;
  mobileNumber: string;
}

interface RegisterPayload {
  username: string;
  name: string;
  email: string;
  password: string;
  profile: ProfilePayload;
}

const registerUser = async (payload: RegisterPayload): Promise<string> => {
  const { data } = await apiClient.post<string>("/user/register", payload);
  return data;
};

const registerSchema = Yup.object({
  username: Yup.string().required("Username wajib diisi"),
  name: Yup.string().required("Nama wajib diisi"),
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak sama")
    .required("Konfirmasi password wajib diisi"),
  gender: Yup.string().required("Gender wajib diisi"),
  address: Yup.string().required("Alamat wajib diisi"),
  mobileNumber: Yup.string().required("No. HP wajib diisi"),
});

const GENDER_OPTIONS = [
  { label: "Laki-laki", value: "Laki-laki" },
  { label: "Perempuan", value: "Perempuan" },
];

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const mutation = useMutation<string, Error, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      Alert.alert("Success", data || "Akun berhasil dibuat");
      router.replace("/login");
    },
    onError: (error: any) => {
      console.log(error.response.data.message);
      Alert.alert("Error", error?.response.data.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      address: "",
      mobileNumber: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...rest } = values;
      mutation.mutate({
        ...rest,
        profile: {
          gender: values.gender,
          address: values.address,
          mobileNumber: values.mobileNumber,
        },
      });
    },
  });

  const renderInput = (
    placeholder: string,
    field: string,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: any;
      autoCapitalize?: any;
    },
  ) => (
    <View className="mb-4">
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200"
        placeholder={placeholder}
        value={(formik.values as any)[field]}
        onChangeText={formik.handleChange(field)}
        onBlur={formik.handleBlur(field)}
        {...options}
      />
      {formik.touched[field as keyof typeof formik.touched] &&
        formik.errors[field as keyof typeof formik.errors] && (
          <Text className="text-red-500 text-sm mt-1">
            {formik.errors[field as keyof typeof formik.errors]}
          </Text>
        )}
    </View>
  );

  const renderPasswordInput = (
    placeholder: string,
    field: "password" | "confirmPassword",
    visible: boolean,
    toggle: () => void,
  ) => (
    <View className="mb-4">
      <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4">
        <TextInput
          className="flex-1 py-4 text-base"
          placeholder={placeholder}
          secureTextEntry={!visible}
          value={(formik.values as any)[field]}
          onChangeText={formik.handleChange(field)}
          onBlur={formik.handleBlur(field)}
        />
        <TouchableOpacity onPress={toggle} className="ml-2 p-1">
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
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
    <View className="flex-1 justify-center px-6 bg-[#c5e8ff]">
      {/* Title */}
      <Text className="text-3xl font-bold text-center mb-2 text-gray-800">
        Create Account
      </Text>
      <Text className="text-center text-gray-500 mb-8">
        Daftar untuk mulai menggunakan aplikasi
      </Text>

      {renderInput("Username", "username")}

      {renderInput("Nama lengkap", "name")}

      {renderInput("Email", "email", {
        keyboardType: "email-address",
        autoCapitalize: "none",
      })}

      {renderPasswordInput("Password", "password", showPassword, () =>
        setShowPassword((prev) => !prev),
      )}

      {renderPasswordInput(
        "Konfirmasi Password",
        "confirmPassword",
        showConfirmPassword,
        () => setShowConfirmPassword((prev) => !prev),
      )}

      {/* Gender Dropdown */}
      <View className="mb-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setGenderOpen((prev) => !prev)}
          className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200"
        >
          <Text
            className={formik.values.gender ? "text-gray-900" : "text-gray-400"}
          >
            {formik.values.gender || "Pilih Gender"}
          </Text>
          <Ionicons
            name={genderOpen ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>

        {genderOpen && (
          <View className="mt-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.6}
                onPress={() => {
                  formik.setFieldValue("gender", opt.value);
                  formik.setFieldTouched("gender", true);
                  setGenderOpen(false);
                }}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-gray-800">{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {formik.touched.gender && formik.errors.gender && (
          <Text className="text-red-500 text-sm mt-1">
            {formik.errors.gender}
          </Text>
        )}
      </View>

      {renderInput("Alamat", "address")}

      {renderInput("No. HP", "mobileNumber", { keyboardType: "phone-pad" })}

      {/* Button */}
      <TouchableOpacity
        onPress={() => formik.handleSubmit()}
        disabled={mutation.isPending}
        className="bg-indigo-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-base">
          {mutation.isPending ? "Loading..." : "Register"}
        </Text>
      </TouchableOpacity>

      {/* Login redirect */}
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
