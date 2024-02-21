import React from "react";
import { View, Text, Image } from "react-native";
import { checkImageURL } from "../utills";

const Message = ({message, user1, user2}) => {
  const profileImage = message.userId === user1.id ? user1.profileImage : user2.profileImage;
  const name = message.userId === user1.id ? user1.name : user2.name;
  const time = message.time;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          margin: 5,
        }}
      >
        <Image
          style={{
            width: 35,
            height: 35,
            margin: 5,
            borderColor: "lightgray",
            padding: 2,
            borderRadius: 50,
          }}
          source={{
            uri: checkImageURL(profileImage)
              ? profileImage
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
        <Text
          style={{
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontWeight: "200",
            fontSize: 15,
            color: "gray",
            marginHorizontal: 7,
          }}
        >
          • {time}
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: 10,
        }}
      >
        <Text>{message.message}</Text>
      </View>
    </View>
  );
};

export default Message;
