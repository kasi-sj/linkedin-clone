import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native";
import useUserFetch from "../../../../hooks/useUserFetch";
import useJobFetch from "../../../../hooks/useJobFetch";
import { useEffect, useState } from "react";
import { Search } from "../../../../context/actions/searchAction";
import { connect } from "react-redux";
import JobCard from "../../../../components/JobCard";
import { useRouter } from "expo-router";

const jobTypes = [
  "Full Time",
  "Part Time",
  "Contractor",
  "Freelance",
  "Internship",
  "Temporary",
  "Volunteer",
  "Other",
];

const index = ({ search, Search }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [jobType, setJobType] = useState(jobTypes[0]);
  const { user } = useUserFetch();
  const { jobs, loading, error, refetchJobs } = useJobFetch({
    keyword: search,
    page,
  });

  const onPress = (id) => {
    router.push("(drawer)/(tabs)/jobs/jobDetails/" + id);
  };

  useEffect(() => {
    refetchJobs();
  }, [search]);
  return (
    <View
      style={{
        marginVertical: 20,
      }}
    >
      <View
        style={{
          height: "500",
        }}
      >
        <FlatList
          data={jobTypes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: search === item ? "#E0E0E0" : "#fff",
                padding: 10,
                borderRadius: 10,
                marginHorizontal: 5,
                marginVertical: 10,
              }}
              onPress={() => {
                setJobType(item);
                Search(item);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View>
        <View
          style={{
            height: 20,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginHorizontal: 10,
            }}
          >
            Recommanded for you
          </Text>
          <View
            style={{
              marginTop: 10,
            }}
          >
            {jobs && (
              <FlatList
                data={jobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <JobCard key={item.id} job={item} onPress={onPress} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={refetchJobs}
                  />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>
                      {loading ? (
                        "Loading..."
                      ) : error ? (
                        "Error fetching jobs"
                      ) : (
                        <ActivityIndicator size={"large"} />
                      )}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  search: state.search.search,
});

const mapDispatchToProps = {
  Search,
};

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({});
