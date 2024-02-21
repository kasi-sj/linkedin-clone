import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import DatePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { RadioButton } from "react-native-paper";
import { generateKey } from "../utills";
import Toast from 'react-native-simple-toast';


const availableWebsiteType = [
  "Personal",
  "Company",
  "Blog",
  "RSS Feed",
  "Portfolio",
  "Other",
];

const RenderWebsiteTypeModal = ({
  isModalVisible,
  setIsModalVisible,
  setWebsiteType,
  websiteType,
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
            height: "60%",
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
              website Type
            </Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setWebsiteType(value);
                setIsModalVisible(false);
              }}
              value={websiteType}
            >
              {availableWebsiteType.map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      setWebsiteType(item);
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

const RenderWebsite = ({ website, setWebsite, id }) => {
  // useEffect(() => {
  //   setWebsiteUrl(website?.websiteType||"Please select");
  //   setWebsiteType(website?.websiteUrl||"");
  // })
  const [websiteType, setWebsiteType] = useState(website?.websiteType||"Please select");
  const [websiteUrl, setWebsiteUrl] = useState(website?.websiteUrl||"");
  const [isWebsiteTypeModalVisible, setIsWebsiteTypeModalVisible] =
    useState(false);
  const onDelete = () => {
    setWebsite((prev) => {
      return prev.filter((item) => {
        return item.id !== id;
      });
    });
  };
  useEffect(() => {
    setWebsite((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            websiteType: websiteType,
            websiteUrl: websiteUrl,
          };
        }
        return item;
      });
    });
  }, [websiteType, websiteUrl]);
  return (
    <>
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        Website URL
      </Text>
      <TextInput
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 1,
          marginHorizontal: 10,
        }}
        value={websiteUrl}
        onChangeText={(data) => {
          setWebsiteUrl(data);
        }}
      />
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 10,
          paddingVertical: 15,
        }}
      >
        Website type
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 10,
          borderBottomColor: "black",
          borderBottomWidth: 1,
          padding: 5,
        }}
        onPress={() => {
          setIsWebsiteTypeModalVisible(true);
        }}
      >
        <Text>{websiteType}</Text>
        <AntDesign name="caretdown" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
        onPress={onDelete}
      >
        <MaterialCommunityIcons name="delete-outline" size={24} color="gray" />
        <Text
          style={{
            paddingHorizontal: 10,
            color: "gray",
            fontSize: 15,
          }}
        >
          Remove
        </Text>
      </TouchableOpacity>
      {
        <RenderWebsiteTypeModal
          isModalVisible={isWebsiteTypeModalVisible}
          setIsModalVisible={setIsWebsiteTypeModalVisible}
          setWebsiteType={setWebsiteType}
          websiteType={websiteType}
        />
      }
    </>
  );
};

const RenderContactInfoModal = ({
  isContactInfoModalVisible,
  setIsContactInfoModalVisible,
  contactInfo,
  setContactInfo,
}) => {
  console.log(contactInfo)
  useEffect(() => {
    setPhone(contactInfo.phone || "");
    setAddress(contactInfo.address || "");
    setBirthday(contactInfo.birthday || "");
    setWebsites(contactInfo.websites || []);
  }, [contactInfo]);
  const [phone, setPhone] = useState(contactInfo.phone || "");
  const [phoneErr , setPhoneErr] = useState(false);
  const [address, setAddress] = useState(contactInfo.address || "");
  const [birthday, setBirthday] = useState(contactInfo.birthday || "");
  const [showBirthday, setShowBirthDay] = useState(false);
  const [websites, setWebsites] = useState(contactInfo.websites || []);
  const onSave = () => {
    if(!phoneErr){
      Toast.show("Please enter a valid phone number (10 digits)");
      return;
    }
    setContactInfo({
      email: contactInfo.email,
      phone,
      address,
      birthday,
      websites,
    });
    setIsContactInfoModalVisible(false);
  };
  useEffect(()=>{
    setPhoneErr(phone.length==10);
  },[phone])
  return (
    <Modal
      animationType="slide"
      visible={isContactInfoModalVisible}
      onRequestClose={() => {
        setIsContactInfoModalVisible(!isContactInfoModalVisible);
      }}
    >
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 10,
            }}
            onPress={() => {
                setIsContactInfoModalVisible(false);
            }
            }
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Edit contact info
          </Text>
        </View>
        <View>
          <Text
            style={{
              padding: 10,
              color: "gray",
              fontSize: 12,
            }}
          >
            * indicate required
          </Text>

          <Text
            style={{
              padding: 10,
              fontSize: 20,
            }}
          >
            Email
          </Text>
          <Text
            style={{
              color: "#0072b1",
              padding: 10,
            }}
          >
            {contactInfo.email}
          </Text>
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                paddingTop: 20,
                fontSize: 15,
              }}
            >
              Phone number*
            </Text>
            <TextInput
              keyboardType="number-pad"
              value={phone}
              onChangeText={(data) => {
                setPhone(data);
              }}
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                width: Dimensions.get("window").width - 20,
              }}
            />
            <Text style={{
              color:"red",
              fontSize:10
            }}>
              {phoneErr?"":"Please enter a valid phone number (10 digits)"}
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                paddingTop: 20,
                fontSize: 15,
              }}
            >
              Address
            </Text>
            <TextInput
              value={address}
              onChangeText={(data) => {
                setAddress(data);
              }}
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                width: Dimensions.get("window").width - 20,
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
              Birth Date
            </Text>
            <TouchableOpacity onPress={() => setShowBirthDay(true)}>
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
                  {birthday ? birthday.toDateString() : "Please select"}
                </Text>
                <MaterialIcons name="date-range" size={24} color="black" />
              </View>
              {showBirthday && (
                <DatePicker
                  style={{ width: 200 }}
                  mode="date"
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  minDate="2020-01-01"
                  maxDate="2025-12-31"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  value={birthday || new Date()}
                  onChange={(event, selectedDate) => {
                    console.log(selectedDate);
                    const currentDate = selectedDate || startDate;
                    setShowBirthDay(false);
                    setBirthday(currentDate);
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "600",
                paddingHorizontal: 10,
                paddingVertical: 15,
              }}
            >
              Website
            </Text>
            {websites.map((item, index) => {
              return (
                <RenderWebsite
                  key={item.id}
                  id={item.id}
                  website={item}
                  setWebsite={setWebsites}
                />
              );
            })}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
              onPress={() => {
                setWebsites([
                  ...websites,
                  {
                    id: generateKey(),
                    websiteType: "Please select",
                    websiteUrl: "",
                  },
                ]);
              }}
            >
              <AntDesign name="plus" size={24} color="#0072b1" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  color: "#0072b1",
                  paddingHorizontal: 10,
                }}
              >
                Add website
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
      </ScrollView>
    </Modal>
  );
};

export default RenderContactInfoModal