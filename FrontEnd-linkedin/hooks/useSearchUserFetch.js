import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { decode } from "base-64";
global.atob = decode;

const useSearchUserFetch = (id,keyWord) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [searchQuery, setSearchQuery] = useState(keyWord);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchUserId = async () => {
    try {
      if(id){
        setUserId(id);
        return;
      }
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    } catch (err) {
      setError(true);
      console.log("error fetching id");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersProfile = async () => {
    try {
      setLoading(true);
      console.log("fetching usess search")
      const response = await axios.post(
        `${url}getUsersByKeyword/${userId}`,{
            keyword:searchQuery
        }
      );
      const userData = response.data;
      setUsers(userData.users);
      console.log("users fetched");
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching search users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId && searchQuery) {
      fetchUsersProfile();
    }
  }, [userId , searchQuery]);

  const refetchUsers = (id) => {
    if(id){
      setUserId(id);
    }
    fetchUserId();
  };

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  return { users, loading, error, refetchUsers  , onSearch , setUsers };
};

export default useSearchUserFetch;
