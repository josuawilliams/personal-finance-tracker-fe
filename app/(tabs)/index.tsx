import BalanceCard from "@/components/BalancedCard";
import SummaryCard from "@/components/SummaryCard";
import TransactionItem from "@/components/TransactionCard";
import {
  getCurrentMonthTransactions,
  getTransactionSummary,
  type Transaction,
} from "@/lib/transactions";
import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WalletBalanceResponse {
  balance?: number | string;
}

interface CreateTransactionPayload {
  category: string;
  amount: number;
  transactionType: "INCOME" | "EXPENSE";
  description: string;
  note: string;
}

const categoryOptions = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Kesehatan",
  "Hiburan",
  "Pendidikan",
  "Gaji",
  "Hadiah",
  "Lainnya",
];

const getWalletBalance = async (): Promise<number> => {
  const { data } =
    await apiClient.get<WalletBalanceResponse>("/wallet/balance");
  const rawBalance = data.balance ?? 0;
  const parsedBalance =
    typeof rawBalance === "string" ? Number(rawBalance) : rawBalance;

  return Number.isFinite(parsedBalance) ? parsedBalance : 0;
};

const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await apiClient.get<Transaction[]>("/transactions");
  return data;
};

const createTransaction = async (payload: CreateTransactionPayload) => {
  const { data } = await apiClient.post<Transaction>("/transactions", payload);
  return data;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const getApiErrorMessage = (error: unknown, fallback: string) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || error.message
    : fallback;

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] =
    useState<CreateTransactionPayload["transactionType"]>("EXPENSE");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");

  const balanceQuery = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: getWalletBalance,
  });
  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const currentMonthTransactions = getCurrentMonthTransactions(
    transactionsQuery.data ?? [],
  );
  const transactionSummary = getTransactionSummary(currentMonthTransactions);

  const walletBalance = formatCurrency(balanceQuery.data ?? 0);
  const spendingSummary = formatCurrency(transactionSummary.spending);
  const savingSummary = formatCurrency(transactionSummary.saving);
  const isRefreshing =
    balanceQuery.isRefetching || transactionsQuery.isRefetching;

  const resetForm = () => {
    setCategory(categoryOptions[0]);
    setAmount("");
    setTransactionType("EXPENSE");
    setDescription("");
    setNote("");
    setIsCategoryOpen(false);
  };

  const transactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      resetForm();
      setIsFormOpen(false);
      transactionsQuery.refetch();
      balanceQuery.refetch();
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, "Gagal membuat transaksi"),
      );
    },
  });

  const handleSubmitTransaction = () => {
    const parsedAmount = Number(amount.replace(/\D/g, ""));

    if (!description.trim()) {
      Alert.alert("Error", "Description wajib diisi");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Amount harus lebih dari 0");
      return;
    }

    transactionMutation.mutate({
      category,
      amount: parsedAmount,
      transactionType,
      description: description.trim(),
      note: note.trim(),
    });
  };

  useEffect(() => {
    if (!balanceQuery.isError) return;

    Alert.alert(
      "Error",
      getApiErrorMessage(balanceQuery.error, "Gagal mengambil saldo wallet"),
    );
  }, [balanceQuery.error, balanceQuery.isError]);

  useEffect(() => {
    if (!transactionsQuery.isError) return;

    Alert.alert(
      "Error",
      getApiErrorMessage(transactionsQuery.error, "Gagal mengambil transaksi"),
    );
  }, [transactionsQuery.error, transactionsQuery.isError]);

  useEffect(() => {
    if (!isFocused) return;

    balanceQuery.refetch();
    transactionsQuery.refetch();
  }, [balanceQuery.refetch, isFocused, transactionsQuery.refetch]);

  return (
    <SafeAreaView className="flex-1 bg-[#c5e8ff]" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />
      <View className="flex-row justify-between items-center px-5 py-3">
        <View>
          <Text className="text-[#4ADE80] text-2xl font-bold tracking-tight">
            FinTrack
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              balanceQuery.refetch();
              transactionsQuery.refetch();
            }}
            tintColor="#16A34A"
            colors={["#16A34A"]}
          />
        }
      >
        <BalanceCard
          balance={balanceQuery.isLoading ? "Loading..." : walletBalance}
        />

        {/* SPENDING SUMMARY */}
        <View className="mt-6 px-4">
          <Text className="text-[#6B7280] text-xs font-semibold tracking-widest mb-3">
            SPENDING SUMMARY
          </Text>
          <View className="flex-row gap-3">
            <SummaryCard type="expense" amount={spendingSummary} />
            <SummaryCard type="savings" amount={savingSummary} />
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
            data={currentMonthTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TransactionItem item={item} />}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="bg-[#111111] rounded-2xl p-4 border border-[#1A1A1A]">
                <Text className="text-[#6B7280] text-sm">
                  Belum ada transaksi bulan ini.
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        className="absolute bottom-8 right-5 w-14 h-14 bg-[#16A34A] rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={() => setIsFormOpen(true)}
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

      <Modal
        visible={isFormOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFormOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 bg-black/60"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          >
            <View className="bg-[#0A0A0A] rounded-t-3xl px-5 pb-8 pt-5 border-t border-[#1E1E1E]">
              <View className="flex-row items-center justify-between mb-5">
                <View>
                  <Text className="text-white text-lg font-bold">
                    Masukkan Transaksi
                  </Text>
                  <Text className="text-[#6B7280] text-xs mt-1">
                    Catat kebutuhan harian bulan ini
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-9 h-9 rounded-full bg-[#111111] items-center justify-center border border-[#1E1E1E]"
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsFormOpen(false);
                    setIsCategoryOpen(false);
                  }}
                >
                  <Ionicons name="close" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                Kategori
              </Text>
              <TouchableOpacity
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl px-4 py-3 mb-2 flex-row items-center justify-between"
                activeOpacity={0.8}
                onPress={() => setIsCategoryOpen((value) => !value)}
              >
                <Text className="text-white text-sm font-semibold">
                  {category}
                </Text>
                <Ionicons
                  name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#4ADE80"
                />
              </TouchableOpacity>

              {isCategoryOpen && (
                <View className="bg-[#111111] border border-[#1E1E1E] rounded-2xl mb-4 overflow-hidden">
                  {categoryOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className="px-4 py-3 border-b border-[#1E1E1E]"
                      activeOpacity={0.7}
                      onPress={() => {
                        setCategory(option);
                        setIsCategoryOpen(false);
                      }}
                    >
                      <Text
                        className={`text-sm ${
                          option === category
                            ? "text-[#4ADE80] font-bold"
                            : "text-[#D1D5DB]"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                Tipe
              </Text>
              <View className="flex-row bg-[#111111] border border-[#1E1E1E] rounded-2xl p-1 mb-4">
                {(["EXPENSE", "INCOME"] as const).map((type) => {
                  const isActive = transactionType === type;

                  return (
                    <TouchableOpacity
                      key={type}
                      className={`flex-1 py-2.5 rounded-xl items-center ${
                        isActive ? "bg-[#166534]" : ""
                      }`}
                      activeOpacity={0.8}
                      onPress={() => setTransactionType(type)}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isActive ? "text-[#4ADE80]" : "text-[#6B7280]"
                        }`}
                      >
                        {type === "EXPENSE" ? "Expense" : "Income"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                AMOUNT
              </Text>
              <TextInput
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl px-4 py-3 mb-4 text-white"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="10000"
                placeholderTextColor="#4B5563"
              />

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                Deskripsi
              </Text>
              <TextInput
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl px-4 py-3 mb-4 text-white"
                value={description}
                onChangeText={setDescription}
                placeholder="Hadiah"
                placeholderTextColor="#4B5563"
              />

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                Note
              </Text>
              <TextInput
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl px-4 py-3 mb-5 text-white"
                value={note}
                onChangeText={setNote}
                placeholder="Tambahan Catatan"
                placeholderTextColor="#4B5563"
              />

              <TouchableOpacity
                className={`rounded-2xl py-4 items-center ${
                  transactionMutation.isPending
                    ? "bg-[#14532D]"
                    : "bg-[#16A34A]"
                }`}
                activeOpacity={0.8}
                disabled={transactionMutation.isPending}
                onPress={handleSubmitTransaction}
              >
                {transactionMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-sm font-bold">
                    Simpan Transaksi
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* BOTTOM NAVIGATION */}
      {/* <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} /> */}
    </SafeAreaView>
  );
}
