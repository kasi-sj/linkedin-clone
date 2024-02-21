import { useState, useEffect } from "react";
import axios from "axios";

const useRoomFetch = (roomId) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [room, setRoom] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchRoom = async () => {
    try {
      setloading(true);
      const response = await axios.get(
        `${url}getRoom/${roomId}`
      );
      setRoom(response.data.room);
      setError(false);
    } catch (err) {
      setError(true);
      console.log("error fetching chat room");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const refetchRoom = () => {
    fetchRoom();
  }


  return { room, loading, error , refetchRoom};
};

export default useRoomFetch;
