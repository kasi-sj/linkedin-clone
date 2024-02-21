 import React, { useState } from "react";
import { View, Text, Modal, Pressable, TextInput, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { industries } from "../data"
export default  RenderIndustryModal = ({
  isIndustryModelVisable,
  setIsIndustryModelVisable,
  industry,
  setIndustry,
}) => {
  const [searchResult, setSearchResult] = useState([...industries]);
  const [search, setSearch] = useState(industry || "");
  const onSearchChange = (data) => {
    setSearch(data);
    const result = industries.filter((item) => {
      return item.toLowerCase().includes(data.toLowerCase());
    });
    setSearchResult(result);
  };
  return (
    <Modal visible={isIndustryModelVisable} animationType="slide">
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: 10,
            shadowColor: "black",
            gap: 10,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
            shadowColor: "black",
            backgroundColor: "white",
            height: 70,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={()=>setIsIndustryModelVisable(false)}
          >
            <Ionicons name="arrow-back" size={35} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginVertical: 10,
              marginHorizontal: 20,
            }}
          >
            Industry
          </Text>
        </View>
        <TextInput
          value={search}
          onChangeText={(data) => {
            setSearch(data);
            onSearchChange(data);
          }}
          placeholder="Ex: Retail"
          style={{
            padding: 10,
            fontSize: 15,
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
            height: 40,
          }}
        />
        <ScrollView>
          {searchResult.map((item, index) => {
            return (
              <Pressable
                key={index}
                style={{
                  padding: 10,
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  height: 70,
                }}
                onPress={() => {
                  setIndustry(item);
                  setIsIndustryModelVisable(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};