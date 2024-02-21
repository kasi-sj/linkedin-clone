import { useState, useEffect } from "react";
import axios from "axios";
// messege in whatsapp

const useNotificationFetch = (userId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [notification, setNotification] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchNotification = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${url}notifications/${userId}`
      );
      const notificationData = response.data;
      setNotification(notificationData.notifications);
      console.log("notification fetched");
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching notification");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotification();
    }
  }, [userId]);

  const refetchNotification = () => {
    fetchNotification();
  }

  return { notification, loading, error , refetchNotification };
};

export default useNotificationFetch;
