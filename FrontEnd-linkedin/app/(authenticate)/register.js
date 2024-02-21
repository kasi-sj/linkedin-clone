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
  ActivityIndicator,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { useEffect } from "react";
import { validateEmail, validatePassword } from "../../utills";
import Toast from "react-native-simple-toast";
import axios from "axios";

const index = () => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conPassErr, setConPassErr] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConPassword, setShowConPassword] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!emailErr && !passErr && !nameErr && email && password && name) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailErr, passErr, nameErr, email, password, name]);

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

  useEffect(() => {
    if (confirmpassword) {
      if (confirmpassword === password) {
        setConPassErr("");
      } else {
        setConPassErr("Passwords do not match");
      }
    } else {
      setConPassErr("");
    }
  }, [confirmpassword]);

  useEffect(() => {
    if (name) {
      if (name.length > 3) {
        setNameErr("");
      } else {
        setNameErr("Name must be at least 3 characters");
      }
    } else {
      setNameErr("");
    }
  }, [name]);
  const handleRegister = async () => {
    if (password !== confirmpassword) {
      Toast.show("Passwords do not match");
      return;
    }
    if (disabled) {
      Toast.show("Plese enter valid details");
      return;
    }
    try {
      setIsLoading(true);
      const user = { name, email, password };
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}register`,
        user
      );
      if (response.status === 200) {
        console.log(response.data);
        Toast.show("Kindly check your mail for the verification", Toast.LONG);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        router.replace("/login");
      } else if (response.status === 400) {
        Toast.show("Registration failed");
      }
    } catch (err) {
      console.log(err);
      Toast.show("something went wrong while registering user");
      console.log("Error Occured while registering user");
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
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
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
            Create a new Account
          </Text>
        </View>
        <View style={{ marginTop: 100, width: 350 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              padding: 5,
              borderRadius: 5,
              marginTop: 5,
            }}
          >
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 18,
              }}
              placeholder="enter your name"
            />
          </View>
          {nameErr ? (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginBottom: 5,
                width: 300,
              }}
            >
              {nameErr}
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
              name="lock"
              size={24}
              color="gray"
            />
            <TextInput
              value={confirmpassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 260,
                fontSize: 18,
              }}
              placeholder="enter your password again"
              secureTextEntry={showConPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setShowConPassword(!showConPassword);
              }}
            >
              <Ionicons
                name={!showConPassword ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        {conPassErr ? (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginBottom: 5,
              width: 300,
            }}
          >
            {conPassErr}
          </Text>
        ) : null}
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
            marginTop: 40,
          }}
        />
        <TouchableOpacity
          disabled={isLoading}
          style={{
            width: 200,
            backgroundColor: "#0072b1",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
          onPress={handleRegister}
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
              Register
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 30,
          }}
          onPress={() => router.replace("/login")}
        >
          <Text
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: 16,
            }}
          >
            Already have an account?{" "}
            <Text style={{ color: "#0072b1" }}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

export default index;

const styles = StyleSheet.create({});
