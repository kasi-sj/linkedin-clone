import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  SafeAreaView,
} from "react-native";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserProfile from "../../../../components/userProfile";
import { decode } from "base-64";
import { useRouter } from "expo-router";
import RequestCard from "../../../../components/requestCard";
global.atob = decode;
import useUserFetch from "../../../../hooks/useUserFetch";
import useReceivedFetch from "../../../../hooks/useReceivedFetch";
import Toast from "react-native-simple-toast";
import useSoundHook from "../../../../hooks/useSoundHook";

const index = () => {
  const { connect } = useSoundHook();
  const { user, refetchUser } = useUserFetch();
  const { received, setReceived, refetchReceived } = useReceivedFetch(user.id);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  useEffect(() => {
    if (user) {
      fetchUsers();
      refetchReceived();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("fetching users");
      console.log(user.id);
      const response = await axios.get(`${url}users/${user.id}`);
      const userData = response.data;
      setUsers(userData.users);
      console.log("users fetched");
    } catch (err) {
      console.log("error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleOption = async (selectedOption, requestId) => {
    console.log("handle option");
    const senderId = requestId;
    const receiverId = user.id;
    const props = {
      senderId,
      receiverId,
      option: selectedOption,
    };
    try {
      const currentElement = received.find((item) => item.id === requestId);
      const nrequest = received.filter((item) => item.id !== requestId);
      setReceived(nrequest);
      const res = await axios.post(`${url}connection-request/option`, props);
      if (res.status === 200) {
        console.log("success");
        Toast.show("Request " + selectedOption + "ed");
        // make a sound
        selectedOption === "accept" && connect();
      } else {
        nrequest.push(currentElement);
        setReceived(nrequest);
        Toast.show("Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:");
      Toast.show("Something went wrong");
    }
  };

  const sendRequest = async (id) => {
    try {
      const props = {
        currentUserId: user.id,
        selectedUserId: id,
      };
      const res = await axios.post(`${url}connection-request/`, props);
      if (res.status === 200) {
        return true;
      } else {
        Toast.show("Error sending connection request");
      }
    } catch (err) {
      console.log("error sending connection request");
    }
    return false;
  };

  const removeRequest = async (id) => {
    const senderId = user.id;
    const receiverId = id;
    const props = {
      senderId,
      receiverId,
      option: "reject",
    };
    try {
      const res = await axios.post(`${url}connection-request/option`, props);
      if (res.status === 200) {
        return true;
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("An error occurred while removing request");
    }
    return false;
  };

  const onConnect = async (id, connect) => {
    if (connect) {
      const res = await sendRequest(id);
      if (res) {
        Toast.show("Connection request sent");
        return true;
      }
    } else {
      const res = await removeRequest(id);
      if (res) {
        Toast.show("Connection request removed");
        return true;
      }
    }
  };

  const refetch = () => {
    refetchUser();
    fetchUsers();
    refetchReceived();
  };
  const onPress = (id) => {
    router.push(`/profile/${id}`);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <TouchableOpacity
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => {
          router.push("/(tabs)/network/invitations");
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Manage my network
        </Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </TouchableOpacity>
      <View
        style={{
          borderColor: "#E0E0E0",
          borderWidth: 2,
          marginTop: 10,
        }}
      />

      <View>
        {received.length !== 0 && (
          <Text
            style={{
              marginHorizontal: 15,
              marginVertical: 10,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            requests
          </Text>
        )}
        <FlatList
          data={received}
          renderItem={({ item, index }) => {
            if (index > 2) return null;
            return (
              <View>
                {RequestCard({
                  handleOption,
                  userId: user.id,
                  data: item,
                  onPress: onPress,
                })}
              </View>
            );
          }}
          ListFooterComponent={() => {
            if (received.length >= 3) {
              return (
                <TouchableOpacity
                  style={{
                    marginHorizontal: 15,
                    marginVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    router.push(
                      `(drawer)/(tabs)/network/invitations/received/${user.id}`
                    );
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    See all
                  </Text>
                  <AntDesign name="arrowright" size={22} color="black" />
                </TouchableOpacity>
              );
            }
            return null;
          }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {received.length !== 0 && (
        <View
          style={{
            borderColor: "#E0E0E0",
            borderWidth: 2,
            marginTop: 10,
          }}
        />
      )}
      <View
        style={{
          marginHorizontal: 5,
          marginBottom: 100,
        }}
      >
        <View
          style={{
            paddingVertical: 5,
            marginTop: 15,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
            }}
          >
            More Suggestions for you
          </Text>
        </View>
        <FlatList
          data={users}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserProfile userId={user.id} data={item} onConnect={onConnect} />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <Text>{loading ? "Loading..." : "No users found"}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
