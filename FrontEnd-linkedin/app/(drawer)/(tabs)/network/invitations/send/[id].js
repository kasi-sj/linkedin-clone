import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import axios from "axios";
import SendRequestCard from "../../../../../../components/SendRequestCard";
import useSendFetch from "../../../../../../hooks/useSendFetch";
import { connect } from "react-redux";
import { Search } from "../../../../../../context/actions/searchAction";
import Toast from "react-native-simple-toast";

const Id = ({ search }) => {
  const router = useRouter();
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const { id } = useGlobalSearchParams();
  const { send, setSend, loading, error, refetchSent } = useSendFetch(id);
  const handleOption = async (requestId) => {
    console.log(requestId);
    const senderId = id;
    const receiverId = requestId;
    const props = {
      senderId,
      receiverId,
      option: "reject",
    };
    try {
      const currentElement = send.find((item) => item.id === requestId);
      const nrequest = send.filter((item) => item.id !== requestId);
      setSend(nrequest);
      const res = await axios.post(`${url}connection-request/option`, props);
      if (res.status === 200) {
        console.log("success");
      } else {
        nrequest.push(currentElement);
        setSend(nrequest);
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
  const onPress = (path) => {
    router.push(path);
  };
  return (
    <View>
      <FlatList
        data={send}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetchSent} />
        }
        renderItem={({ item }) =>
          SendRequestCard({
            handleOption: handleOption,
            userId: id,
            data: item,
            onPress,
            search,
          })
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <Text>
              {loading
                ? "Loading..."
                : error
                ? "Error fetching sent requests"
                : "No pending sent requests"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};
const mapStateToProps = (state) => ({
  search: state.search.search,
});
const mapDispatchToProps = {
  Search,
};
export default connect(mapStateToProps, mapDispatchToProps)(Id);

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
