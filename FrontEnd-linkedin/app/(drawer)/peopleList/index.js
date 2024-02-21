import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, RefreshControl, FlatList } from "react-native";
import RoomCard from "../../../components/RoomCard";
import { ScrollView } from "react-native";
import useRoomFetch from "../../../hooks/useRoomFetch";
import useUserFetch from "../../../hooks/useUserFetch";
import { Chat } from "../../../context/actions/searchAction";
import { connect } from "react-redux";

const Index = ({ search }) => {
  const { user, refetchUser } = useUserFetch();
  const { room, loading, error,refetchRoom } = useRoomFetch(user.id);

  useEffect(() => {
    refetchRoom();
  }, [user]);

  return (
    <FlatList
      data={room}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetchRoom} />
      }
      renderItem={({ item }) => (
        <RoomCard search={search} key={item.id} room={item} user={user} />
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
              ? "Error fetching rooms"
              : "No rooms found"}
          </Text>
        </View>
      )}
      style={{
        backgroundColor: "white",
      }}
    />
  );
};

const mapStateToProps = (state) => ({
  search: state.search.search,
});

export default connect(mapStateToProps)(Index);
