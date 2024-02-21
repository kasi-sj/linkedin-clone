import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { FlatList } from "react-native";
import { BackHandler } from "react-native";
import useUserFetch from "../../../hooks/useUserFetch";
import useSearchUserFetch from "../../../hooks/useSearchUserFetch";
import profileCard from "../../../components/profileCard";
import requestCard from "../../../components/requestCard";
import SendRequestCard from "../../../components/SendRequestCard";
import SearchPeopleCard from "../../../components/searchPeopleCard";
import axios from "axios";
import { connect } from "react-redux";
import { Search } from "../../../context/actions/searchAction";
import { RefreshControl } from "react-native";
import Toast from "react-native-simple-toast";
import useSoundHook from "../../../hooks/useSoundHook";

const keyword = ({ search, Search }) => {
  const router = useRouter();
  const onPress = (id)=>{
    router.push(`/profile/${id}`);
  }

  const { connect } = useSoundHook();
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const { user } = useUserFetch();
  const { keyword } = useGlobalSearchParams();
  const { users, loading, error, refetchUsers, onSearch, setUsers } =
    useSearchUserFetch(user?._id, keyword);
  const [sendConnection, setSendConnection] = useState([]);

  const renderItem = ({ item }) => {
    if (item.connectionStatus === "connected") {
      return profileCard({
        key: item.id,
        userId: user?.id,
        data: item,
        onPress: (path) => {
          router.push(path);
        },
        search: "",
        level: item.level,
      });
    } else if (item.connectionStatus === "sent") {
      return SendRequestCard({
        key: item.id,
        handleOption: handleOption1,
        userId: user?.id,
        data: item,
        onPress: (path) => {
          router.push(path);
        },
        search: "",
        isWithDraw: "",
        level: item.level,
      });
    } else if (item.connectionStatus === "received") {
      return requestCard({
        onPress:onPress,
        key: item.id,
        handleOption: handleOption2,
        userId: user?.id,
        data: item,
        search: "",
        level: item.level,
      });
    } else if (item.id !== user?.id) {
      return SearchPeopleCard({
        key: item.id,
        userId: user?.id,
        data: item,
        onPress: (path) => {
          router.push(path);
        },
        onConnect: onConnect,
        sendConnection: sendConnection,
        search: "",
        level: item.level,
      });
    }
  };

  const handleOption1 = async (requestId) => {
    console.log(requestId);
    const senderId = user?.id;
    const receiverId = requestId;
    const props = {
      senderId,
      receiverId,
      option: "reject",
    };
    try {
      const currentElement = users.find((item) => item.id === requestId);
      const index = users.findIndex((item) => item.id === requestId);
      const nusers = users.filter((item) => item.id !== requestId);
      setUsers(nusers);
      const res = await axios.post(`${url}connection-request/option`, props);
      if (res.status === 200) {
        console.log("success");
        nusers.splice(index, 0, {
          ...currentElement,
          connectionStatus: "send",
        });
        setUsers(nusers);
      } else {
        nusers.splice(index, 0, {
          ...currentElement,
        });
        console.log("error");
        Toast.show("Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Toast.show("Something went wrong");
    } finally {
      return true;
    }
  };

  const handleOption2 = async (selectedOption, requestId) => {
    const senderId = requestId;
    const receiverId = user?.id;
    const props = {
      senderId,
      receiverId,
      option: selectedOption,
    };
    try {
      const currentElement = users.find((item) => item.id === requestId);
      const index = users.findIndex((item) => item.id === requestId);
      const nusers = users.filter((item) => item.id !== requestId);
      setUsers(nusers);
      const res = await axios.post(`${url}connection-request/option`, props);
      if (res.status === 200) {
        console.log("success");
        nusers.splice(index, 0, {
          ...currentElement,
          connectionStatus: selectedOption === "accept" ? "connected" : "new",
        });
        selectedOption === "accept" && connect();
        setUsers(nusers);
      } else {
        nusers.splice(index, 0, {
          ...currentElement,
        });
        console.log("error");
        Toast.show("Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:", error);
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

  const onConnect = async (id) => {
    if (!sendConnection.includes(id)) {
      setSendConnection([...sendConnection, id]);
      const res = await sendRequest(id);
      if (res) {
        Toast.show("Connection request sent");
        console.log("sent");
        return true;
      } else {
        const nrequest = sendConnection.filter((item) => item !== id);
        setSendConnection(nrequest);
        Toast.show("Error sending connection request");
      }
    } else {
      const nrequest = sendConnection.filter((item) => item !== id);
      setSendConnection(nrequest);
      const res = await removeRequest(id);
      if (res) {
        Toast.show("Connection request removed");
        console.log("removed");
        return true;
      } else {
        Toast.show("Error removing connection request");
        nrequest.push(id);
        setSendConnection(nrequest);
      }
    }
  };

  useEffect(() => {
    if (keyword) Search(keyword);
    refetchUsers(user?._id);
    console.log(keyword, "user");
  }, [user]);
  useEffect(() => {
    if (keyword) Search(keyword);
    onSearch(keyword);
    console.log(keyword, "keyword");
  }, [keyword]);

  useEffect(() => {
    console.log(users, "users");
  }, [users]);
  return (
    <View style={{
      height: "100%",
      backgroundColor: "white",
    }}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onSearch(keyword)}
          />
        }
        style={{
          width: Dimensions.get("window").width,
          backgroundColor: "white",
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <Text>
              {loading ? (
                "Loading..."
              ) : error ? (
                "Error fetching users"
              ) : (
                <ActivityIndicator size={"large"} />
              )}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  search: state.search,
});

const mapDispatchToProps = {
  Search,
};

export default connect(mapStateToProps, mapDispatchToProps)(keyword);
