import { removeAuth } from "@/lib/auth";
import { apiClient } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserProfile {
  gender?: string | null;
  address?: string | null;
  mobileNumber?: string | null;
}

interface UserMeResponse {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile | null;
  walletBalance: number;
}

const getUserMe = async (): Promise<UserMeResponse> => {
  const { data } = await apiClient.get<UserMeResponse>("/user/me");
  return data;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const displayValue = (value?: string | null) => value || "-";

export default function ProfileScreen() {
  const userQuery = useQuery({
    queryKey: ["user-me"],
    queryFn: getUserMe,
  });

  const user = userQuery.data;
  const profile = user?.profile;
  const walletBalance = formatCurrency(user?.walletBalance ?? 0);

  const handleLogout = async () => {
    await removeAuth();
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        className="px-4"
        refreshControl={
          <RefreshControl
            refreshing={userQuery.isRefetching}
            onRefresh={() => userQuery.refetch()}
            tintColor="#16A34A"
            colors={["#16A34A"]}
          />
        }
      >
        {/* HEADER */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xl font-bold">Profile</Text>
        </View>

        {/* PROFILE CARD */}
        <View className="bg-white rounded-2xl p-5 mt-5 items-center shadow-sm">
          {userQuery.isLoading ? (
            <View className="py-8">
              <ActivityIndicator size="large" color="#16A34A" />
            </View>
          ) : (
            <>
              <Text className="text-lg font-bold mt-3">
                {displayValue(user?.username)}
              </Text>

              <Text className="text-gray-400">{displayValue(user?.email)}</Text>

              <View className="w-full mt-5 bg-gray-50 rounded-2xl p-4">
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-500">Gender</Text>
                  <Text className="font-semibold text-gray-800">
                    {displayValue(profile?.gender)}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-500">Alamat</Text>
                  <Text className="font-semibold text-gray-800 text-right flex-1 ml-4">
                    {displayValue(profile?.address)}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-500">No. HP</Text>
                  <Text className="font-semibold text-gray-800">
                    {displayValue(profile?.mobileNumber)}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-500">Saldo Wallet</Text>
                  <Text className="font-semibold text-gray-800">
                    {walletBalance}
                  </Text>
                </View>
              </View>

              {userQuery.isError && (
                <Text className="text-red-500 text-sm mt-4 text-center">
                  Gagal mengambil data profile
                </Text>
              )}
            </>
          )}

          <View className="flex flex-row gap-5">
            <TouchableOpacity
              onPress={() => router.push("/changePassword")}
              className="mt-4 bg-green-600 px-5 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Ubah Password</Text>
            </TouchableOpacity>
          </View>
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
