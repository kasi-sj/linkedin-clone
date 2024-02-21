import {
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  RefreshControl,
} from "react-native";
import { ScrollView } from "react-native";
import PostCard from "../../../../components/PostCard";
import useUserFetch from "../../../../hooks/useUserFetch";
import useUserPostFetch from "../../../../hooks/useUserPostFetch";
import { useEffect, useState } from "react";
import { useRoute } from "expo-router";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { checkImageURL } from "../../../../utills";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import Toast from "react-native-simple-toast";

const UserImage = ({ user }) => {
  return (
    <Image
      style={{
        width: 40,
        height: 40,
        borderRadius: 40,
        resizeMode: "cover",
        marginLeft: 10,
      }}
      source={{
        uri: checkImageURL(user?.profileImage)
          ? user?.profileImage
          : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      }}
    />
  );
};

const id = () => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const { id } = useGlobalSearchParams();
  const {
    user,
    loading: userLoading,
    error: userError,
    refetchUser,
  } = useUserFetch(id);
  const { posts, loading, error, refetchPosts, removePost } =
    useUserPostFetch(id);
  const { user: currentUser } = useUserFetch();
  const [state, setState] = useState(null);
  const [send, setSend] = useState(false);
  useEffect(() => {
    console.log(user?.id,currentUser?.id)
    if (user?.connections?.includes(currentUser?.id)) {
      setState("connected");
    } else if (currentUser?.sentConnectionRequests?.includes(user?.id)) {
      setState("pending");
      setSend(true);
    } else {
      setState("connect");
      setSend(false);
    }
  }, [user, currentUser]);

  const sendRequest = async (id) => {
    try {
      const props = {
        currentUserId: currentUser.id,
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
    const senderId = currentUser.id;
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

  const onConnect = async () => {
    if (!send) {
      const res = await sendRequest(user.id);
      if (res) {
        Toast.show("Connection request sent");
        console.log("sent");
        setSend(true);
        setState("pending");
        return true;
      }
    } else {
      const res = await removeRequest(user.id);
      if (res) {
        Toast.show("Connection request removed");
        console.log("removed");
        setSend(false);
        setState("connect");
        return true;
      }
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          height: 100,
          width: "100%",
          flexDirection: "row",
          gap: 20,
          paddingTop: 20,
          marginBottom: 10,
          paddingHorizontal: 10,
          alignItems: "center",
          elevation: 1,
          shadowColor: "black",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 0 },
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={24} color="grey" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Activity
        </Text>
      </View>
      <View
        refreshControl={
          <RefreshControl
            refreshing={loading || userLoading}
            onRefresh={refetchPosts}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            alignItems: "flex-start",
            marginBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 10,
            backgroundColor: "white",
            paddingBottom: 10,
          }}
        >
          <UserImage user={user} />
          <View
            style={{
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                width: 150,
                flexShrink: 15,
                fontWeight: "bold",
              }}
            >
              {user?.name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                width: 150,
                color: "grey",
                fontSize: 15,
                fontWeight: "400",
              }}
            >
              {user?.headline || "no headline"}
            </Text>
            <Text
              numberOfLines={1}
              style={{ width: 150, color: "grey", fontSize: 12 }}
            >
              {user?.connections?.length} connections
            </Text>
          </View>
          {user &&
            currentUser &&
            user.id &&
            currentUser.id &&
            user?.id != currentUser?.id &&
            state && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {state !== "connected" ? (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      paddingHorizontal: 5,
                      gap: 5,
                      borderColor: !send ? "#0072b1" : "grey",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      borderWidth: 1,
                    }}
                    onPress={() => {
                      onConnect();
                    }}
                  >
                    {!send && (
                      <AntDesign name="plus" size={24} color="#0072b1" />
                    )}
                    <Text
                      style={{
                        color: send ? "grey" : "#0072b1",
                        fontWeight: "bold",
                      }}
                    >
                      {state}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      padding: 5,
                      paddingHorizontal: 5,
                      gap: 5,
                      borderColor: "grey",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: "grey",
                        fontWeight: "bold",
                      }}
                    >
                      {state}
                    </Text>
                  </View>
                )}
              </View>
            )}
        </View>
        <View>
          {posts.map((item, index) => {
            return (
              <PostCard
                key={index}
                item={item}
                userId={id}
                removePost={removePost}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default id;

const styles = StyleSheet.create({});
