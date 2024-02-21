import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
} from "react-native";
import { RadioButton } from "react-native-paper";


export default  RenderEducationModal = ({
    isModalVisible,
    setIsModalVisible,
    setEducation,
    education,
    availableEducation,
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
                Education
              </Text>
              <RadioButton.Group
                onValueChange={(value) => {
                  setEducation(value);
                  setIsModalVisible(false);
                }}
                value={education}
              >
                {availableEducation.map((item, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        setEducation(item);
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
                        {item.school +" "+ item.degree +" "+ item.fieldOfStudy}
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