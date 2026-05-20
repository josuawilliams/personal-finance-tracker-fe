import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function BalanceCard() {
  return (
    <View className="mx-4 mt-5 bg-[#0A0A0A] rounded-3xl p-6 shadow-2xl overflow-hidden">
      <View className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[#1a2e1a] opacity-60" />
      <View className="absolute top-10 -right-4 w-20 h-20 rounded-full bg-[#0f3d0f] opacity-40" />

      <View className="absolute top-5 right-5 bg-[#1C3B1C] rounded-2xl p-3">
        <Ionicons name="wallet" size={22} color="#4ADE80" />
      </View>

      <Text className="text-[#6B7280] text-xs font-semibold tracking-widest mb-3">
        TOTAL WALLET BALANCE
      </Text>

      <Text className="text-white text-4xl font-bold tracking-tight mb-3">
        $42,950<Text className="text-2xl text-[#9CA3AF]">.00</Text>
      </Text>

      <View className="flex-row items-center">
        <View className="flex-row items-center bg-[#14532D] px-3 py-1.5 rounded-full">
          <Ionicons name="arrow-up" size={12} color="#4ADE80" />
          <Text className="text-[#4ADE80] text-xs font-bold ml-1">
            +2.4% this month
          </Text>
        </View>
      </View>

      <View className="mt-5 pt-4 border-t border-[#1F1F1F] flex-row justify-between">
        <View>
          <Text className="text-[#6B7280] text-xs mb-1">Income</Text>
          <Text className="text-white text-sm font-semibold">$5,250.00</Text>
        </View>
        <View className="w-px bg-[#2D2D2D]" />
        <View>
          <Text className="text-[#6B7280] text-xs mb-1">Spending</Text>
          <Text className="text-white text-sm font-semibold">$2,410.85</Text>
        </View>
        <View className="w-px bg-[#2D2D2D]" />
        <View>
          <Text className="text-[#6B7280] text-xs mb-1">Saved</Text>
          <Text className="text-white text-sm font-semibold">$850.00</Text>
        </View>
      </View>
    </View>
  );
}
