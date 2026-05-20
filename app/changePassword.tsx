import Input from "@/components/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
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
          <Input label="Current Password" value="ajskhd" />
          <Input label="New Password" value="asjdnjaks" />
          <Input label="Confirm New Password" value="aksjbd" />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity className="bg-green-600 py-4 rounded-2xl mt-6 items-center">
          <Text className="text-white font-semibold text-base">
            Update Password
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
