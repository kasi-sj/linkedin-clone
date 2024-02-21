import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { checkImageURL } from "../utills";

const SendRequestCard = ({
  handleOption,
  userId,
  data,
  onPress,
  search,
  level,
}) => {
  if (!data?.name?.toLowerCase().includes((search || "").toLowerCase())) {
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
          margin: 10,
          resizeMode: "cover",
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
              width: 200,
            }}
          >
            {data.headline ? data.headline : "No headline"}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{
              marginVertical: 5,
            }}
            onPress={() => {
              handleOption(data.id);
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                fontWeight: "bold",
                marginHorizontal: 10,
              }}
            >
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default SendRequestCard;
