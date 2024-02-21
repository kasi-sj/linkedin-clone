import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
  BackHandler,
} from "react-native";
import useUserFetch from "../../hooks/useUserFetch";
import useSearchUserFetch from "../../hooks/useSearchUserFetch";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { checkImageURL } from "../../utills";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, usePathname } from "expo-router";
import { FontAwesome,AntDesign } from "@expo/vector-icons";
import { recommendedSearch } from "../../data";

const SearchPeople = () => {
  const [remommendedState, setRecommendedState] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserFetch();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    let count = 20;
    let recommended = [];
    for (let i = 0; i < recommendedSearch.length; i++) {
      if (recommendedSearch[i].includes(searchQuery)) {
        recommended.push(recommendedSearch[i]);
        count--;
      }
      if (count === 0) {
        break;
      }
    }
    setRecommendedState(recommended);
  }, [searchQuery]);

  useEffect(() => {
    console.log("pathname", pathname);
    inputRef.current.focus();
    inputRef.current.focus();
  }, [pathname]);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 40,
          borderBottomWidth: 1,
          borderBottomColor: "#e3e3e3",
        }}
      >
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
              paddingHorizontal: 10,
            }}
            source={{
              uri: checkImageURL(user?.profileImage)
                ? user?.profileImage
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
            }}
          />
        </TouchableOpacity>
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
            marginHorizontal: 10,
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
            ref={inputRef}
            placeholder="Search"
            style={{
              flex: 1,
              height: 40,
            }}
            onChangeText={(text) => {
              setSearchQuery(text);
            }}
            value={searchQuery}
          />
          {searchQuery && (
            <TouchableOpacity
              style={{
                marginRight: 10,
              }}
              onPress={() => {
                setSearchQuery("");
                router.push(`searchPeopleByKeyword/${searchQuery}`);
              }}
            >
              <AntDesign name="arrowright" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={{}}>
        {remommendedState.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
              onPress={() => {
                router.push(`searchPeopleByKeyword/${item}`);
              }}
            >
              <FontAwesome name="search" size={15} style={{
                padding:10
              }} color="grey" />
              <Text>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SearchPeople;
