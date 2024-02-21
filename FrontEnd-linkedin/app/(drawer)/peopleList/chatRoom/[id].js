import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { useGlobalSearchParams } from "expo-router";
import useChatRoomFetch from "../../../../hooks/useChatRoomFetch";
import useUserFetch from "../../../../hooks/useUserFetch";
import Date from "../../../../cards/Date";
import Message from "../../../../cards/Message";
import axios from "axios";
import { checkImageURL } from "../../../../utills";
import useMessageFetch from "../../../../hooks/useMessageFetch";
import socket from "../../../utils/socket";

const messages = [
  {
    userId: "65b4a6b9a86ac616b90553a4",
    message: "Hi , How are you ?",
    createdAt: "2021-11-22T14:30:00.000Z",
  },
  {
    userId: "65b49daba6cbc7a906234f57",
    message: "I am fine , How are you ?",
    createdAt: "2021-11-22T14:30:00.000Z",
  },
  {
    userId: "65b4a6b9a86ac616b90553a4",
    message: "what are you doing ?",
    createdAt: "2021-11-22T14:30:00.000Z",
  },
  {
    userId: "65b49daba6cbc7a906234f57",
    message: "I am doing good",
    createdAt: "2021-11-22T14:30:00.000Z",
  },
  {
    userId: "65b4a6b9a86ac616b90553a4",
    message: "ok , bye",
    createdAt: "2021-11-22T14:30:00.000Z",
  },
  {
    userId: "65b49daba6cbc7a906234f57",
    message: "bye",
    createdAt: "2021-11-22T14:30:00.000Z",
  },
  {
    userId: "65b4a6b9a86ac616b90553a4",
    message: "it's been a long time",
    createdAt: "2022-12-22T14:30:00.000Z",
  },
  {
    userId: "65b49daba6cbc7a906234f57",
    message: "yes , it's been a long time",
    createdAt: "2022-12-22T14:30:00.000Z",
  },
];

const convertTOBlock = (messages) => {
  if (messages.length == 0) return [];
  const newBlocks = [];
  let curBlock = {
    date: moment(messages[0].createdAt).format("MMM DD, YYYY"),
    messages: [
      {
        userId: messages[0].userId,
        message: messages[0].text,
        time: moment(messages[0].createdAt).format("hh:mm A"),
      },
    ],
  };
  for (let i = 1; i < messages.length; i++) {
    if (moment(messages[i].createdAt).format("MMM DD, YYYY") == curBlock.date) {
      curBlock.messages.push({
        userId: messages[i].userId,
        message: messages[i].text,
        time: moment(messages[i].createdAt).format("hh:mm A"),
      });
    } else {
      newBlocks.push(curBlock);
      curBlock = {
        date: moment(messages[i].createdAt).format("MMM DD, YYYY"),
        messages: [
          {
            userId: messages[i].userId,
            message: messages[i].text,
            time: moment(messages[i].createdAt).format("hh:mm A"),
          },
        ],
      };
    }
  }
  newBlocks.push(curBlock);
  return newBlocks;
};

const index = () => {
  const [sending, setSending] = useState(false);
  const [block, setBlock] = useState([]);
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const { id } = useGlobalSearchParams();
  const { messages, setMessages, loading, refetchMessages } =
    useMessageFetch(id);
  const [text, setText] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const { room, refetchRoom } = useChatRoomFetch(id);
  const { user: user, refetchUser: refetchUser, getUser } = useUserFetch();
  const [user1, setUser1] = useState();
  const [user2, setUser2] = useState();

  useEffect(() => {
    if (user && user1 && user2) {
      console.log("ok");
    }
  }, [user, user1, user2]);

  const appendMessage = (message) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
    return () => {
      socket.off("connect");
    };
  });

  const updateUser = async () => {
    setUser1(await getUser(room.user1Id));
    setUser2(await getUser(room.user2Id));
  };

  useEffect(() => {
    if (room) {
      updateUser();
    }
  }, [room]);

  useEffect(() => {
    if (messages) {
      setBlock(convertTOBlock(messages));
    }
  }, [messages]);

  const onSendMessage = async () => {
    const message = {
      text: text,
      roomId: id,
      userId: user.id,
      imageUrl: imageUrl,
    };
    if (text != "" || imageUrl != "") {
      setSending(true);
      const response = await axios.post(`${url}createMessage`, message);
      if (response.status == 200) {
        setText("");
        setImageUrl("");
      }
      socket.emit("sendMessage", response.data, id);
      appendMessage(response.data);
      setSending(false);
    }
  };
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log("received", messages.length);
      appendMessage(message);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [messages]);

  useEffect(() => {
    socket.emit("joinRoom", id);
    return () => {
      socket.emit("leaveRoom", id);
    };
  }, [id]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
        paddingVertical: 3,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refetchMessages()}
          />
        }
        style={{
          height: Dimensions.get("window").height - 150,
        }}
        ref={(ref) => {
          if (ref) {
            ref.scrollToEnd({ animated: true });
          }
        }}
      >
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Image
            style={{
              width: 70,
              height: 70,
              margin: 10,
              borderColor: "lightgray",
              padding: 2,
              borderRadius: 50,
            }}
            source={{
              uri: checkImageURL(
                user?.id == user1?.id
                  ? user2?.profileImage
                  : user1?.profileImage
              )
                ? user?.id == user1?.id
                  ? user2?.profileImage
                  : user1?.profileImage
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
            }}
          />
          <Text>{user?.id == user1?.id ? user2?.name : user1?.name}</Text>
          <Text>
            {user?.id == user1?.id
              ? user2?.userDescription
              : user1?.userDescription}
          </Text>
        </View>
        <View
          style={{
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          {room &&
            user1 &&
            user2 &&
            block.map((block, index) => {
              return (
                <View key={index}>
                  <Date date={block.date} />
                  {block.messages.map((message, index) => {
                    return (
                      <View key={index}>
                        <Message
                          message={message}
                          user1={user1}
                          user2={user2}
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 50,
            padding: 10,
            elevation: 5,
          }}
        >
          <Feather name="plus" size={24} color="#0072b1" />
        </TouchableOpacity>
        <View>
          <TextInput
            placeholder="Type a message"
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "lightgray",
              padding: 10,
              width: 250,
            }}
            onChangeText={(text) => setText(text)}
            value={text}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 50,
            padding: 10,
            elevation: 5,
          }}
          onPress={() => {
            onSendMessage();
          }}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : text == "" ? (
            <FontAwesome6 name="microphone" size={24} color="#0072b1" />
          ) : (
            <MaterialCommunityIcons name="send" size={24} color="#0072b1" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default index;
