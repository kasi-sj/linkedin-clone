import { FlatList, RefreshControl, Text, View } from "react-native";
import { ScrollView } from "react-native";
import useUserFetch from "../../../../hooks/useUserFetch";
import useNotificationFetch from "../../../../hooks/useNotificationFetch";
import NotificationCard from "../../../../components/NotificationCard";

const index = () => {
  const { user } = useUserFetch();
  const { notification, loading, error, refetchNotification } =
    useNotificationFetch(user.id);
  console.log(notification);
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <FlatList
        data={notification}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetchNotification}
          />
        }
        renderItem={({ item, index }) => (
          <NotificationCard key={index} item={item} />
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
                ? "Error fetching notifications"
                : "No notifications found"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default index;
