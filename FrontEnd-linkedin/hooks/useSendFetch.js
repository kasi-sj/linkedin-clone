import { useState, useEffect } from "react";
import axios from "axios";

const useSendFetch = (userId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [send, setSend] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSend = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${url}sent-connection-requests/${userId}`
      );
      setSend(response.data.sentConnectionRequests);
      console.log("send fetched successfully")
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching sent");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSend();
    }
  }, [userId]);

  const refetchSent = () => {
    fetchSend();
  }

  return { send, loading, error , refetchSent  , setSend};
};


export default useSendFetch;