import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import profileCard from "../../../../../../components/profileCard";
import useConnectionFetch from "../../../../../../hooks/useConnectionFetch";
import { useRouter } from "expo-router";
import { connect } from "react-redux";
import { Search } from "../../../../../../context/actions/searchAction";
const index = ({ search }) => {
  const router = useRouter();
  const { id } = useGlobalSearchParams();
  const { connections, loading, error, refetchConnections } =
    useConnectionFetch(id);
  const onPress = (path) => {
    router.push(path);
  };
  return (
    <View>
      <FlatList
        data={connections}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetchConnections} />
        }
        renderItem={({ item }) => (
          <View>
            {profileCard({ userId: id, data: item, onPress, search })}
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
                ? "Error fetching connections"
                : "No connections found"}
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
