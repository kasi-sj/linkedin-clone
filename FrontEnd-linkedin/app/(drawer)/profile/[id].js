import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import useUserFetch from "../../../hooks/useUserFetch";
import { checkImageURL } from "../../../utills";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable } from "react-native";
import { Foundation, FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import useUserPostFetch from "../../../hooks/useUserPostFetch";
import moment from "moment";
import axios from "axios";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalSearchParams } from "expo-router";
import { BackHandler } from "react-native";
import { RefreshControl } from "react-native";
import Toast from "react-native-simple-toast";


const ProfilePhotoModel = ({
  isModalVisible,
  setIsModalVisible,
  setProfileImageModelVisible,
  setBannerImageModelVisible,
}) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <Pressable
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        onPress={() => {
          setIsModalVisible(false);
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "15%",
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            paddingTop: 20,
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                setProfileImageModelVisible(true);
                setIsModalVisible(false);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              <FontAwesome5 name="camera" size={24} color="black" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  color: "grey",
                }}
              >
                Profile Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBannerImageModelVisible(true);
                setIsModalVisible(false);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              <Foundation name="photo" size={24} color="black" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  color: "grey",
                }}
              >
                Frame
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const ProfileImageModel = ({
  isProfileImageModelVisible,
  setProfileImageModelVisible,
  user,
}) => {
  const image = user?.profileImage;

  return (
    <Modal
      visible={isProfileImageModelVisible}
      animationType="slide"
      transparent={false}
      style={{
        backgroundColor: "black",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          backgroundColor: "black",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "center",
            padding: 20,
            backgroundColor: "black",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setProfileImageModelVisible(false);
              }}
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Profile Image
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "black",
            height: Dimensions.get("window").height - 150,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 300,
              height: 300,
              borderRadius: 100,
              zIndex: 1,
            }}
            source={{
              uri: checkImageURL(image)
                ? image
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const ProfileBannerModel = ({
  isProfileBannerModelVisible,
  setProfileBannerModelVisible,
  user,
}) => {
  const image = user?.banner;

  return (
    <Modal
      visible={isProfileBannerModelVisible}
      animationType="slide"
      transparent={false}
      style={{
        backgroundColor: "black",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          backgroundColor: "black",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "center",
            padding: 20,
            backgroundColor: "black",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setProfileBannerModelVisible(false);
              }}
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Banner Image
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "black",
            height: Dimensions.get("window").height - 150,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: Dimensions.get("window").width - 40,
              height: 200,
              zIndex: 1,
            }}
            source={{
              uri: checkImageURL(image)
                ? image
                : "https://i.pinimg.com/originals/c4/5d/c3/c45dc310955cb3f12915f77c90e54a88.jpg",
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const UserPostCard = ({ item, userId, userName }) => {
  const router = useRouter();
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/post/${item.id}`);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text>{userName} </Text>
        <Text
          style={{
            color: "grey",
            fontSize: 12,
          }}
        >
          posted this ● {moment(item?.createdAt).fromNow()}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        <Image
          style={{ width: "30%", height: 100, padding: 10, margin: 10 }}
          source={{
            uri: checkImageURL(item?.imageUrl)
              ? item?.imageUrl
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
        <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
          <Text style={{ fontSize: 15 }} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
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
          borderWidth: 1,
          marginHorizontal: 10,
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
      ></View>
    </TouchableOpacity>
  );
};

const Id = () => {
  const router = useRouter();
  useEffect(() => {
    const backAction = () => {
      router.navigate("home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const { id } = useGlobalSearchParams();
  const { user: currentUser, getFullUser } = useUserFetch();
  // useEffect(() => {
  //   getFullUser();
  // }, [user.id]);

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const refetchUser = async () => {
    setLoading(true);
    if (id) {
      setUser(await getFullUser(id, true));
    }
    setLoading(false);
    console.log(currentUser?.id, user?.id);
  };
  useEffect(() => {
    refetchUser();
  }, [id]);
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const sendRequest = async (id) => {
    try {
      const props = {
        currentUserId: currentUser.id,
        selectedUserId: id,
      };
      const res = await axios.post(`${url}connection-request/`, props);
      if (res.status === 200) {
        return true;
      } else {
        Toast.show("Error sending connection request");
      }
    } catch (err) {
      console.log(err)
      console.log("error sending connection request");
    }
    return false;
  };

  const removeRequest = async (id) => {
    const senderId = currentUser.id;
    const receiverId = id;
    const props = {
      senderId,
      receiverId,
      option: "reject",
    };
    try {
      const res = await axios.post(`${url}connection-request/option`, props);
      if (res.status === 200) {
        return true;
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("An error occurred while removing request");
    }
    return false;
  };

  const [state, setState] = useState(null);
  const [send, setSend] = useState(false);

  useEffect(() => {
    console.log(user?.id, currentUser?.id);
    if (user?.connections?.includes(currentUser?.id)) {
      setState("connected");
    } else if (currentUser?.sentConnectionRequests?.includes(user?.id)) {
      setState("pending");
      setSend(true);
    } else {
      setState("connect");
      setSend(false);
    }
  }, [user, currentUser]);

  const onConnect = async () => {
    if (!send) {
      const res = await sendRequest(user.id);
      if (res) {
        Toast.show("Connection request sent");
        console.log("sent");
        setSend(true);
        setState("pending");
        return true;
      }
    } else {
      const res = await removeRequest(user.id);
      if (res) {
        Toast.show("Connection request removed");
        console.log("removed");
        setSend(false);
        setState("connect");
        return true;
      }
    }
  };

  const { posts } = useUserPostFetch(user.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileImageModelVisible, setProfileImageModelVisible] =
    useState(false);
  const [isBannerModelVisable, setBannerModelVisible] = useState(false);
  const [education, setEducation] = useState("");
  const getActiveEducation = () => {
    if (
      user?.educations &&
      user?.educations.length > 0 &&
      user?.educations[0].length > 0
    ) {
      const activeEducation = user?.educations[0].find(
        (education) => education.isCurrent
      );
      setEducation(activeEducation);
      console.log(activeEducation);
    } else {
      setEducation("");
      return "";
    }
  };
  useEffect(() => {
    getActiveEducation();
  }, [user]);
  const givePost = (posts) => {
    let max = 5;
    return posts.map((item, index) => {
      max--;
      if (max < 0) return null;
      return (
        <UserPostCard
          key={index}
          item={item}
          userId={user.id}
          userName={user.name}
        />
      );
    });
  };
  return (
    <SafeAreaView
      style={{
        paddingTop: 20,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetchUser} />
        }
      >
        <ImageBackground
          source={{
            uri: checkImageURL(user?.banner)
              ? user?.banner
              : "https://i.pinimg.com/originals/c4/5d/c3/c45dc310955cb3f12915f77c90e54a88.jpg",
          }}
          style={{
            height: 200,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={{
                  zIndex: 1,
                }}
                onPress={() => {
                  setIsModalVisible(true);
                }}
              >
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 100,
                    borderWidth: 5,
                    borderColor: "white",
                    resizeMode: "cover",
                    marginTop: 200,
                    marginLeft: 20,
                    zIndex: 1,
                  }}
                  source={{
                    uri: checkImageURL(user?.profileImage)
                      ? user?.profileImage
                      : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            ></View>
          </View>
        </ImageBackground>
        <View
          style={{
            backgroundColor: "#fff",
            height: "100%",
          }}
        >
          <View
            style={{
              marginTop: 100,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "500",
                  paddingLeft: 10,
                }}
              >
                {user?.name}
              </Text>
              <Text>'{user?.pronouns ? "(" + user?.pronouns + ")" : ""}</Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                paddingLeft: 10,
              }}
            >
              {user?.email}
            </Text>
            <Text
              style={{
                paddingVertical: 20,
                fontSize: 20,
                fontWeight: "500",
                paddingLeft: 10,
              }}
            >
              {user?.headline ? user?.headline : "No Description"}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                paddingLeft: 10,
              }}
            >
              {education?.schoolName
                ? education?.schoolName +
                  " " +
                  education?.fieldOfStudy +
                  " " +
                  education?.degree
                : ""}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "300",
                paddingLeft: 10,
                color: "grey",
              }}
            >
              {user?.country
                ? user.country
                : "" + " " + user?.city
                ? user.city
                : ""}
            </Text>
            <View>
              <Text
                style={{
                  color: "#0072b1",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                {user?.connections?.length} connections
              </Text>
            </View>
            {user &&
              currentUser &&
              user.id &&
              currentUser.id &&
              user?.id != currentUser?.id &&
              state && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginVertical: 10,
                  }}
                >
                  {state !== "connected" ? (
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        paddingHorizontal: 10,
                        gap: 5,
                        borderColor: !send ? "#0072b1" : "grey",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        borderWidth: 1,
                        width : Dimensions.get("window").width -40
                      }}
                      onPress={() => {
                        onConnect();
                      }}
                    >
                      {!send && (
                        <AntDesign name="plus" size={24} color="#0072b1" />
                      )}
                      <Text
                        style={{
                          color: send ? "grey" : "#0072b1",
                          fontWeight: "bold",
                        }}
                      >
                        {state}
                      </Text>
                    </TouchableOpacity>
                  ) :<TouchableOpacity
                  onPress={()=>{
                    router.push("/(drawer)/peopleList")
                  }}
                    style={{
                      padding: 10,
                      backgroundColor: "#0072b1",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 40,
                      marginHorizontal: 10,
                      width : Dimensions.get("window").width -40
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      Message
                    </Text>
                  </TouchableOpacity>}

                  
                </View>
              )}
            <View
              style={{
                height: 8,
                backgroundColor: "#f4f4f4",
              }}
            />
          </View>
          <View>
            <Text
              style={{
                paddingVertical: 20,
                fontSize: 20,
                fontWeight: "600",
                paddingLeft: 10,
              }}
            >
              Resources
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: "#f4f4f4",
                marginHorizontal: 10,
              }}
            />
            <TouchableOpacity
              style={{
                paddingVertical: 20,
                paddingLeft: 10,
                flexDirection: "row",
                gap: 20,
              }}
            >
              <MaterialIcons name="local-activity" size={24} color="black" />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                  }}
                >
                  Activity
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  see what you've shared with your, such as posts, articles, and
                  more
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: "#f4f4f4",
            }}
          />
          <View
            style={{
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 20,
                  fontWeight: "600",
                }}
              >
                About
              </Text>
            </View>
            <Text
              style={{
                paddingVertical: 10,
                fontSize: 15,
                fontWeight: "300",
                paddingHorizontal: 10,
              }}
            >
              {user?.userDescription
                ? user?.userDescription
                : "user has not added any description yet."}
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: "#f4f4f4",
            }}
          />
          <View>
            <Text
              style={{
                paddingVertical: 20,
                fontSize: 20,
                fontWeight: "600",
                paddingLeft: 10,
              }}
            >
              Activity
            </Text>
            <View>
              <View>
                {givePost(posts)}
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/profile/activity/${id}`);
                  }}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                    }}
                  >
                    Show all activity
                  </Text>
                  <Feather name="arrow-right" size={24} color="grey" />
                </TouchableOpacity>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "#f4f4f4",
                  }}
                />
              </View>
            </View>
          </View>
          <ProfilePhotoModel
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            setProfileImageModelVisible={setProfileImageModelVisible}
            setBannerImageModelVisible={setBannerModelVisible}
          />
          <ProfileImageModel
            isProfileImageModelVisible={isProfileImageModelVisible}
            setProfileImageModelVisible={setProfileImageModelVisible}
            user={user}
          />
          <ProfileBannerModel
            isProfileBannerModelVisible={isBannerModelVisable}
            setProfileBannerModelVisible={setBannerModelVisible}
            user={user}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Id;

const styles = StyleSheet.create({});
