import BalanceCard from "@/components/BalancedCard";
import SummaryCard from "@/components/SummaryCard";
import TransactionItem from "@/components/TransactionCard";
import { transactions } from "@/constants/dummy";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [notifCount] = useState(3);

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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BalanceCard />

        {/* SPENDING SUMMARY */}
        <View className="mt-6 px-4">
          <Text className="text-[#6B7280] text-xs font-semibold tracking-widest mb-3">
            SPENDING SUMMARY
          </Text>
          <View className="flex-row gap-3">
            <SummaryCard type="expense" />
            <SummaryCard type="savings" />
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[#6B7280] text-xs font-semibold tracking-widest">
              RECENT TRANSACTIONS
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[#4ADE80] text-xs font-semibold">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionItem item={item} />}
            scrollEnabled={false}
          />
        </View>

        {/* FINANCIAL TIP CARD */}
        <View className="mx-4 mt-6 bg-[#0D2B12] rounded-3xl p-5 border border-[#1A4A22] overflow-hidden">
          {/* Decorative circles */}
          <View className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-[#166534] opacity-30" />
          <View className="absolute -top-4 right-12 w-16 h-16 rounded-full bg-[#15803D] opacity-20" />

          <View className="flex-row items-center mb-3">
            <View className="bg-[#4ADE80] rounded-lg px-2 py-1 mr-2">
              <Text className="text-[#052e16] text-xs font-bold">💡 TIP</Text>
            </View>
            <Text className="text-[#4ADE80] text-xs font-semibold tracking-widest">
              FINANCIAL TIP
            </Text>
          </View>

          <Text className="text-white text-base font-bold leading-6 mb-3">
            Optimize your savings goal with{" "}
            <Text className="text-[#4ADE80]">4.5% APY</Text>. Start auto-invest
            today.
          </Text>

          <TouchableOpacity
            className="bg-[#166534] rounded-xl py-2.5 px-4 self-start flex-row items-center"
            activeOpacity={0.7}
          >
            <Text className="text-[#4ADE80] text-xs font-bold mr-1">
              Learn More
            </Text>
            <Ionicons name="arrow-forward" size={12} color="#4ADE80" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="mx-4 mt-6">
          <Text className="text-[#6B7280] text-xs font-semibold tracking-widest mb-3">
            QUICK ACTIONS
          </Text>
          <View className="flex-row gap-3">
            {[
              {
                icon: "arrow-up-circle-outline",
                label: "Send",
                color: "#818CF8",
              },
              {
                icon: "arrow-down-circle-outline",
                label: "Receive",
                color: "#4ADE80",
              },
              { icon: "card-outline", label: "Pay Bill", color: "#F87171" },
              { icon: "bar-chart-outline", label: "Invest", color: "#FBBF24" },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                className="flex-1 items-center bg-[#111111] py-3 rounded-2xl border border-[#1E1E1E]"
                activeOpacity={0.7}
              >
                {/* <Ionicons name={action.icon} size={22} color={action.color} /> */}
                <Text className="text-[#9CA3AF] text-xs mt-1.5">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        className="absolute bottom-8 right-5 w-14 h-14 bg-[#16A34A] rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        style={{
          shadowColor: "#4ADE80",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* BOTTOM NAVIGATION */}
      {/* <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} /> */}
    </SafeAreaView>
  );
}
