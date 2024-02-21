import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { skills as oldAvailableSkills } from "../data";

const CheckBox = ({ data, skills, addSkill, removeSkill }) => {
  const [isChecked, setIsChecked] = useState(skills.includes(data));
  return (
    <Pressable
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
        borderBottomColor: "lightgray",
        borderBottomWidth: 1,
        height: 70,
      }}
      onPress={() => {
        if (isChecked) {
          removeSkill(data);
        } else {
          addSkill(data);
        }
        setIsChecked(!isChecked);
      }}
      >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "300",
        }}
        >
        {data}
      </Text>
      {!isChecked ? (
        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
        ) : (
          <AntDesign name="checksquare" size={24} color="black" />
          )}
    </Pressable>
  );
};
const RenderSkills = ({ showSkills, setShowSkills, skills, setSkills }) => {
  const set1 = new Set(skills);
  const [sameSkills, setSameSkills] = useState(true);
  const availableSkills = [...new Set(oldAvailableSkills)];
  const [currentSkills, setCurrentSkills] = useState(
    availableSkills.slice(0, 30)
    );
  const [selectedSkills, setSelectedSkills] = useState([...skills]);
  const set2 = new Set(selectedSkills);
  const onSearchChange = (data) => {
      // only top 30 skills
      const newSkills = [];
      let count = 0;
      for (let i = 0; i < availableSkills.length; i++) {
        if (availableSkills[i].toLowerCase().includes(data.toLowerCase())) {
          newSkills.push(availableSkills[i]);
          count++;
        }
        if (count === 30) break;
      }
      setCurrentSkills(newSkills);
  };
  const addSkill = (data) => {
    setSelectedSkills([...selectedSkills, data]);
    set2.add(data);
    if (set1.size === set2.size) {
      for (let item of set1) {
        if (!set2.has(item)) {
          setSameSkills(false);
          return;
        }
      }
      setSameSkills(true);
    } else {
      setSameSkills(false);
    }
  };
  const removeSkill = (data) => {
    setSelectedSkills([...selectedSkills.filter((skill) => skill !== data)]);
    set2.delete(data);
    if (set1.size === set2.size) {
      for (let item of set1) {
        if (!set2.has(item)) {
          setSameSkills(false);
          return;
        }
      }
      setSameSkills(true);
    } else {
      setSameSkills(false);
    }
  };
  const done = () => {
    setSkills(selectedSkills);
    setShowSkills(false);
  };
  const [search, setSearch] = useState("");
  return (
    <Modal visible={showSkills} animationType="slide">
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setShowSkills(false);
              }}
            >
              <Ionicons
                style={{
                  paddingLeft: 10,
                }}
                name="arrow-back"
                size={28}
                color="gray"
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 10,
                marginHorizontal: 20,
              }}
            >
              Skills
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={sameSkills}
            onPress={done}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: !sameSkills ? "#0072b1" : "gray",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            padding: 10,
            fontSize: 15,
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
        >
          {selectedSkills.map((item, index) => {
            return (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setSelectedSkills(
                    selectedSkills.filter((skill) => skill !== item)
                  );
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    borderRadius: 50,
                    backgroundColor: "green",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "300",
                      color: "white",
                    }}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <TextInput
            value={search}
            onChangeText={(data) => {
              setSearch(data);
              onSearchChange(data);
            }}
            placeholder="Skill (ex: Project Management)"
          />
        </View>
        <ScrollView>
          {currentSkills.map((item, index) => {
            return (
              <CheckBox
                skills={selectedSkills}
                key={item}
                data={item}
                addSkill={addSkill}
                removeSkill={removeSkill}
              />
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default RenderSkills;
