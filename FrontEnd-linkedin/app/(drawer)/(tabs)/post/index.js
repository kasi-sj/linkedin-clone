import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Toast from 'react-native-simple-toast';

import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { decode } from "base-64";
global.atob = decode;
import axios from "axios";
import { KeyboardAvoidingView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../../../firebase";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { checkImageURL } from "../../../../utills";
import useUserFetch from "../../../../hooks/useUserFetch";
import useSoundHook from "../../../../hooks/useSoundHook";



const RenderMedia = ({ image }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  if (!image) return null;
  const isVideo = image.endsWith(".mp4");
  console.log(isVideo);
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
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
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

const index = () => {
  const {post} = useSoundHook();
  const {user} = useUserFetch();
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!image && !description) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [image, description]);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditiong: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      const imageSize = (result?.assets[0]?.filesize/(1024 * 1024));
      if(imageSize > 2){
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

  const onPost = async () => {
    const fileurl = await uploadFile();
    let isVideo = "";
    try {
      setIsPosting(true);
      isVideo = (image||"").endsWith(".mp4");
      if (fileurl == -1) {
        Toast.show( "Error uploading file");
        return;
      }
      console.log(url);
      const props = {
        userId: user?.id,
        description: description,
        image: fileurl || "",
        mimiType: isVideo ? "video" : "image",
      };
      const res = await axios.post(`${url}createPost`, props);

      console.log(res);
      if (res.status === 200) {
        post();
        Toast.show("post created successfully");
        setDescription("");
        setImage(null);
        router.canGoBack() && router.back();
      }
    } catch (err) {
      console.log("error posting", err.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white", paddingVertical: 30 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginTop : 20
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={()=>{
            router.canGoBack() && router.back();
          }}>
            <AntDesign name="close" size={30} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{
                uri: checkImageURL(user?.profileImage)
                  ? user.profileImage
                  : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
              }}
            />
            <Text style={{ fontWeight: "500" }}>Anyone</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginRight: 8,
          }}
        >
          <MaterialIcons name="access-time" size={24} color="black" />
          <TouchableOpacity
            disabled={isPosting || disabled}
            onPress={() => {
              onPost();
            }}
            style={{
              paddingHorizontal : 10,
              paddingVertical : 5,
              backgroundColor: disabled ? "grey" : "#0072b1",
              borderRadius: 20,
            }}
          >
            {isPosting ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
      <View>
        <RenderMedia image={image} />
      </View>
      <KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            flexDirection: "coloumn",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
            style={{
              width: 70,
              height: 70,
              marginTop: 15,
              backgroundColor: "#E0E0E0",
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <MaterialIcons name="perm-media" size={24} color="black" />
            <Text>Media</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
export default index;

const styles = StyleSheet.create({});
