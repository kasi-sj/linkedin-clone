import { StyleSheet, Text, View,RefreshControl, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import useUserFetch from "../../../../../hooks/useUserFetch";

const options = [
  {
    name: "Connections",
    path: "connections",
    icon: <MaterialIcons name="people-alt" size={24} color="black" />,
  },
  {
    name: "Send",
    path: "send",
    icon: <MaterialCommunityIcons name="email-send" size={24} color="black" />,
  },
  {
    name: "Received",
    path: "received",
    icon: <MaterialIcons name="emoji-people" size={24} color="black" />,
  },
];

const index = () => {
  const { user, loading, error, refetchUser } = useUserFetch();
  const [connections, setConnections] = React.useState([0, 0, 0]);

  const router = useRouter();

  useEffect(() => {
    const connections = [
      user?.connections?.length,
      user?.sentConnectionRequests?.length,
      user?.connectionRequests?.length,
    ];
    setConnections(connections);
  }, [user]);
  return (
    <View>
      <ScrollView refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetchUser} />
      } >
        {options.map((option, index) => (
          <View
            key={index}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              padding: 10,
              backgroundColor: "#fff",
              height: 50,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
              }}
              onPress={() => {
                router.push(
                  `(tabs)/network/invitations/${option.path}/${user.id}`
                );
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                {option.icon}
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    paddingHorizontal: 10,
                  }}
                >
                  {option.name}
                </Text>
              </View>
              <Text>{connections[index]}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
