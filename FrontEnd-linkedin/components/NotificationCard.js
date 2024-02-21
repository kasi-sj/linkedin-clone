import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { checkImageURL } from "../utills";
import moment from "moment";

const NotificationCard = ({ item }) => {
  const router = useRouter();

  const handleOnPress = () => {
    console.log(item);
    if(item?.type === "connectionRequest"){
      router.push("(drawer)/(tabs)/network")
    } else if(item?.type === "Connection accepted"){
      router.push("(drawer)/(tabs)/network/invitations/connections")
    } else if(item?.type === "post"){
      router.push(`(drawer)/post/${item?.postId}`)
    } else if(item?.type == "like"){
      if(item?.postId){
        router.push(`(drawer)/post/${item?.postId}`)
      }else if(item?.commentId){
        router.push(`(drawer)/post/comment/${item?.commentId}`)
      }
    } else if(item?.type === "comment"){
      if(item?.postId){
        router.push(`(drawer)/post/${item?.postId}`)
      }else if(item?.commentId){
        router.push(`(drawer)/post/comment/${item?.commentId}`)
      }
    }
  }
  return (
    <TouchableOpacity
      style={{
        width: Dimensions.get("window").width,
        height: 70,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
      onPress={() => {
        handleOnPress();
        // router.push(`(drawer)/peopleList/chatRoom/${room.id}`);
      }}
    >
      <View
        style={{
          marginRight: 10,
        }}
      >
        <Image
          style={{
            width: 45,
            height: 45,
            margin: 10,
            borderColor: "lightgray",
            padding: 2,
            borderRadius: 50,
          }}
          source={{
            uri: checkImageURL(item?.author?.profileImage)
              ? item?.author?.profileImage
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 5,
          borderBottomWidth: 1,
          borderColor: "lightgray",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            marginTop: 5,
          }}
        >
          <View>
            <Text
              numberOfLines={1}
              style={{
                width : 170,
                fontWeight: "bold",
              }}
            >
              {item?.title}
            </Text>

            <View>
              <Text
              numberOfLines={1}
                style={{
                  width : 170,
                  fontSize: 12,
                  fontWeight: "200",
                  marginTop: 5,
                }}
              >
                {item?.message}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "200",
              marginTop: 5,
            }}
          >
            {moment(item?.createdAt).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
