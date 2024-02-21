import {
  ActivityIndicator,
  StyleSheet,
  View,
  RefreshControl,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import PostCard from "../../../../components/PostCard";
import useUserFetch from "../../../../hooks/useUserFetch";
import usePostFetch from "../../../../hooks/usePostFetch";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import UsePushNotification from "../../../../hooks/usePushNotification";

const index = () => {
  UsePushNotification();
  const router = useRouter();
  const { user } = useUserFetch();
  const { posts, loading, error, refetchPosts, removePost } = usePostFetch(
    user.id
  );
  const [page, setPage] = useState(1);
  const postPerPage = 5;
  const [requested, setRequested] = useState([]);
  useEffect(() => {
    if (posts.length > 0) {
      const requestedPosts = posts.slice(
        0,
        Math.min(page * postPerPage, posts.length)
      );
      setRequested(requestedPosts);
    }
  }, [posts, page]);
  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <FlatList
        style={{
          height: "100%",
        }}
        data={requested}
        renderItem={({ item, index }) => (
          <PostCard
            key={index}
            item={item}
            userId={user.id}
            removePost={removePost}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetchPosts} />
        }
        ListFooterComponent={() => {
          if (
            loading ||
            error ||
            posts.length == 0 ||
            page * postPerPage >= posts.length
          )
            return null;
          return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => setPage(page + 1)}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "grey",
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: "grey",
                  }}
                >
                  Load More
                </Text>
              </TouchableOpacity>
            </View>
          );
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
                "Error fetching posts"
              ) : (
                <ActivityIndicator size={"large"} />
              )}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item?.id}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
