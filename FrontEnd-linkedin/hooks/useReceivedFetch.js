import { useState, useEffect } from "react";
import axios from "axios";

const useReceivedFetch = (userId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchReceived = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}connection-requests/${userId}`
      );
      setReceived(response.data.connectionRequests);
      console.log("received fetched");
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching request");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("useEffect called");
    fetchReceived();
  }, []);

  const refetchReceived = () => {
    fetchReceived();
  };

  return { received, loading, error ,refetchReceived , setReceived};
};

export default useReceivedFetch;