import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import DatePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import RenderSkills from "./skillsModal";

const RenderEducationModal = ({
    isEducationModalVisible,
    education,
    setEducation,
    setIsEducationModalVisible,
  }) => {
    const [school, setSchool] = useState("");
    const [degree, setDegree] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [grade, setGrade] = useState("");
    const [activities, setActivities] = useState("");
    const [description, setDescription] = useState("");
    const [showSkills, setShowSkills] = useState(false);
    const [skills, setSkills] = useState([]);
    const [schoolError, setSchoolError] = useState("");
    const [startDateError, setStartDateError] = useState("");
    const [endDateError, setEndDateError] = useState("");
    useEffect(() => {
      console.log(schoolError, startDateError, endDateError);
      if (school === "") {
        setSchoolError("School is required");
      }else{
        setSchoolError("");
      }
      if (startDate === "") {
        setStartDateError("Start date is required");
      }else{
        setStartDateError("");
      }
      if (endDate === "") {
        setEndDateError("End date is required");
        return;
      }else{
        setEndDateError("");
      }
    }, [school, startDate, endDate]);

    const onSave = () => {
      if (school === "") {
        setSchoolError("School is required");
        return;
      }else{
        setSchoolError("");
      }
      if (startDate === "") {
        setStartDateError("Start date is required");
        return;
      }else{
        setStartDateError("");
      }
      if (endDate === "") {
        setEndDateError("End date is required");
        return;
      }else{
        setEndDateError("");
      }
      for(let i = 0; i < education.length; i++){
        if(education[i].school === school){
          setSchoolError("School already exists");
          return;
        }
      }
      setEducation([
        ...education,
        {
          school,
          degree,
          fieldOfStudy,
          startDate,
          endDate,
          grade,
          activities,
          description,
          skills,
        },
      ]);
      setSchoolError("");
      setSchool("");
      setDegree("");
      setFieldOfStudy("");
      setStartDate("");
      setEndDate("");
      setGrade("");
      setActivities("");
      setDescription("");
      setSkills([]);
      setIsEducationModalVisible(false);
    };
    return (
      <Modal visible={isEducationModalVisible} animationType="slide">
        <TouchableOpacity
          style={{
            padding: 25,
          }}
          onPress={() => {
            setSchoolError(false);
            setSchool("");
            setDegree("");
            setFieldOfStudy("");
            setStartDate("");
            setEndDate("");
            setGrade("");
            setActivities("");
            setDescription("");
            setSkills([]);
            setIsEducationModalVisible(false);
          }}
        >
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 10,
                marginHorizontal: 20,
              }}
            >
              Add Education
            </Text>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "300",
              margin: 20,
            }}
          >
            * indicate required
          </Text>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              School*
            </Text>
            <TextInput
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginHorizontal: 10,
              }}
              value={school}
              onChangeText={(data) => {
                setSchool(data);
              }}
            />
            {schoolError!="" && (
              <Text
                style={{
                  color: "red",
                  marginHorizontal: 10,
                }}
              >
                {schoolError}
              </Text>
            )}
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Degree
            </Text>
            <TextInput
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginHorizontal: 10,
              }}
              value={degree}
              onChangeText={(data) => {
                setDegree(data);
              }}
            />
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Field of study
            </Text>
            <TextInput
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginHorizontal: 10,
              }}
              value={fieldOfStudy}
              onChangeText={(data) => {
                setFieldOfStudy(data);
              }}
            />
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Start Date*
            </Text>
            <TouchableOpacity onPress={() => setShowStartDate(true)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    paddingTop: 20,
                    paddingBottom: 5,
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  {startDate ? startDate.toDateString() : "Please select"}
                </Text>
                <MaterialIcons name="date-range" size={24} color="black" />
              </View>
              {
                startDateError!="" && (
                  <Text
                    style={{
                      color: "red",
                      marginHorizontal: 10,
                    }}
                  >
                    {startDateError}
                  </Text>
                )
              }
              {showStartDate && (
                <DatePicker
                  style={{ width: 200 }}
                  mode="date"
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  minDate="2020-01-01"
                  maxDate="2025-12-31"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  value={new Date()}
                  onChange={(event, selectedDate) => {
                    console.log(selectedDate);
                    const currentDate = selectedDate || startDate;
                    setShowStartDate(false);
                    setStartDate(currentDate);
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              End Date*
            </Text>
            <TouchableOpacity onPress={() => setShowEndDate(true)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    paddingTop: 20,
                    paddingBottom: 5,
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  {endDate ? endDate.toDateString() : "Please select"}
                </Text>
                <MaterialIcons name="date-range" size={24} color="black" />
              </View>
              {
                endDateError !="" && (
                  <Text
                    style={{
                      color: "red",
                      marginHorizontal: 10,
                    }}
                  >
                    {endDateError}
                  </Text>
                )
              }
              {showEndDate && (
                <DatePicker
                  style={{ width: 200 }}
                  mode="date"
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  minDate="2020-01-01"
                  maxDate="2025-12-31"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  value={new Date()}
                  onChange={(event, selectedDate) => {
                    console.log(selectedDate);
                    const currentDate = selectedDate || endDate;
                    setShowEndDate(false);
                    setEndDate(currentDate);
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Grade
            </Text>
            <TextInput
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginHorizontal: 10,
              }}
              value={grade}
              onChangeText={(data) => {
                setGrade(data);
              }}
            />
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Activities and societies
            </Text>
            <TextInput
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginHorizontal: 10,
              }}
              value={activities}
              onChangeText={(data) => {
                setActivities(data);
              }}
              placeholder="Ex: Chess club, Debate team, etc."
            />
          </View>
          <View>
            <Text
              style={{
                paddingTop: 20,
                paddingHorizontal: 10,
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Description
            </Text>
            <TextInput
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginHorizontal: 10,
              }}
              value={description}
              onChangeText={(data) => {
                setDescription(data);
              }}
            />
          </View>
          <Text
            style={{
              paddingTop: 20,
              paddingHorizontal: 10,
              fontSize: 15,
              fontWeight: "300",
              marginHorizontal: 10,
            }}
          >
            Skills
          </Text>
          <Text
            style={{
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            We Recommend adding your top 5 used in experience. They'll also appear
            in your skills section.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems : "center",
              flexWrap: "wrap",
              gap: 10,
              padding: 10,
              fontSize: 15,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              marginVertical: 10,
            }}
          >
            {skills.map((item, index) => {
              return (
                <View
                  key={item}
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
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setShowSkills(true);
              }}
              style={{
                margin: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                borderColor: "#0072b1",
                borderWidth: 1,
                borderRadius: 50,
                width: 120,
              }}
            >
              <AntDesign name="plus" size={24} color="#0072b1" />
              <Text
                style={{
                  color: "#0072b1",
                  paddingLeft: 5,
                }}
              >
                Add skill
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: "#0072b1",
            width: Dimensions.get("window").width - 20,
            margin: 10,
            borderRadius: 50,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onSave}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginVertical: 5,
              color: "white",
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
        <RenderSkills
          showSkills={showSkills}
          setShowSkills={setShowSkills}
          skills={skills}
          setSkills={setSkills}
        />
      </Modal>
    );
  };

  export default RenderEducationModal;