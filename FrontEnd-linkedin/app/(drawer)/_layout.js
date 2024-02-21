import { Drawer } from "expo-router/drawer";
import {
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname, useRouter } from "expo-router";
import useUserFetch from "../../hooks/useUserFetch";
import { checkImageURL } from "../../utills";
import { connect } from "react-redux";
import { Search } from "../../context/actions/searchAction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawerContent = ({ user, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        style={{
          marginBottom: 20,
        }}
        onPress={() => {
          router.push("(drawer)/profile");
        }}
      >
        <Image
          style={{
            width: 70,
            height: 70,
            resizeMode: "cover",
            borderRadius: 40,
            marginHorizontal: 20,
            marginVertical: 30,
          }}
          source={{
            uri: checkImageURL(user?.profileImage)
              ? user?.profileImage
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginHorizontal: 20,
            }}
          >
            {user?.name || "no name"}
          </Text>
          <Text
            style={{
              marginHorizontal: 20,
              color: "#808080",
            }}
          >
            View profile
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            height: 1,
            backgroundColor: "lightgrey",
            width: "100%",
          }}
        />
      </TouchableOpacity>
      <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="home" size={24} color="black" />;
        }}
        label="View profile"
        onPress={() => {
          router.push("(drawer)/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="people" size={24} color="black" />;
        }}
        label="Manage your network"
        onPress={() => {
          router.push("(drawer)/(tabs)/network");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="briefcase" size={24} color="black" />;
        }}
        label="Job postings"
        onPress={() => {
          router.push("(drawer)/(tabs)/jobs");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="chatbox" size={24} color="black" />;
        }}
        label="Messaging"
        onPress={() => {
          router.push("(drawer)/peopleList");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="notifications" size={24} color="black" />;
        }}
        label="Notifications"
        onPress={() => {
          router.push("(drawer)/(tabs)/notification");
        }}
      />
      {/* <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="settings" size={24} color="black" />;
        }}
        label="Settings"
        onPress={() => {}}
      /> */}
      <DrawerItem
        icon={({ color, size }) => {
          return <Ionicons name="log-out" size={24} color="black" />;
        }}
        label="Logout"
        onPress={async () => {
          const res = await AsyncStorage.removeItem("authToken");
          router.replace("(authenticate)/login");
        }}
      />
    </DrawerContentScrollView>
  );
};

const Layout = ({ search, Search }) => {
  const router = useRouter();
  const { user } = useUserFetch();
  const pathname = usePathname();
  const [headerVisable, setHeaderVisable] = useState(true);
  const [button, setButton] = useState(false);
  const userSearchPaths = [
    "/home",
    "/network",
    "/notification",
    "/network/invitations",
  ];
  useEffect(() => {
    if (
      userSearchPaths.includes(pathname) ||
      pathname.includes("searchPeopleByKeyword") ||
      pathname.includes("/peopleList/chatRoom/")
    ) {
      setButton(true);
    } else {
      setButton(false);
    }
  }, [pathname]);

  useEffect(() => {
    console.log(pathname);
    if (!pathname.includes("/searchPeopleByKeyword")) Search("");
  }, [pathname]);

  useEffect(() => {
    console.log(pathname);
    if (pathname === "/post" || pathname === "/network/invitations") {
      setHeaderVisable(false);
    } else {
      setHeaderVisable(true);
    }
    console.log(headerVisable);
  }, [pathname]);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
      screenOptions={({ navigation }) => {
        return {
          headerShown: headerVisable,
          headerStyle: {
            backgroundColor: "#fff",
            height: 90,
          },
          headerBackground: () => {
            return (
              <Image
                style={{
                  width: "40",
                  height: "40",
                  resizeMode: "cover",
                }}
                source={{
                  uri: "https://images.unsplash.com/photo-1621574533567-3a5d6a1d1f4b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2VhJTIwc2VhcnMlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
                }}
              />
            );
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    resizeMode: "cover",
                    marginTop: -5,
                    marginLeft: 10,
                  }}
                  source={{
                    uri: checkImageURL(user?.profileImage)
                      ? user?.profileImage
                      : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                  }}
                />
              </TouchableOpacity>
            );
          },
          headerTitle: () => {
            if (button) {
              return (
                <Pressable
                  onPress={() => {
                    router.push("searchPeople");
                  }}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    height: 40,
                    marginBottom: 10,
                    // marginTop: -25,
                    width: Dimensions.get("window").width - 125,
                  }}
                >
                  <Ionicons
                    style={{ marginLeft: 10 }}
                    name="search"
                    size={20}
                    color="black"
                  />
                  <View>
                    <Text
                      style={{
                        color: "lightgrey",
                      }}
                    >
                      {search.search ? search.search : "Search"}
                    </Text>
                  </View>
                </Pressable>
              );
            }
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  height: 40,
                  marginBottom: 10,
                  // marginTop: -25,
                  width: Dimensions.get("window").width - 125,
                }}
              >
                <Ionicons
                  style={{ marginLeft: 10 }}
                  name="search"
                  size={20}
                  color="black"
                />
                <TextInput
                  placeholder="Search"
                  style={{
                    height: 40,
                  }}
                  onChangeText={(text) => {
                    Search(text);
                  }}
                  value={search.search}
                />
              </View>
            );
          },
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{
                  marginBottom: 10,
                  paddingRight: 10,
                  // marginTop: -20,
                }}
                onPress={() => {
                  router.push("(drawer)/peopleList");
                }}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            );
          },
        };
      }}
    >
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen name="peopleList" />
      <Drawer.Screen
        name="searchPeople"
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen name="searchPeopleByKeyword" />
      <Drawer.Screen
        name="editProfile"
        options={{
          headerShown: false,
        }}
      />
    </Drawer>
  );
};

const mapStateToProps = (state) => ({
  search: state.search,
});

const mapDispatchToProps = {
  Search,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
