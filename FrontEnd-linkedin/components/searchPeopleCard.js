import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { checkImageURL } from "../utills";
import { useState } from "react";

const UserImage = ({ user }) => {
  return (
    <Image
      style={{
        width: 45,
        height: 45,
        borderRadius: 40,
        resizeMode: "cover",
        margin: 10,
      }}
      source={{
        uri: checkImageURL(user?.profileImage)
          ? user?.profileImage
          : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      }}
    />
  );
};

const SearchPeopleCard = ({
  userId,
  data,
  onPress,
  search,
  onConnect,
  sendConnection,
  level,
}) => {
  return (
    // <View>
    //     <Feather name="clock" size={24} color="black" />
    //     <MaterialIcons name="person-add-alt-1" size={24} color="black" />
    // </View>
    <TouchableOpacity
      onPress={() => {
        onPress(`/profile/${data?.id}`);
      }}
      style={{
        flexDirection: "row",
        marginBottom: 10,
        paddingTop: 10,
        backgroundColor: "white",
        paddingBottom: 10,
        height: 100,
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <UserImage user={data} />
        <View
          style={{
            flexDirection: "column",
            gap: 2,
            marginLeft: 30,
            width: "auto",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              justifyContent: "flex-start",
              width: 150,
              flex: 1,
            }}
          >
            <Text
            numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#000",
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
                fontSize: 13,
                fontWeight: "grey",
                color: "#000",
                width:150
              }}
            >
              {data.email}
            </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: 150,
              color: "grey",
              fontSize: 12,
              fontWeight: "400",
            }}
          >
            {data?.headline || "no headline"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          padding: 5,
          paddingHorizontal: 10,
          marginRight: 10,
          gap: 5,
          borderColor: "#0072b1",
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          borderWidth: 1,
        }}
        onPress={() => {
          onConnect(data?.id);
        }}
      >
        {!sendConnection.includes(data?.id) && (
          <AntDesign name="plus" size={24} color="#0072b1" />
        )}
        <Text
          style={{
            color: sendConnection.includes(data?.id) ? "grey" : "#0072b1",
            fontWeight: "bold",
          }}
        >
          {!sendConnection.includes(data?.id) ? "Connect" : "Pending"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default SearchPeopleCard;
