import TransactionItem from "@/components/TransactionCard";
import { transactions } from "@/constants/dummy";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#c5e8ff]" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />
      <View className="flex-row justify-between items-center px-5 py-3">
        <View>
          <Text className="text-[#4ADE80] text-2xl font-bold tracking-tight">
            FinTrack
          </Text>
          <Text className="text-[#4B5563] text-xs">Good morning, Alex 👋</Text>
        </View>
        <View className="flex-row items-center gap-2">
          {/* Settings */}
          <TouchableOpacity
            className="w-10 h-10 bg-[#111111] rounded-full items-center justify-center border border-[#1E1E1E]"
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Avatar */}
          <TouchableOpacity activeOpacity={0.8}>
            <View className="w-10 h-10 rounded-full bg-[#166534] items-center justify-center border-2 border-[#4ADE80]">
              <Text className="text-[#4ADE80] text-sm font-bold">A</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="px-4">
        {/* HEADER */}
        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-lg font-bold text-black">
            Wallet Historical
          </Text>
        </View>

        {/* BALANCE CARD */}
        <View className="bg-white rounded-2xl p-5 mt-5 shadow-sm">
          <Text className="text-gray-400">Available Balance</Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-green-600">
              $12,450.00
            </Text>
            <View className="ml-3 bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-600 text-sm font-semibold">
                +2.4%
              </Text>
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View className="flex-row gap-3 mt-5">
          <TouchableOpacity className="flex-1 bg-green-600 py-3 rounded-full flex-row justify-center items-center">
            <Ionicons name="arrow-down" size={18} color="white" />
            <Text className="text-white ml-2 font-semibold">Top-up</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 border border-gray-300 py-3 rounded-full flex-row justify-center items-center">
            <Ionicons name="arrow-up" size={18} />
            <Text className="ml-2 font-semibold">Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER TABS */}
        <View className="flex-row gap-3 mt-5">
          <View className="bg-green-600 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">All Activities</Text>
          </View>

          <View className="border border-gray-300 px-4 py-2 rounded-full">
            <Text className="text-gray-600">Top-ups</Text>
          </View>

          <View className="border border-gray-300 px-4 py-2 rounded-full">
            <Text className="text-gray-600">Withdrawals</Text>
          </View>
        </View>

        {/* TODAY */}
        <Text className="mt-6 text-gray-500 font-semibold">TODAY, OCT 24</Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          scrollEnabled={false}
        />

        {/* YESTERDAY */}
        <Text className="mt-6 text-gray-500 font-semibold">
          YESTERDAY, OCT 23
        </Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
