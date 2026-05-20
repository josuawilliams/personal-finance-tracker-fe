import React from "react";
import { Text, View } from "react-native";

export default function SummaryCard({ type }: { type: "expense" | "savings" }) {
  const isExpense = type === "expense";

  const config = {
    expense: {
      icon: "cash-outline",
      label: "Expenses",
      amount: "$2,410.85",
      iconBg: "bg-[#2D1515]",
      iconColor: "#F87171",
      amountColor: "text-[#F87171]",
      trend: "-12% vs last month",
      trendIcon: "arrow-down",
      trendColor: "text-[#F87171]",
    },
    savings: {
      icon: "save-outline",
      label: "Savings",
      amount: "$850.00",
      iconBg: "bg-[#162916]",
      iconColor: "#4ADE80",
      amountColor: "text-[#4ADE80]",
      trend: "+5% vs last month",
      trendIcon: "arrow-up",
      trendColor: "text-[#4ADE80]",
    },
  };

  const c = isExpense ? config.expense : config.savings;

  return (
    <View className="flex-1 bg-[#111111] rounded-2xl p-4 border border-[#1E1E1E]">
      {/* Icon */}
      <View
        className={`w-10 h-10 rounded-xl ${c.iconBg} items-center justify-center mb-3`}
      >
        {/* <Ionicons name={c.icon} size={20} color={c.iconColor} /> */}
      </View>

      {/* Label */}
      <Text className="text-[#6B7280] text-xs font-medium mb-1">{c.label}</Text>

      {/* Amount */}
      <Text className={`text-xl font-bold ${c.amountColor} mb-2`}>
        {c.amount}
      </Text>

      {/* Trend */}
      <View className="flex-row items-center">
        {/* <Ionicons
          name={c.trendIcon}
          size={10}
          color={isExpense ? "#F87171" : "#4ADE80"}
        /> */}
        <Text className={`text-xs ml-1 ${c.trendColor}`}>{c.trend}</Text>
      </View>
    </View>
  );
}
