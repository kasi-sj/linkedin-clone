import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  RefreshControl,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import useJobDetailsFetch from "./../../../../../hooks/useJobDetailsFetch";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { checkImageURL } from "../../../../../utills";


const job_highlights = (job_highlights) => {
  if (
    job_highlights?.qualifications?.length > 0 ||
    job_highlights?.responsibilities?.length > 0 ||
    job_highlights?.benefits?.length > 0
  ) {
    return (
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            paddingTop: 10,
          }}
        >
          Job Highlights
        </Text>
        {points("qualifications", job_highlights?.qualifications)}
        {points("responsibilities", job_highlights?.responsibilities)}
        {points("benefits", job_highlights?.benefits)}
      </View>
    );
  } else {
    return <></>;
  }
};

const points = (name, points) => {
  if (points?.length > 0) {
    return (
      <View
        style={{
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "550",
            paddingVertical: 10,
          }}
        >
          {name}
        </Text>
        {points.map((point, index) => (
          <Text
            style={{
              paddingLeft: 5,
            }}
            key={index}
          >
            • {point}
          </Text>
        ))}
      </View>
    );
  } else {
    return <></>;
  }
};

const index = () => {
  const { id } = useGlobalSearchParams();
  const { job, loading, error, refetchJob } = useJobDetailsFetch({ id });
  console.log(job);
  return (
    <ScrollView
    refreshControl={
      <RefreshControl refreshing={loading} onRefresh={refetchJob} />
    }
      style={{
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 150,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "cover",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "grey",
          }}
          source={{
            uri: checkImageURL(job?.employer_logo)
              ? job?.employer_logo
              : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          }}
        />
      </View>
      <View>
        <Text
          style={{
            backgroundColor: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {job?.job_title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          {job.employer_name && (
            <Text
              style={{
                backgroundColor: "white",
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              {job?.employer_name ? " • " : ""}
              {job?.employer_name}
            </Text>
          )}
          {job?.job_country && (
            <Text
              style={{
                backgroundColor: "white",
                fontSize: 15,
                fontWeight: "400",
              }}
            >
              {job?.job_country ? " • " : ""} {job?.job_country}
            </Text>
          )}
          {job.job_posted_at_datetime_utc && (
            <>
              <Text>{job?.job_posted_at_datetime_utc ? " • " : ""}</Text>
              <Text
                style={{
                  backgroundColor: "white",
                  fontSize: 15,
                  fontWeight: "300",
                  color: "grey",
                }}
              >
                {moment(job?.job_posted_at_datetime_utc).fromNow()}
              </Text>
            </>
          )}
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="briefcase" size={24} color="grey" />
          {job?.job_is_remote && (
            <Text
              style={{
                backgroundColor: "white",
                fontSize: 15,
                fontWeight: "300",
                color: "grey",
              }}
            >
              Remote
            </Text>
          )}
          {job?.job_employment_type && (
            <Text
              style={{
                backgroundColor: "white",
                fontSize: 15,
                fontWeight: "300",
                color: "grey",
              }}
            >
              {job?.job_employment_type}
            </Text>
          )}
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            About the job
          </Text>
          {job?.job_job_title && (
            <Text
              style={{
                fontSize: 13,
                fontWeight: "300",
                paddingVertical: 5,
              }}
            >
              {job?.job_job_title}
            </Text>
          )}
          <View>
            {job?.job_max_salary && job?.job_min_salary && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  paddingVertical: 5,
                }}
              >
                Salary : {job?.job_min_salary} - {job?.job_max_salary}{" "}
                {job?.job_salary_currency}
              </Text>
            )}
            {job?.job_salary_period && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  paddingVertical: 5,
                }}
              >
                Salary Period : {job?.job_salary_period}
              </Text>
            )}
            {job?.job_employment_type && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  paddingVertical: 5,
                }}
              >
                Opportunity Type : {job?.job_employment_type}
              </Text>
            )}
          </View>
        </View>
        {job?.job_required_skills && job?.job_required_skills.length > 0 && (
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Required Skills
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {job?.job_required_skills.map((skill, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#e8e8ff",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    margin: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {job_highlights(job?.job_highlights)}
        <View>
          {job?.job_description && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  paddingVertical: 10,
                }}
              >
                {job?.job_description}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#0072b1",
              width: "100",
              flexDirection: "row",
              justifyContent : 'center',
              alignItems : 'center',
              borderRadius: 40,
            }}
            onPress={() => {
              Linking.openURL(job?.job_google_link);
            }}
          >
            <View style={{
              flexDirection:'row',
              alignItems : 'center',
              paddingHorizontal : 20,
              paddingVertical : 10,
              gap : 10
            }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                Apply Now
              </Text>
              <SimpleLineIcons name="share-alt" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
