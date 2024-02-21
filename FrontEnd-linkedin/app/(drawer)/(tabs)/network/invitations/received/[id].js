import { Alert, StyleSheet, Text, View, RefreshControl } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import axios from "axios";
import requestCard from "../../../../../../components/requestCard";
import useReceivedFetch from "../../../../../../hooks/useReceivedFetch";
import { connect } from "react-redux";
import { Search } from "../../../../../../context/actions/searchAction";
import Toast from "react-native-simple-toast";
import { useRouter } from "expo-router";

const index = ({ search }) => {
  const router = useRouter();
  const onPress = (id) => {
    router.push(`/profile/${id}`);
  };
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const { id } = useGlobalSearchParams();
  const { received, setReceived, loading, error, refetchReceived } =
    useReceivedFetch(id);

  const handleOption = async (selectedOption, requestId) => {
    const senderId = requestId;
    const receiverId = id;
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
      } else {
        console.log("error");
        nrequest.push(currentElement);
        setReceived(nrequest);
        Toast.show("Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Toast.show("Something went wrong");
    }
  };
  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetchReceived} />
        }
        data={received}
        renderItem={({ item }) => (
          <View
            style={{
              height: 100,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {requestCard({
              handleOption,
              userId: id,
              data: item,
              search,
              onPress,
            })}
          </View>
        )}
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
                ? "Error fetching received requests"
                : "No requests received"}
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
export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({});
