import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  SafeAreaView,
  Button,
} from "react-native";
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
import Toast from 'react-native-simple-toast';
import useUserPostFetch from "../../../hooks/useUserPostFetch";
import moment from "moment";
import axios from "axios";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { BackHandler } from "react-native";
import { RefreshControl } from "react-native";
import { TextInput } from "react-native";
import { ActivityIndicator } from "react-native";

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
                Banner Image
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const EditAboutModel = ({
  isModalVisible,
  setIsModalVisible,
  updateAbout,
  about,
}) => {
  const [description, setDescription] = useState(about);
  const [updating, setUpdating] = useState(false);
  const onSave = async () => {
    setUpdating(true);
    const result = await updateAbout(description);
    if (result) {
      Toast.show("about updated succesfully");
    } else {
      Toast.show("something went wrong please try again later");
    }
    setIsModalVisible(false);
    setUpdating(false);
  };
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
            minHeight: "25%",
            maxHeight: "50%",
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            paddingTop: 20,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                }}
              >
                Tell us about yourself
              </Text>
              <TouchableOpacity
                onPress={onSave}
                disabled={!description}
                style={{
                  borderRadius: 20,
                  backgroundColor: description ? "#0072b1" : "grey",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 15,
                    }}
                  >
                    save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              value={description}
              onChangeText={(text) => setDescription(text)}
              placeholder="What do you want to talk about"
              placeholderTextColor={"black"}
              style={{
                marginHorizontal: 10,
                fontSize: 15,
                fontWeight: "500",
                marginTop: 10,
              }}
              multiline={true}
              numberOfLines={10}
              textAlignVertical={"top"}
            />
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
  updateProfileImage,
}) => {
  const [isPosting, setIsPosting] = useState(false);
  const [image, setImage] = useState(null);
  useEffect(() => {
    setImage(user?.profileImage);
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditiong: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      const imageSize = result?.assets[0]?.filesize / (1024 * 1024);
      if (imageSize > 2) {
        Toast.show("size should be less the 2 MB");
        return;
      }
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const uploadFile = async () => {
    try {
      setIsPosting(true);
      console.log("Image URI:", image);
      if (!image) return null;

      const { uri } = await FileSystem.getInfoAsync(image);
      if (!uri) {
        throw new Error("Invalid file URI");
      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);

      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);

      const downloadURL = await ref.getDownloadURL();
      setIsPosting(false);
      return downloadURL;
    } catch (error) {
      console.log("Error:", error);
      return -1;
    } finally {
      setIsPosting(false);
    }
  };

  const onSave = async () => {
    try {
      if (image == null || image == user?.profileImage) {
        setProfileImageModelVisible(false);
        return;
      }
      setIsPosting(true);
      let fileurl;
      if (
        image ==
        "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
      )
        fileurl = image;
      else fileurl = await uploadFile();
      console.log(fileurl);
      const isuploaded = await updateProfileImage(fileurl);
      if (isuploaded) {
        Toast.show("updated succesfully");
        setIsPosting(false);
        setProfileImageModelVisible(false);
      } else {
        setIsPosting(false);
        setProfileImageModelVisible(false);
      }
    } catch (err) {
      console.log("error updating ProfileImage", err, message);
      Toast.show("Error updating profile");
    } finally {
      setIsPosting(false);
    }
  };

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
          <TouchableOpacity disabled={isPosting} onPress={onSave}>
            {isPosting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  color: "white",
                }}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 20,
            backgroundColor: "black",
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="camera" size={24} color="white" />
            <Text
              style={{
                color: "white",
              }}
            >
              Add Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setImage(
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              );
            }}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="camera" size={24} color="white" />
            <Text
              style={{
                color: "white",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ProfileBannerModel = ({
  isProfileBannerModelVisible,
  setProfileBannerModelVisible,
  user,
  updateBannerImage,
}) => {
  const [isPosting, setIsPosting] = useState(false);
  const [image, setImage] = useState(null);
  useEffect(() => {
    setImage(user?.banner);
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditiong: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      const imageSize = result?.assets[0]?.filesize / (1024 * 1024);
      if (imageSize > 2) {
        Toast.show("size should be less the 2 MB");
        return;
      }
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const uploadFile = async () => {
    try {
      setIsPosting(true);
      console.log("Image URI:", image);
      if (!image) return null;

      const { uri } = await FileSystem.getInfoAsync(image);
      if (!uri) {
        throw new Error("Invalid file URI");
      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);

      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);

      const downloadURL = await ref.getDownloadURL();
      setIsPosting(false);
      return downloadURL;
    } catch (error) {
      console.log("Error:", error);
      return -1;
    } finally {
      setIsPosting(false);
    }
  };

  const onSave = async () => {
    try {
      if (image == null || image == user?.banner) {
        setProfileBannerModelVisible(false);
        return;
      }
      setIsPosting(true);
      let fileurl;
      if (
        image ==
        "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
      )
        fileurl = image;
      else fileurl = await uploadFile();
      console.log(fileurl);
      const isuploaded = updateBannerImage(fileurl);
      if (isuploaded) {
        Toast.show("updated succesfully");
        setIsPosting(false);
        setProfileBannerModelVisible(false);
      } else {
        setIsPosting(false);
        setProfileBannerModelVisible(false);
      }
    } catch (err) {
      console.log("error updating ProfileImage", err, message);
      Toast.show("Error updating profile");
    } finally {
      setIsPosting(false);
    }
  };

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
          <TouchableOpacity onPress={onSave}>
            {isPosting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  color: "white",
                }}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 20,
            backgroundColor: "black",
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="camera" size={24} color="white" />
            <Text
              style={{
                color: "white",
              }}
            >
              Add Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setImage(
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              );
            }}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="camera" size={24} color="white" />
            <Text
              style={{
                color: "white",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const RenderMedia = ({ image, mimiType }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  useEffect(() => {
    video?.current?.playAsync();
  }, []);
  if (!image) return null;
  const isVideo = mimiType == "video";
  if (isVideo) {
    return (
      <View style={{ width: "30%", height: 100, padding: 10, margin: 10 }}>
        <Video
          ref={video}
          style={{ width: "30%", height: 100, padding: 10, margin: 10 }}
          source={{
            uri: image,
          }}
          isMuted={true}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </View>
    );
  } else {
    return (
      <Image
        source={{ uri: image }}
        style={{ width: "30%", height: 100, padding: 10, margin: 10 }}
      />
    );
  }
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
        <RenderMedia image={item?.imageUrl} mimiType={item?.mimiType} />
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

const Profile = () => {
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
  const {
    user,
    updateBannerImage,
    loading,
    refetchUser,
    updateProfileImage,
    getFullUser,
    updateAbout,
  } = useUserFetch();
  useEffect(() => {
    getFullUser();
  }, [user.id]);
  const { posts } = useUserPostFetch(user.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileImageModelVisible, setProfileImageModelVisible] =
    useState(false);
  const [isBannerModelVisable, setBannerModelVisible] = useState(false);
  const [editAboutModel, setEditAboutModel] = useState(false);
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
            >
              <TouchableOpacity
                style={{
                  marginBottom: -40,
                  marginRight: 10,
                  zIndex: 1,
                }}
                onPress={() => {
                  router.push("editProfile");
                }}
              >
                <Feather name="edit-2" size={24} color="black" />
              </TouchableOpacity>
            </View>
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
              {user?.country + " " + user?.city}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.navigate("network/invitations");
              }}
            >
              <Text
                style={{
                  color: "#0072b1",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                {user?.connections?.length} connections
              </Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => {
                router.navigate("network");
              }}
              style={{
                paddingVertical: 20,
                paddingLeft: 10,
                flexDirection: "row",
                gap: 20,
              }}
            >
              <Ionicons name="people-sharp" size={24} color="black" />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                  }}
                >
                  My Network
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  see and manage your connections and intrests
                </Text>
              </View>
            </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => {
                  console.log("clicked");
                  router.push(`/profile/activity/${user?.id}`);
                }}
              >
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
              </TouchableOpacity>
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
              <TouchableOpacity
                onPress={() => {
                  setEditAboutModel(true);
                }}
              >
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
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
                : "Add a description to your profile to help people understand your intrests and background."}
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
                    console.log("clicked");
                    router.push(`/profile/activity/${user?.id}`);
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
            updateProfileImage={updateProfileImage}
          />
          <ProfileBannerModel
            isProfileBannerModelVisible={isBannerModelVisable}
            setProfileBannerModelVisible={setBannerModelVisible}
            user={user}
            updateBannerImage={updateBannerImage}
          />
          <EditAboutModel
            isModalVisible={editAboutModel}
            setIsModalVisible={setEditAboutModel}
            updateAbout={updateAbout}
            about={user?.userDescription}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
