import { useState , useEffect } from "react";
import axios from "axios";

const useMessageFetch = (id) => {
    const [roomId , setRoomId] = useState(id);
    const url = process.env.EXPO_PUBLIC_BACKEND_URL ;
    const [messages , setMessages] = useState([]);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(false);

    const fetchMessages = async () => {
        try{
            setLoading(true);
            const response = await axios.get(`${url}getMessage/${id}`);
            setMessages(response.data.messages);
            setError(false);
        } catch(err){
            setError(true);
            console.log("error fetching messages",err);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [id]);

    const refetchMessages = (id) => {
        if(id) setRoomId(id);
        fetchMessages();
    }
    return { messages , loading , error , refetchMessages ,setMessages };
};

export default useMessageFetch;
