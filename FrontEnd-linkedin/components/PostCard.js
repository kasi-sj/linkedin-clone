import React, { useEffect, useState } from "react";
import Toast from 'react-native-simple-toast';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { checkImageURL } from "../utills";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

const RenderMedia = ({ image, mimiType }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    video?.current?.playAsync();
  }, []);

  if (!image) return null;
  const isVideo = mimiType == "video";
  if (isVideo) {
    return (
      <View
        style={{
          width: "100%",
          height: 400,
          padding: 10,
          marginBottom: 40,
        }}
      >
        <Video
          isMuted={isMuted}
          ref={video}
          style={{
            width: "100%",
            height: 400,
            padding: 10,
            marginVertical: 20,
          }}
          source={{
            uri: image,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            right: 10,
            zIndex: 2,
          }}
          onPress={() => {
            setIsMuted(!isMuted);
          }}
        >
          {isMuted ? (
            <>
              <MaterialIcons name="volume-off" size={24} color="black" />
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                UnMute
              </Text>
            </>
          ) : (
            <>
              <MaterialIcons name="volume-up" size={24} color="black" />
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                mute
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            video.current.replayAsync();
          }}
          style={{
            position: "absolute",
            bottom: 20,
            left: 10,
            zIndex: 2,
          }}
        >
          {!status.isPlaying && (
            <>
              <AntDesign name="reload1" size={24} color="black" />
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                replay
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <Image
        source={{ uri: image }}
        style={{ width: "100%", height: 240, marginVertical: 20 }}
      />
    );
  }
};

const PostCard = ({ item, userId, disable, refetchPosts, removePost }) => {
  const [post, setPost] = useState(item);
  useEffect(() => {
    setPost(item);
  }, [item]);
  const router = useRouter();
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const MAX_LINES = 2;
  const [showfullText, setShowfullText] = useState(false);
  const toggleShowFullText = () => {
    setShowfullText(!showfullText);
  };
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(userId));
  useEffect(() => {
    setIsLiked(post?.likes?.includes(userId));
  }, [userId, post]);
  const onLike = async () => {
    try {
      console.log("like post");
      setIsLiked(!isLiked);
      if (isLiked) {
        setPost({ ...post, likes: post?.likes?.filter((id) => id != userId) });
      } else {
        setPost({ ...post, likes: [...post?.likes, userId] });
      }
      const res = await axios.post(`${url}likePost`, {
        userId: userId,
        postId: post.id,
        like: !isLiked,
      });
      if (res.status != 200) {
        Toast.show("Something went wrong");
        setIsLiked(!isLiked);
        if (isLiked) {
          setPost({ ...post, likes: [...post?.likes, userId] });
        } else {
          setPost({
            ...post,
            likes: post?.likes?.filter((id) => id != userId),
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (refetchPosts) {
      refetchPosts();
    }
  };
  return (
    <Pressable
      disabled={disable}
      onPress={() => {
        console.log(post.id);
        router.push(`/post/${post.id}`);
      }}
      style={{
        paddingTop: 10,
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
        onPress={() => {
          console.log(post.id);
          router.push(`/profile/${post?.user?.id}`);
        }}
      >
        <Image
          style={{
            width: 45,
            height: 45,
            borderRadius: 40,
          }}
          source={{
            uri: checkImageURL(post?.user?.profileImage)
              ? post?.user?.profileImage
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
            {post?.user?.name}
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
            {post?.user?.headline || ""}
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 12,
            }}
          >
            {moment(post?.createdAt).fromNow()}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* <Entypo name="dots-three-vertical" size={20} color="black" /> */}
          {removePost && <TouchableOpacity onPress={() => removePost(post.id)}>
            <Feather name="x" size={20} color="black" />
          </TouchableOpacity>}
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
        <Text
          style={{ fontSize: 15 }}
          numberOfLines={showfullText ? undefined : MAX_LINES}
        >
          {post?.description}
        </Text>
        {!showfullText && (
          <TouchableOpacity onPress={toggleShowFullText}>
            <Text>See more</Text>
          </TouchableOpacity>
        )}
      </View>
      <RenderMedia image={post?.imageUrl} mimiType={post?.mimiType} />
      {post?.likes?.length > 0 && (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <SimpleLineIcons name="like" size={16} color="#0072b1" />
          <Text style={{ color: "gray" }}>{post?.likes?.length}</Text>
        </View>
      )}

      <View
        style={{
          height: 2,
          borderColor: "#E0E0E0",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity onPress={onLike}>
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
        <TouchableOpacity
          disabled={disable}
          onPress={() => {
            console.log(post.id);
            router.push(`/post/${post.id}`);
          }}
        >
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
          <Feather
            name="send"
            size={20}
            color="gray"
            style={{ textAlign: "center" }}
          />
          <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default PostCard;
