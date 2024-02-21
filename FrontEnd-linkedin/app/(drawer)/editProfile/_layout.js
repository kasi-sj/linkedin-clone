import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
export default function Layout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Edit intro",
          headerStyle:{
            backgroundColor: "white",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
              style={{
                marginRight: 20,
                padding: 10
              }}
                onPress={() => {
                    router.navigate("(drawer)/profile");
                }}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack>
  );
}
