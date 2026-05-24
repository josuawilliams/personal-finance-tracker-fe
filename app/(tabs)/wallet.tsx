import { apiClient } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
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

interface WalletMutation {
  id: number;
  type: "TOPUP" | "WITHDRAW";
  amount: number;
  description: string;
  createdAt: string;
}

interface WalletActionPayload {
  amount: number;
  description: string;
}

type MutationFilter = "ALL" | WalletMutation["type"];
type WalletActionType = "TOPUP" | "WITHDRAW";

const getWalletBalance = async (): Promise<number> => {
  const { data } =
    await apiClient.get<WalletBalanceResponse>("/wallet/balance");
  const rawBalance = data.balance ?? 0;
  const parsedBalance =
    typeof rawBalance === "string" ? Number(rawBalance) : rawBalance;

  return Number.isFinite(parsedBalance) ? parsedBalance : 0;
};

const getWalletMutations = async (): Promise<WalletMutation[]> => {
  const { data } = await apiClient.get<WalletMutation[]>("/wallet/mutations");
  return data;
};

const submitWalletAction = async ({
  actionType,
  payload,
}: {
  actionType: WalletActionType;
  payload: WalletActionPayload;
}) => {
  const endpoint =
    actionType === "TOPUP" ? "/wallet/topup" : "/wallet/withdraw";
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatMutationDate = (dateValue: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));

const getApiErrorMessage = (error: unknown, fallback: string) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || error.message
    : fallback;

