import { useState , useEffect } from "react";
import axios from "axios";

const useJobDetailsFetch = ({id}) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL ;
    const [job , setJob] = useState({});
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(false);

    const fetchJob = async () => {
        try{
            setLoading(true);
            const response = await axios.get(`${url}job/${id}`);
            setJob(response.data.job);
            setError(false);
        } catch(err){
            setError(true);
            console.log("error fetching jobs",err);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchJob();
    }, []);

    const refetchJob = () => {
        fetchJob();
    }

    return { job , loading , error , refetchJob };
}

export default useJobDetailsFetch