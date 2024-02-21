import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { checkImageURL } from "../utills";

const RequestCard = ({
  handleOption,
  userId,
  data,
  search,
  level,
  onPress,
}) => {
  const handleAccept = async () => {
    console.log("accepting");
    handleOption("accept", data.id);
  };

  const handleReject = async () => {
    console.log("rejecting");
    handleOption("reject", data.id);
  };

  if (
    !(data?.name || "").toLowerCase().includes((search || "").toLowerCase())
  ) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(data?.id);
      }}
      style={{
        flex: 1,
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
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
              width: 170,
              fontSize: 14,
              marginLeft: 10,
              color: "#000",
            }}
          >
            {data.email}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              width: 170,
              fontSize: 12,
              marginLeft: 10,
              color: "#000",
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
            onPress={handleAccept}
          >
            <AntDesign name="checkcircleo" size={28} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginVertical: 5,
            }}
            onPress={handleReject}
          >
            <AntDesign name="closecircleo" size={28} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RequestCard;
