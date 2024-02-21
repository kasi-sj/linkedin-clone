import { Image, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { checkImageURL } from "../utills";

const profileCard = ({ userId, data, onPress, search, level }) => {
  if (!data.name.toLowerCase().includes(search.toLowerCase())) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(`/profile/${data?.id}`);
      }}
      style={{
        flex: 1,
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
        height: 100,
        backgroundColor: "#fff",
      }}
    >
      <Image
        style={{
          width: 45,
          height: 45,
          borderRadius: 40,
          resizeMode: "cover",
          margin: 10,
        }}
        source={{
          uri: checkImageURL(data.profileImage)
            ? data.profileImage
            : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 10,
                color: "#000",
                width: 170,
              }}
            >
              {data.name}
            </Text>
            <Text
              style={{
                color: "grey",
                fontSize: 12,
              }}
            >
              {level
                ? level == 1
                  ? "1st"
                  : level == 2
                  ? "2nd"
                  : level == 3
                  ? "3rd"
                  : level == 999
                  ? ""
                  : `${level}th`
                : ""}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              marginLeft: 10,
              color: "#000",
              width: 170,
            }}
          >
            {data.email}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 12,
              marginLeft: 10,
              color: "#000",
              width: 170,
            }}
          >
            {data.headline ? data.headline : "No headline"}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              onPress(`/(drawer)/peopleList`);
            }}
            style={{
              marginVertical: 5,
            }}
          >
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default profileCard;
