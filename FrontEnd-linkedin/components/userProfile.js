import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { checkImageURL } from "../utills";
import {useRouter} from "expo-router"

const userProfile = ({ userId, data, onConnect }) => {
  const router = useRouter();
  const [connect, setConnect] = React.useState(
    data?.connectionRequests?.includes(userId)
  );
  return (
    <TouchableOpacity
    onPress={() => {
      router.push(`/profile/${data?.id}`);
    }}
      style={{
        flex: 1,
        borderRadius: 9,
        marginHorizontal: 2,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        marginVertical: 2,
        justifyContent: "space-between",
        height: Dimensions.get("window").height / 3 ,
        width: (Dimensions.get("window").width - 40) / 2,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          source={{
            uri: checkImageURL(data.banner)
              ? data.banner
              : "https://i.pinimg.com/originals/c4/5d/c3/c45dc310955cb3f12915f77c90e54a88.jpg",
          }}
          style={{
            width: (Dimensions.get("window").width - 40) / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              top : 40,
              width: 90,
              height: 90,
              borderRadius: 45,
              resizeMode: "cover",
            }}
            source={{
              uri: checkImageURL(data.profileImage)
                ? data.profileImage
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
            }}
          />
        </ImageBackground>
      </View>
      <View
        style={{
          marginTop: 40,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {data.name}
        </Text>
        <Text
        numberOfLines={2}
          style={{
            marginHorizontal : 10,
            marginVertical : 5,
            textAlign: "center",
            fontSize: 14,
            fontWeight: "400",
          }}
        >
          {data.headline ? data.headline : "no description"}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          borderColor: connect ? "#E0E0E0" : "#0072b1",
          borderWidth: 1,
          borderRadius: 25,
          marginBottom: 15,
          paddingHorizontal: 15,
          paddingVertical: 4,
        }}
        onPress={() => {
          const res = onConnect(data.id, !connect);
          if (res) {
            setConnect(!connect);
          }
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            color: connect ? "#E0E0E0" : "#0072b1",
          }}
        >
          {connect ? "Pending" : "Connect"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default userProfile;
