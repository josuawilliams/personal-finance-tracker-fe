import React from "react";
import { Text, View } from "react-native";

interface SummaryCardProps {
  type: "expense" | "savings";
  amount: string;
}

export default function SummaryCard({ type, amount }: SummaryCardProps) {
  const isExpense = type === "expense";

  const config = {
    expense: {
      icon: "cash-outline",
      label: "Expenses",
      iconBg: "bg-[#2D1515]",
      iconColor: "#F87171",
      amountColor: "text-[#F87171]",
      trendIcon: "arrow-down",
      trendColor: "text-[#F87171]",
    },
    savings: {
      icon: "save-outline",
      label: "Savings",
      iconBg: "bg-[#162916]",
      iconColor: "#4ADE80",
      amountColor: "text-[#4ADE80]",
      trendIcon: "arrow-up",
      trendColor: "text-[#4ADE80]",
    },
  };

  const c = isExpense ? config.expense : config.savings;

  return (
    <View className="flex-1 bg-[#111111] rounded-2xl p-4 border border-[#1E1E1E]">
      {/* Label */}
      <Text className="text-[#6B7280] text-xs font-medium mb-1">{c.label}</Text>
      {/* Amount */}
      <Text className={`text-xl font-bold ${c.amountColor} mb-2`}>
        {amount}
      </Text>

      {/* Trend */}
      <View className="flex-row items-center">
        {/* <Ionicons
          name={c.trendIcon}
          size={10}
          color={isExpense ? "#F87171" : "#4ADE80"}
        /> */}
      </View>
    </View>
  );
}
