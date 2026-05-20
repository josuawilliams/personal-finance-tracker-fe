import Input from "@/components/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-4">
        {/* HEADER */}
        <View className="flex-row items-center justify-between mt-4">
          <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
          <Text className="text-lg font-bold">Ubah Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* AVATAR */}
        <View className="items-center mt-6">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity className="mt-3 flex-row items-center">
            <Ionicons name="camera-outline" size={18} />
            <Text className="ml-2 text-green-600 font-medium">
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View className="bg-white rounded-2xl p-5 mt-6 shadow-sm">
          <Input label="Full Name" value="Josua Williams" />
          <Input label="Email" value="josua@email.com" />
          <Input label="Phone Number" value="+62 812 3456 7890" />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity className="bg-green-600 py-4 rounded-2xl mt-6 items-center">
          <Text className="text-white font-semibold text-base">
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
