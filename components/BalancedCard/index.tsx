import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface BalanceCardProps {
  balance: string;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
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
        {balance}
      </Text>
    </View>
  );
}
