import { useState, useEffect } from "react";
import axios from "axios";

const useConnectionsFetch = (userId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [connections, setConnections] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchConnections = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${url}connections/${userId}`
      );
      setConnections(response.data.connections);
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching connections");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  const refetchConnections = () => {
    fetchConnections();
  }


  return { connections, loading, error , refetchConnections};
};

export default useConnectionsFetch;
