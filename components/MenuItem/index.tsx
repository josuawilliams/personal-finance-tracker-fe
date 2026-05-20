import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function MenuItem({
  icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center">
          <Ionicons name={icon} size={20} />
        </View>
        <Text className="ml-3 text-base font-medium">{label}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="gray" />
    </TouchableOpacity>
  );
}
