import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { decode } from "base-64";
global.atob = decode;

const useUserFetch = (id) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [userId, setUserId] = useState("");
  
  const [user, setUser] = useState({profileImage:""});
  const [loading, setLoading] = useState(false);
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
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching id");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id) => {
    try {
      console.log("getting user")
      const response = await axios.get(
        `${url}profile/${id}`
      );
      const userData = response.data;
      return userData.user
    } catch (err) {
      console.log("error fetching user profile");
      return null;
    }
  }

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}profile/${userId}`
      );
      const userData = response.data;
      setUser(userData.user);
    } catch (err) {
      setError(true);
      console.log("error fetching user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const refetchUser = async (id) => {
    if(id){
      setUserId(id);
    }
    await fetchUserId();
    fetchUserProfile();
  };

  const updateUser = async (newUser) => {
    try{
      await axios.post(`${url}editProfile/${userId}`, newUser);
      fetchUserProfile();
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  const getFullUser = async (id,flag)=>{
    try{
      const response = await axios.get(`${url}userFullDetail/${id?id:userId}`);
      const userData = response.data;
      if(!flag)
      setUser(userData.result);
      return userData.result;
    }catch(err){
      console.log(err);
    }
  }

  const updateProfileImage = async (image)=>{
    try{
      if(!image){
        return false;
      }
      const response = await axios.post(`${url}setProfileImage/${userId}` , {profileImage : image});
      fetchUserProfile();
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }
  
  const updateBannerImage = async (image)=>{
    try{
      if(!image){
        return false;
      }
      const response = await axios.post(`${url}setBannerImage/${userId}` , {bannerImage : image});
      fetchUserProfile();
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  const updateAbout = async (about)=>{
    try{
      const response = await axios.post(`${url}setAbout/${userId}` , {about : about});
      fetchUserProfile();
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }
  return { user, loading, error, refetchUser , updateUser , getFullUser , updateProfileImage , updateBannerImage , updateAbout , getUser};
};


export default useUserFetch;
