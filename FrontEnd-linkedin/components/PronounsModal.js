import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { RadioButton } from "react-native-paper";

const gender = ["Please select", "He/Him", "She/Her", "They/Them", "Others"];
export default RenderPronounsModal = ({
  isModalVisible,
  setIsModalVisible,
  setPronouns,
  pronouns,
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
            height: "50%",
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            paddingTop: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                margin: 20,
              }}
            >
              Pronouns
            </Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setPronouns(value);
                setIsModalVisible(false);
              }}
              value={pronouns}
            >
              {gender.map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      setPronouns(item);
                      setIsModalVisible(false);
                    }}
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "300",
                        color: "grey",
                      }}
                    >
                      {item}
                    </Text>
                    <RadioButton value={item} />
                  </Pressable>
                );
              })}
            </RadioButton.Group>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
