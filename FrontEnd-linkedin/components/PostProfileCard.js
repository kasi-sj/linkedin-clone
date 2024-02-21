import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { checkImageURL } from "../utills";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { Ionicons, Entypo, Feather, FontAwesome  } from "@expo/vector-icons";
import axios from "axios";


const PostCard = ({ item , userId}) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const MAX_LINES = 2;
  const [showfullText, setShowfullText] = useState(false);
  const toggleShowFullText = () => {
    setShowfullText(!showfullText);
  };
  const [isLiked, setIsLiked] = useState(item?.likes?.includes(userId));
  const onLike = async () => {
    try{
      console.log("like post");
        const res = await axios.post(`${url}likePost`,{
            userId : userId,
            postId : item.id,
            like : !isLiked
        });
        console.log(res);
        if(res.status == 200){
            setIsLiked(!isLiked);
        }
    }catch(err){
        console.log(err);
    }
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <Image
          style={{
            width: 45,
            height: 45,
            borderRadius: 40,
          }}
          source={{
            uri: checkImageURL(item?.user?.profileImage)
              ? item?.user?.profileImage
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
        <View
          style={{
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Text
            style={{
              flexShrink: 15,
              fontWeight: "bold",
            }}
          >
            {item?.user?.name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: 230,
              color: "grey",
              fontSize: 15,
              fontWeight: "400",
            }}
          >
            {item?.user?.userDescription || "No description"}
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 12,
            }}
          >
            {moment(item?.createdAt).fromNow()}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
          <Feather name="x" size={20} color="black" />
        </View>
      </View>
      <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
        <Text
          style={{ fontSize: 15 }}
          numberOfLines={showfullText ? undefined : MAX_LINES}
        >
          {item?.discription}
        </Text>
        {!showfullText && (
          <TouchableOpacity onPress={toggleShowFullText}>
            <Text>See more</Text>
          </TouchableOpacity>
        )}
      </View>
      <Image
        style={{ width: "100%", height: 400 }}
        source={{
          uri: checkImageURL(item?.imageUrl)
            ? item?.imageUrl
            : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        }}
      />
      {item?.likes?.length > 0 && (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <SimpleLineIcons name="like" size={16} color="#0072b1" />
          <Text style={{ color: "gray" }}>{item?.likes?.length}</Text>
        </View>
      )}

      <View
        style={{
          height: 2,
          borderColor: "#E0E0E0",
          borderWidth: 2,
        }}
      />
      <View style={{
        flex : 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
      }}>

      <TouchableOpacity
        onPress={onLike}
      >
        <AntDesign
          style={{ textAlign: "center" }}
          name="like2"
          size={24}
          color={isLiked ? "#0072b1" : "gray"}
          />
        <Text
          style={{
              textAlign: "center",
              fontSize: 12,
              color: isLiked ? "#0072b1" : "gray",
              marginTop: 2,
            }}
            >
          Like
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome
          name="comment-o"
          size={20}
          color="gray"
          style={{ textAlign: "center" }}
          />
        <Text
          style={{
              textAlign: "center",
              marginTop: 2,
              fontSize: 12,
              color: "gray",
            }}
            >
          Comment
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          name="share-outline"
          size={20}
          color="gray"
          style={{ textAlign: "center" }}
          />
        <Text
          style={{
              marginTop: 2,
              fontSize: 12,
              textAlign: "center",
              color: "gray",
            }}
            >
          repost
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Feather name="send" size={20} color="gray" style={{textAlign:"center"}} />
        <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>Send</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default PostCard;
