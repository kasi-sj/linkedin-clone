import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { checkImageURL } from "../utills";
import { Image } from "react-native";

const JobCard = ({ job , onPress }) => {
  return (
    <TouchableOpacity
    onPress={()=>onPress(job.id)}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
        }}
        
      >
        <Image
          style={{
            width: 45,
            height: 45,
            margin: 10,
            borderColor: "lightgray",
            padding: 2,
            borderWidth: 1,
          }}
          source={{
            uri: checkImageURL(job.employer_logo)
              ? job.employer_logo
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
        <View
          style={{
            width: Dimensions.get("window").width - 80,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
            }}
          >
            {job.job_title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "200",
            }}
          >
            {job.job_job_title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "200",
            }}
          >
            {job.job_city ? job.job_city + ", " : ""}
            {job.job_state ? job.job_state + ", " : ""}
            {job.job_contry ? job.job_contry + " " : ""}
            {job?.job_is_remote ? "(Remote)" : "(Not Remote)"}
          </Text>
          <View
            style={{
              height: 2,
              width: "100%",
              backgroundColor: "lightgray",
              marginTop: 10,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;