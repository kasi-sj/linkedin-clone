import React from "react";
import { View, Text, Dimensions } from "react-native";

const Date = ({date}) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 5,
          alignItems: "center",
          marginVertical: 5,
          width : Dimensions.width
        }}
      >
        <View
          style={{
            backgroundColor: "lightgray",
            height: 1,
            width: "35%",
          }}
        />
        <Text >
          {date}
        </Text>
        <View
          style={{
            backgroundColor: "lightgray",
            height: 1,
            width: "35%",
          }}
        />
      </View>
    );
  };
  export default Date ;