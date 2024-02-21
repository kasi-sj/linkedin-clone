import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import UsePushNotification from "../hooks/usePushNotification";


const index = () => {
  UsePushNotification();
  const router = useRouter();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log(token);
        if (!token) {
          router.replace("/login");
        } else {
          router.replace("/(drawer)/(tabs)/home");
        }
      } catch (e) {
        console.log(e);
      }
    };
    checkLogin();
  }, []);
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        style={{
          width: "50%",
          height: "20%",
          zIndex: -1,
          marginBottom: 20,
        }}
        source={require("../assets/images/home.jpg")}
      />
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