export default function WalletScreen() {
  const isFocused = useIsFocused();
  const [activeFilter, setActiveFilter] = useState<MutationFilter>("ALL");
  const [activeAction, setActiveAction] = useState<WalletActionType>("TOPUP");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const balanceQuery = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: getWalletBalance,
  });
  const mutationsQuery = useQuery({
    queryKey: ["wallet-mutations"],
    queryFn: getWalletMutations,
  });

  const filteredMutations = (mutationsQuery.data ?? []).filter((mutation) => {
    if (activeFilter === "ALL") return true;
    return mutation.type === activeFilter;
  });

  const isRefreshing = balanceQuery.isRefetching || mutationsQuery.isRefetching;

  const resetForm = () => {
    setAmount("");
    setDescription("");
  };

  const walletActionMutation = useMutation({
    mutationFn: submitWalletAction,
    onSuccess: () => {
      resetForm();
      setIsActionModalOpen(false);
      balanceQuery.refetch();
      mutationsQuery.refetch();
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, "Gagal memproses mutasi wallet"),
      );
    },
  });

  const openActionModal = (actionType: WalletActionType) => {
    setActiveAction(actionType);
    resetForm();
    setIsActionModalOpen(true);
  };

  const handleSubmitAction = () => {
    const parsedAmount = Number(amount.replace(/\D/g, ""));

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Amount harus lebih dari 0");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Description wajib diisi");
      return;
    }

    walletActionMutation.mutate({
      actionType: activeAction,
      payload: {
        amount: parsedAmount,
        description: description.trim(),
      },
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
    if (!isFocused) return;

    balanceQuery.refetch();
    mutationsQuery.refetch();
  }, [balanceQuery.refetch, isFocused, mutationsQuery.refetch]);

  useEffect(() => {
    if (!mutationsQuery.isError) return;

    Alert.alert(
      "Error",
      getApiErrorMessage(mutationsQuery.error, "Gagal mengambil mutasi wallet"),
    );
  }, [mutationsQuery.error, mutationsQuery.isError]);

  const renderFilterButton = (filter: MutationFilter, label: string) => {
    const isActive = activeFilter === filter;

    return (
      <TouchableOpacity
        className={`px-4 py-2 rounded-full ${
          isActive ? "bg-green-600" : "border border-gray-300"
        }`}
        activeOpacity={0.8}
        onPress={() => setActiveFilter(filter)}
      >
        <Text
          className={isActive ? "text-white font-semibold" : "text-gray-600"}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMutationItem = ({ item }: { item: WalletMutation }) => {
    const isTopup = item.type === "TOPUP";

    return (
      <View className="flex-row items-center py-3 px-4 bg-[#111111] rounded-2xl mb-2.5 border border-[#1A1A1A]">
        <View
          className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${
            isTopup ? "bg-[#162916]" : "bg-[#2D1515]"
          }`}
        >
          <Ionicons
            name={isTopup ? "arrow-down" : "arrow-up"}
            size={20}
            color={isTopup ? "#4ADE80" : "#F87171"}
          />
        </View>

        <View className="flex-1">
          <Text className="text-white text-sm font-semibold mb-0.5">
            {item.description}
          </Text>
          <Text className="text-[#6B7280] text-xs">
            {formatMutationDate(item.createdAt)}
          </Text>
        </View>

        <View className="items-end">
          <Text
            className={`text-sm font-bold ${
              isTopup ? "text-[#4ADE80]" : "text-[#F87171]"
            }`}
          >
            {isTopup ? "+" : "-"}
            {formatCurrency(item.amount)}
          </Text>
          <View
            className={`mt-1 px-2 py-0.5 rounded-full ${
              isTopup ? "bg-[#14532D]" : "bg-[#450A0A]"
            }`}
          >
            <Text
              className={`text-xs ${
                isTopup ? "text-[#4ADE80]" : "text-[#F87171]"
              }`}
            >
              {isTopup ? "Top-up" : "Withdraw"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
        className="px-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              balanceQuery.refetch();
              mutationsQuery.refetch();
            }}
            tintColor="#16A34A"
            colors={["#16A34A"]}
          />
        }
      >
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
              {balanceQuery.isLoading
                ? "Loading..."
                : formatCurrency(balanceQuery.data ?? 0)}
            </Text>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View className="flex-row gap-3 mt-5">
          <TouchableOpacity
            className="flex-1 bg-green-600 py-3 rounded-full flex-row justify-center items-center"
            activeOpacity={0.8}
            onPress={() => openActionModal("TOPUP")}
          >
            <Ionicons name="arrow-down" size={18} color="white" />
            <Text className="text-white ml-2 font-semibold">Top-up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 border border-gray-300 py-3 rounded-full flex-row justify-center items-center"
            activeOpacity={0.8}
            onPress={() => openActionModal("WITHDRAW")}
          >
            <Ionicons name="arrow-up" size={18} />
            <Text className="ml-2 font-semibold">Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER TABS */}
        <View className="flex-row gap-3 mt-5">
          {renderFilterButton("ALL", "All Activities")}
          {renderFilterButton("TOPUP", "Top-ups")}
          {renderFilterButton("WITHDRAW", "Withdrawals")}
        </View>

        <Text className="mt-6 text-gray-500 font-semibold">
          MUTATION HISTORY
        </Text>

        <FlatList
          data={filteredMutations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMutationItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <View className="bg-[#111111] rounded-2xl p-4 border border-[#1A1A1A] mt-2">
              <Text className="text-[#6B7280] text-sm">
                Belum ada mutasi wallet.
              </Text>
            </View>
          }
        />
      </ScrollView>

      <Modal
        visible={isActionModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionModalOpen(false)}
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
                    {activeAction === "TOPUP" ? "Top-up Wallet" : "Withdraw"}
                  </Text>
                  <Text className="text-[#6B7280] text-xs mt-1">
                    {activeAction === "TOPUP"
                      ? "Tambah saldo wallet"
                      : "Tarik saldo dari wallet"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-9 h-9 rounded-full bg-[#111111] items-center justify-center border border-[#1E1E1E]"
                  activeOpacity={0.7}
                  onPress={() => setIsActionModalOpen(false)}
                >
                  <Ionicons name="close" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                AMOUNT
              </Text>
              <TextInput
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl px-4 py-3 mb-4 text-white"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder={activeAction === "TOPUP" ? "60000" : "10000"}
                placeholderTextColor="#4B5563"
              />

              <Text className="text-[#9CA3AF] text-xs font-semibold mb-2">
                DESCRIPTION
              </Text>
              <TextInput
                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl px-4 py-3 mb-5 text-white"
                value={description}
                onChangeText={setDescription}
                placeholder={
                  activeAction === "TOPUP" ? "Untuk Makan" : "Buat Adek"
                }
                placeholderTextColor="#4B5563"
              />

              <TouchableOpacity
                className={`rounded-2xl py-4 items-center ${
                  walletActionMutation.isPending
                    ? "bg-[#14532D]"
                    : "bg-[#16A34A]"
                }`}
                activeOpacity={0.8}
                disabled={walletActionMutation.isPending}
                onPress={handleSubmitAction}
              >
                {walletActionMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-sm font-bold">
                    {activeAction === "TOPUP"
                      ? "Simpan Top-up"
                      : "Simpan Withdraw"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
