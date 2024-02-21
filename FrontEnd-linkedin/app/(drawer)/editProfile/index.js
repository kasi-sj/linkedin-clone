import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import RenderPronounsModal from "../../../components/PronounsModal";
import { Entypo } from "@expo/vector-icons";
import RenderIndustryModal from "../../../components/IndustryModal";
import { AntDesign } from "@expo/vector-icons";
import AddEducationModal from "../../../components/AddEducationModal";
import RenderEducationModal from "../../../components/EducationModal";
import RenderContactInfoModal from "../../../components/ContactInfoModal";
import useUserFetch from "../../../hooks/useUserFetch";
import { RefreshControl } from "react-native";
import Toast from 'react-native-simple-toast';

const index = () => {
  const { user, updateUser, loading, refetchUser, getFullUser } =
    useUserFetch();
  useEffect(() => {
    getFullUser();
  }, [user.id]);

  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAdditionalName(user.additionalName || "");
    setPronouns(user.pronouns || "");
    setHeadline(user.headline || "");
    setIndustry(user.industry || "");
    setCity(user.city || "");
    setCountry(user.country || "");
    setContactInfo({
      email: user.contact?.email || "",
      phone: user.contact?.phone || "",
      address: user.contact?.discription || "",
      birthday: user.contact?.birthday || "",
      websites: (user.contact?.websites && user.contact?.websites[0]) || [],
    });
    if (user?.educations?.length > 0)
      setEducation([
        ...user.educations[0].map((education) => {
          if (education.isCurrent) {
            setActiveEducation({
              school: education.schoolName || "Please select",
              degree: education.degree || "",
              fieldOfStudy: education.fieldOfStudy || "",
              grade: education.grade || "",
              startDate: education.startYear || "",
              endDate: education.endYear || "",
              description: education.description || "",
            });
          }
          return {
            school: education.schoolName || "Please select",
            degree: education.degree || "",
            fieldOfStudy: education.fieldOfStudy || "",
            grade: education.grade || "",
            startDate: education.startYear || "",
            endDate: education.endYear || "",
            description: education.description || "",
          };
        }),
      ]);
  }, [user]);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [additionalName, setAdditionalName] = useState(
    user.additionalName || ""
  );
  const [pronouns, setPronouns] = useState("Please select");
  const [headline, setHeadline] = useState("");
  const [industry, setIndustry] = useState("Please select");
  const [education, setEducation] = useState([
    {
      school: "Please select",
      degree: "",
      fieldOfStudy: "",
      grade: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);
  const router = useRouter();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isPronounsModalVisible, setIsPronounsModalVisible] = useState(false);
  const [isIndustryModelVisable, setIsIndustryModelVisable] = useState(false);
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [activeEducation, setActiveEducation] = useState(education[0]);
  const [isAddEducationModalVisible, setIsAddEducationModalVisible] =
    useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [headlineError, setHeadlineError] = useState("");
  const [industryError, setIndustryError] = useState("");
  const [educationError, setEducationError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [isContactInfoModalVisible, setIsContactInfoModalVisible] =
    useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    birthday: "",
    websites: [],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user.contactInfo) {
      setContactInfo(user.contactInfo);
    }
  }, [user]);
  useEffect(() => {
    if (firstName === "") {
      setFirstNameError("First name is required");
    } else {
      setFirstNameError("");
    }
    if (lastName === "") {
      setLastNameError("Last name is required");
    } else {
      setLastNameError("");
    }
    if (headline === "") {
      setHeadlineError("Headline is required");
    } else {
      setHeadlineError("");
    }
    if (industry === "Please select") {
      setIndustryError("Industry is required");
    } else {
      setIndustryError("");
    }
    if (activeEducation.school === "Please select") {
      setEducationError("Education is required");
    } else {
      setEducationError("");
    }
    if (country === "") {
      setCountryError("Country is required");
    } else {
      setCountryError("");
    }
  }, [firstName, lastName, headline, industry, activeEducation, country]);

  const onSave = async () => {
    setSaving(true);
    if (
      firstName === "" ||
      lastName === "" ||
      headline === "" ||
      industry === "Please select" ||
      activeEducation.school === "Please select" ||
      country === ""
    ) {
      Toast.show("Please fill all required fields");
      setSaving(false);
      return;
    }
    const result = await updateUser({
      firstName,
      lastName,
      additionalName,
      pronouns,
      headline,
      industry,
      education: activeEducation,
      educations: education,
      city,
      country,
      contactInfo,
    });
    if (result) {
      router.back();
      Toast.show("Profile updated successfully");
    } else {
      Toast.show("Error while updating profile");
    }
    setSaving(false);
  };
  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getFullUser} />
        }
        style={{
          paddingBottom: 50,
          backgroundColor: "white",
        }}
      >
        <KeyboardAvoidingView>
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
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Basic info
            </Text>
            <View
              style={{
                flexDirection: "column",
                gap: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "300",
                  }}
                >
                  First name*
                </Text>
                {firstNameError != "" && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {firstNameError}
                  </Text>
                )}
                <TextInput
                  value={firstName}
                  onChangeText={(data) => {
                    setFirstName(data);
                  }}
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
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
                  Last name*
                </Text>
                {lastNameError != "" && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {lastNameError}
                  </Text>
                )}
                <TextInput
                  value={lastName}
                  onChangeText={(data) => {
                    setLastName(data);
                  }}
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
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
                  Additional name
                </Text>
                <TextInput
                  value={additionalName}
                  onChangeText={(data) => {
                    setAdditionalName(data);
                  }}
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  Pronouns
                </Text>
                <TouchableOpacity
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onPress={() => {
                    setIsPronounsModalVisible(true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                      {pronouns}
                    </Text>
                    <View
                      style={{
                        paddingTop: 20,
                        paddingBottom: 5,
                      }}
                    >
                      <FontAwesome name="caret-down" size={24} color="black" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  HeadLine*
                </Text>
                {headlineError != "" && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {headlineError}
                  </Text>
                )}
                <TextInput
                  value={headline}
                  onChangeText={(data) => {
                    setHeadline(data);
                  }}
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  Industry*
                </Text>
                {industryError != "" && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {industryError}
                  </Text>
                )}
                <TouchableOpacity
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onPress={() => {
                    setIsIndustryModelVisable(true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                      {industry}
                    </Text>
                    <View
                      style={{
                        paddingTop: 20,
                        paddingBottom: 5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setIndustry("Please select")}
                      >
                        <Entypo
                          name="circle-with-cross"
                          size={20}
                          color="gray"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  Education*
                </Text>
                {educationError != "" && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {educationError}
                  </Text>
                )}
                <TouchableOpacity
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onPress={() => {
                    setIsEducationModalVisible(true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        paddingTop: 20,
                        paddingHorizontal: 10,
                        fontSize: 15,
                        fontWeight: "300",
                        color: "gray",
                      }}
                    >
                      {activeEducation.school +
                        " " +
                        activeEducation.degree +
                        " " +
                        activeEducation.fieldOfStudy}
                    </Text>
                    <View
                      style={{
                        paddingTop: 20,
                        paddingBottom: 5,
                      }}
                    >
                      <FontAwesome name="caret-down" size={24} color="black" />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsAddEducationModalVisible(true);
                  }}
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 20,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <AntDesign name="plus" size={20} color="#0072b1" />
                  <Text
                    style={{
                      color: "#0072b1",
                      paddingHorizontal: 6,
                      paddingVertical: 4,
                      fontSize: 15,
                    }}
                  >
                    Add Education
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: "black",
                    height: 1,
                    marginHorizontal: 10,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Location
                </Text>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  Country/Region*
                </Text>
                {countryError != "" && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {countryError}
                  </Text>
                )}
                <TextInput
                  value={country}
                  onChangeText={(data) => {
                    setCountry(data);
                  }}
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  City
                </Text>
                <TextInput
                  value={city}
                  onChangeText={(data) => {
                    setCity(data);
                  }}
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 1,
                    marginHorizontal: 10,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Contact info
                </Text>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  Add or edit your email , and more
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsContactInfoModalVisible(true);
                  }}
                >
                  <Text
                    style={{
                      paddingTop: 20,
                      paddingHorizontal: 10,
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#0072b1",
                      paddingBottom: 20,
                    }}
                  >
                    Edit contact info
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <RenderPronounsModal
            isModalVisible={isPronounsModalVisible}
            setIsModalVisible={setIsPronounsModalVisible}
            setPronouns={setPronouns}
            pronouns={pronouns}
          />
          <RenderIndustryModal
            industry={industry}
            isIndustryModelVisable={isIndustryModelVisable}
            setIndustry={setIndustry}
            setIsIndustryModelVisable={setIsIndustryModelVisable}
          />
          <AddEducationModal
            isEducationModalVisible={isAddEducationModalVisible}
            setIsEducationModalVisible={setIsAddEducationModalVisible}
            education={education}
            setEducation={setEducation}
          />
          <RenderEducationModal
            isModalVisible={isEducationModalVisible}
            setIsModalVisible={setIsEducationModalVisible}
            setEducation={setActiveEducation}
            education={activeEducation}
            availableEducation={education}
          />
          <RenderContactInfoModal
            isContactInfoModalVisible={isContactInfoModalVisible}
            setIsContactInfoModalVisible={setIsContactInfoModalVisible}
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
        disabled={saving}
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
          {saving ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
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
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default index;
