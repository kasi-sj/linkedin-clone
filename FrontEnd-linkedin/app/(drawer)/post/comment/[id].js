import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import useCommentFetchById from "../../../../hooks/useCommentFetchById";
import useUserFetch from "../../../../hooks/useUserFetch";
import { ScrollView } from "react-native";
import { useState } from "react";
import { checkImageURL } from "../../../../utills";
import PostCard from "../../../../components/PostCard";
import { TextInput } from "react-native";
import { allComments } from "../../../../data";
import moment from "moment";
import axios from "axios";
import CommendCard from "../../../../components/CommendCard";
import { RefreshControl } from "react-native";

const UserImage = ({ user }) => {
    return (
      <Image
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          resizeMode: "cover",
          marginLeft: 10,
        }}
        source={{
          uri: checkImageURL(user?.profileImage)
            ? user?.profileImage
            : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        }}
      />
    );
  };

function selectRandomComments(comments) {
  for (let i = comments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [comments[i], comments[j]] = [comments[j], comments[i]];
  }
  return comments.slice(0, 5);
}

const Id = () => {
  const { id } = useGlobalSearchParams();
  const {
    comment,
    comments,
    error,
    refetchComment,
    commentLoading,
    loading,
    addCommentonComment,
  } = useCommentFetchById(id);
  const { user } = useUserFetch();
  const [text, setText] = useState("");
  const [randomComments, setRandomComments] = useState([]);
  useEffect(() => {
    setRandomComments(selectRandomComments(allComments));
  }, []);

  const onComment = async () => {
    const result = await addCommentonComment(text, user?.id);
    if (result) {
      console.log("ok");
    } else {
      console.log("notok");
    }
    setText("");
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetchComment} />
      }
    >
      <View>
        <Text>
            {comment && <CommendCard item={comment} userId={user?.id} refetchPost={refetchComment} disabled postAuthorId={comment.authorId} />}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            margin: 10,
          }}
        >
          Reactions
        </Text>
        <ScrollView>
          <ScrollView
            horizontal
            style={{
              marginVertical: 20,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {comment?.likedUsers?.map((item) => {
              return <UserImage item={item.id} user={item} />;
            })}
          </ScrollView>
        </ScrollView>
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            margin: 10,
          }}
        >
          Comments
        </Text>
        <View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              margin: 10,
            }}
          >
            Write your own thought
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {randomComments.map((item) => {
              return (
                <TouchableOpacity
                  key={item}
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "grey",
                    borderRadius: 50,
                    marginHorizontal: 5,
                  }}
                  onPress={() => {
                    setText(item);
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 20,
              marginHorizontal: 5,
              borderBottomColor: "grey",
              borderBottomWidth: 1,
              marginHorizontal: 10,
              paddingBottom: 10,
            }}
          >
            <UserImage user={user} />
            <TextInput
              style={{
                width: Dimensions.get("window").width - 100,
                paddingHorizontal: 20,
              }}
              value={text}
              onChangeText={(text) => setText(text)}
            />
            {commentLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <TouchableOpacity disabled={text == ""} onPress={onComment}>
                <Text
                  style={{
                    color: text == "" ? "grey" : "#0072b1",
                    paddingRight: 10,
                  }}
                >
                  Post
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {comments.map((item) => {
        return <CommendCard key={item?.id} item={item} userId={user?.id} refetchPost={refetchComment} postAuthorId={comment.authorId}/>;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Id;
