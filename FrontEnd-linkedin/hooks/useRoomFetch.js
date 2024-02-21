import { useState, useEffect } from "react";
import axios from "axios";

const useRoomFetch = (userId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [room, setRoom] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchRoom = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${url}peoplelist/${userId}`
      );
      setRoom(response.data.Rooms);
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching room");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRoom();
    }
  }, [userId]);

  const refetchRoom = () => {
    fetchRoom();
  }

    return { room, loading, error , refetchRoom  , setRoom};
};


export default useRoomFetch;