import { registerForPushNotificationsAsync , sendPushNotification } from "../pushNotification";
import { useState, useEffect } from "react";
import useUserFetch from "./useUserFetch";
import axios from "axios";


const UsePushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const {user} = useUserFetch();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);

  const updateToken = async () => {
    try {
      const response = await axios.post(`${url}changeExpoToken/`, {
        userId : user.id,
        expoToken: expoPushToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateToken();
  },[user]);

  useEffect(() => {
    updateToken();
  }, [expoPushToken]);

  const sendNotification = async ({
    expoPushToken,
    title,
    body,
  }) => {
    await sendPushNotification({ expoPushToken, title, body });
  };
  return { expoPushToken, sendNotification };
};

export default UsePushNotification;
