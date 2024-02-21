import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { validateEmail, validatePassword } from "../../utills";
import { ActivityIndicator } from "react-native";
import Toast from 'react-native-simple-toast';


const index = () => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!emailErr && !passErr && email && password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailErr, passErr, email, password]);

  useEffect(() => {
    if (email) {
      if (validateEmail(email)) {
        setEmailErr("");
      } else {
        setEmailErr("Invalid email format");
      }
    } else {
      setEmailErr("");
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      if (validatePassword(password)) {
        setPassErr("");
      } else {
        setPassErr(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
        );
      }
    } else {
      setPassErr("");
    }
  }, [password]);

  const handleLogin = async () => {
    if (disabled) {
      Toast.show("Plese enter valid details");
      return;
    }
    try {
      setIsLoading(true);
      const user = {
        email,
        password,
      };
      const response = await axios.post(`${url}login`, user);
      if (response.status == 200) {
        if(response.data.message == "user does not exist"){
          Toast.show("user does not exist");
          return;
        }else if(response.data.message == "invalid credentials"){
          Toast.show("invalid credentials");
          return;
        }else if(response.data.message == "user not verified"){
          Toast.show("user not verified");
          return;
        }else if(response.data.message == "login successful"){
          const token = response.data.token;
          AsyncStorage.setItem("authToken", token);
          router.push("/(tabs)/home");
        }
        console.log(response.data);
      }else{
        Toast.show("something went wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: 50,
      }}
    >
      <View>
        <Image
          style={{
            width: 150,
            height: 100,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png",
          }}
        />
      </View>
      <View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Log in to Your Accont
          </Text>
        </View>
        <View
          style={{
            marginTop: 70,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              padding: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 18,
              }}
              placeholder="enter your Email"
            />
          </View>
          {emailErr ? (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginBottom: 5,
                width: 300,
              }}
            >
              {emailErr}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              padding: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="gray"
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 260,
                fontSize: 18,
              }}
              placeholder="enter your Password"
              secureTextEntry={showPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            >
              <Ionicons
                name={!showPassword ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {passErr ? (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginBottom: 5,
                width: 300,
              }}
            >
              {passErr}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <TouchableOpacity>
            <Text>Keep me logged in</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                color: "#0072b1",
                fontWeight: "500",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            marginTop: 80,
          }}
        />
        <TouchableOpacity
          style={{
            width: 200,
            backgroundColor: "#0072b1",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator size="small" color="white" />}
          {!isLoading && (
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 50,
          }}
          onPress={() => router.replace("/register")}
        >
          <Text
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: 16,
            }}
          >
            Don't have an account?
            <Text
              style={{
                color: "#0072b1",
              }}
            >
              Register
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default index;

const styles = StyleSheet.create({});
