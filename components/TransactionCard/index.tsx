import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { ComponentProps } from "react";
import { Text, View } from "react-native";

interface TransactionItemData {
  id: number;
  amount: number;
  transactionType: "INCOME" | "EXPENSE";
  description: string;
  note: string;
  category: string;
  createdAt: string;
}

export default function TransactionItem({ item }: { item: TransactionItemData }) {
  type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

  const iconMap: Record<
    string,
    { icon: MaterialIconName; bg: string; color: string }
  > = {
    cart: { icon: "shopping-cart", bg: "bg-[#1a2040]", color: "#818CF8" },
    briefcase: { icon: "work", bg: "bg-[#162916]", color: "#4ADE80" },
    cloud: { icon: "cloud", bg: "bg-[#1a2040]", color: "#60A5FA" },
    laptop: { icon: "laptop", bg: "bg-[#162916]", color: "#4ADE80" },
    tv: { icon: "tv", bg: "bg-[#2D1515]", color: "#F87171" },
  };

  const categoryKey = item.category.toLowerCase();
  const isIncome = item.transactionType === "INCOME";
  const iconConfig = iconMap[categoryKey] || (isIncome ? iconMap.briefcase : iconMap.cart);

  const formattedAmount = isIncome
    ? `+${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      }).format(item.amount)}`
    : `-${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      }).format(item.amount)}`;

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(item.createdAt));

  return (
    <View className="flex-row items-center py-3 px-4 bg-[#111111] rounded-2xl mb-2.5 border border-[#1A1A1A]">
      {/* Icon Box */}
      <View
        className={`w-11 h-11 rounded-xl ${iconConfig.bg} items-center justify-center mr-3`}
      >
        <MaterialIcons
          name={iconConfig.icon}
          size={20}
          color={iconConfig.color}
        />
      </View>

      {/* Details */}
      <View className="flex-1">
        <Text className="text-white text-sm font-semibold mb-0.5">
          {item.description}
        </Text>
        <Text className="text-[#6B7280] text-xs">{formattedDate}</Text>
      </View>

      {/* Amount */}
      <View className="items-end">
        <Text
          className={`text-sm font-bold ${
            isIncome ? "text-[#4ADE80]" : "text-[#F87171]"
          }`}
        >
          {formattedAmount}
        </Text>
        <View
          className={`mt-1 px-2 py-0.5 rounded-full ${
            isIncome ? "bg-[#14532D]" : "bg-[#450A0A]"
          }`}
        >
          <Text
            className={`text-xs ${
              isIncome ? "text-[#4ADE80]" : "text-[#F87171]"
            }`}
          >
            {isIncome ? "Income" : "Expense"}
          </Text>
        </View>
      </View>
    </View>
  );
}
