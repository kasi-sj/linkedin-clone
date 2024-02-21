import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import useUserFetch from "../hooks/useUserFetch";
import { checkImageURL } from "../utills";
import moment from "moment";
const RoomCard = ({ room, user , search }) => {
  const router = useRouter();
  const peopleId = room.user1Id === user.id ? room.user2Id : room.user1Id;
  const { user : people} = useUserFetch(peopleId);
  if(search && !people.name.toLowerCase().includes(search.toLowerCase())){
    return null;
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
        router.push(`(drawer)/peopleList/chatRoom/${room.id}`);
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
            uri:
              checkImageURL(people.profileImage)
                ? people.profileImage
                :
              "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
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
          <Text
          numberOfLines={1}
            style={{
              width : 170,
              fontWeight: "bold",
            }}
          >
           {people.name}
          </Text>
          <Text
          numberOfLines={1}
            style={{
              width : 170,
              fontSize: 12,
              fontWeight: "200",
            }}
          >
            {room.newMessage ? room.newMessage : "..."}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "200",
              marginTop: 5,
            }}
          >
            {room.time ? moment(room.time).fromNow() : "00:00"}
          </Text>
          {room.noOfNewMessage > 0 && <View
            style={{
              backgroundColor: "#0072b1",
              borderRadius: 50,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {room.noOfNewMessage}
            </Text>
          </View>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default RoomCard;
