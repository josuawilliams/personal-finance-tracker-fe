import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { ComponentProps } from "react";
import { Text, View } from "react-native";

export default function TransactionItem({ item }: { item: any }) {
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

  const isIncome = item.amount > 0;
  const iconConfig = iconMap[item.icon] || iconMap.cart;

  const formattedAmount = isIncome
    ? `+$${item.amount.toFixed(2)}`
    : `-$${Math.abs(item.amount).toFixed(2)}`;

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
          {item.name}
        </Text>
        <Text className="text-[#6B7280] text-xs">{item.date}</Text>
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
