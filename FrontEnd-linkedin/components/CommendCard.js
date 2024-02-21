import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import moment from "moment";
import axios from "axios";
import { checkImageURL } from "../utills";

const CommendCard = ({ item, userId, refetchPost,postAuthorId, disabled }) => {
  const router = useRouter();
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [isAuthor, setIsAuthor] = useState(false);

  const [like, setLike] = useState(item?.likes?.includes(userId));
  const [commentLike, setCommentLike] = useState(item?.comments[0]?.likes?.includes(userId));

  useEffect(() => {
    // console.log("---",postAuthorId,item,"---")
    if (postAuthorId == item?.authorId) {
      setIsAuthor(true);
    }
  }, [postAuthorId, userId]);

  useEffect(() => {
    // console.log("commentcomment" + item?.comments[0]?.likes?.includes(userId));
    // console.log("comment" + item?.likes?.includes(userId));
    setLike(item?.likes?.includes(userId));
    setCommentLike(item?.comments[0]?.likes?.includes(userId));
  }, [item,userId]);
  const onLike = async (id) => {
    try {
      console.log("like");
      console.log(`${url}/likeComment/`);
      const response = await axios.post(`${url}likeComment/`, {
        commentId: id ? id : item.id,
        userId: userId,
      });
      if (response.status == 200) {
        console.log("like");
        if(!id)
        setLike(!like);
        else
        setCommentLike(!commentLike);
      }
      refetchPost();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 10,
      }}
    >
      <UserImage user={item.author} />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          router.push(`post/comment/${item.id}`);
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width - 100,
            backgroundColor: "lightgrey",
            borderTopEndRadius: 10,
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
            padding: 10,
            margin: 10,
            gap: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              {item.author.name}
            </Text>
            {isAuthor && (
              <View
                style={{
                  backgroundColor: "darkgrey",
                  borderRadius: 5,
                  padding: 3,
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Author
                </Text>
              </View>
            )}
          </View>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: 10,
              color: "grey",
              numberOfLines: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.author.headline}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontWeight: "500",
            }}
          >
            {item.text}
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 10,
              marginLeft: 10,
            }}
          >
            {moment(item.createdAt).fromNow()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
            }}
          >
            <TouchableOpacity onPress={()=>{onLike(item?.id)}}>
              <Text
                style={{
                  color: like ? "#0072b1" : "grey",
                }}
              >
                Like
              </Text>
            </TouchableOpacity>
            {item?.likes?.length > 0 && (
              <Text
                style={{
                  marginHorizontal: 10,
                  color: "lightgrey",
                }}
              >
                ● {item?.likes?.length} likes
              </Text>
            )}
          </View>
          <Text
            style={{
              marginHorizontal: 10,
              color: "grey",
            }}
          >
            |
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push(`post/comment/${item.id}`);
            }}
          >
            <Text
              style={{
                marginHorizontal: 10,
                color: "grey",
              }}
            >
              Reply
            </Text>
          </TouchableOpacity>
          {item?.comments?.length > 0 && (
            <Text
              style={{
                marginHorizontal: 10,
                color: "lightgrey",
              }}
            >
              ● {item?.comments?.length} reply
            </Text>
          )}
        </View>
        <View
          style={{
            width: Dimensions.get("window").width - 300,
            flexDirection: "row",
            // justifyContent: "flex-end",
            marginTop: 15,
          }}
        >
          {item.comments.length > 0 && !disabled && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginVertical: 10,
              }}
              onPress={() => {
                router.push(`post/comment/${item.id}`);
              }}
            >
              <UserImage user={item.comments[0].author} />
              <View style={{
                flexDirection : 'column'
              }}>
                <View
                  style={{
                    width: Dimensions.get("window").width - 150,
                    backgroundColor: "lightgrey",
                    borderTopEndRadius: 10,
                    borderBottomEndRadius: 10,
                    borderBottomStartRadius: 10,
                    padding: 10,
                    margin: 10,
                    gap: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      {item.comments[0].author.name}
                    </Text>
                    {isAuthor && (
                      <View
                        style={{
                          backgroundColor: "darkgrey",
                          borderRadius: 5,
                          padding: 3,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                          }}
                        >
                          Author
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 10,
                      color: "grey",
                      numberOfLines: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.comments[0].author.headline}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontWeight: "500",
                    }}
                  >
                    {item.comments[0].text}
                  </Text>
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 10,
                      marginLeft: 10,
                    }}
                  >
                    {moment(item.comments[0].createdAt).fromNow()}
                  </Text>
                  
                </View>
                <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 10,
                      }}
                    >
                      <TouchableOpacity onPress={()=>{onLike(item?.comments[0]?.id)}}>
                        <Text
                          style={{
                            color: commentLike ? "#0072b1" : "grey",
                          }}
                        >
                          Like
                        </Text>
                      </TouchableOpacity>
                      {item.comments[0]?.likes?.length > 0 && (
                        <Text
                          style={{
                            marginHorizontal: 10,
                            color: "lightgrey",
                          }}
                        >
                          ● {item.comments[0]?.likes?.length} likes
                        </Text>
                      )}
                    </View>
                    <Text
                      style={{
                        marginHorizontal: 10,
                        color: "grey",
                      }}
                    >
                      |
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        router.push(`post/comment/${item?.comments[0]?.id}`);
                      }}
                    >
                      <Text
                        style={{
                          marginHorizontal: 10,
                          color: "grey",
                        }}
                      >
                        Reply
                      </Text>
                    </TouchableOpacity>
                    {item.comments[0]?.comments?.length > 0 && (
                      <Text
                        style={{
                          marginHorizontal: 10,
                          color: "lightgrey",
                        }}
                      >
                        ● {item.comments[0]?.comments?.length} reply
                      </Text>
                    )}
                  </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

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

export default CommendCard;
