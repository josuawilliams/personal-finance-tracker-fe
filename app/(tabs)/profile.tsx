import MenuItem from "@/components/MenuItem";
import { removeAuth } from "@/lib/auth";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const handleLogout = async () => {
    await removeAuth();
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-4">
        {/* HEADER */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xl font-bold">Profile</Text>
        </View>

        {/* PROFILE CARD */}
        <View className="bg-white rounded-2xl p-5 mt-5 items-center shadow-sm">
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            className="w-24 h-24 rounded-full"
          />

          <Text className="text-lg font-bold mt-3">Josua Williams</Text>

          <Text className="text-gray-400">josua@email.com</Text>

          <View className="flex flex-row gap-5">
            <TouchableOpacity
              onPress={() => router.push("/editProfile")}
              className="mt-4 bg-green-600 px-5 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Ubah Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/changePassword")}
              className="mt-4 bg-green-600 px-5 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Ubah Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MENU LIST */}
        <View className="bg-white rounded-2xl mt-5 shadow-sm">
          <MenuItem icon="person-outline" label="Personal Information" />
          <MenuItem icon="card-outline" label="Payment Methods" />
          <MenuItem icon="lock-closed-outline" label="Security Settings" />
          <MenuItem icon="notifications-outline" label="Notifications" />
          <MenuItem icon="help-circle-outline" label="Help & Support" />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 bg-red-500 py-3 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
