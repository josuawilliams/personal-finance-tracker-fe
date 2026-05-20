import { Text, TextInput, View } from "react-native";

export default function Input({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-gray-500 mb-1">{label}</Text>
      <TextInput
        defaultValue={value}
        className="border border-gray-300 rounded-xl px-4 py-3"
      />
    </View>
  );
}
